"use client"

import { useMutation } from "convex/react"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from "../../../../convex/_generated/api"
import Page404 from "@/app/errors/404"
import { useRouter } from "next/navigation"
import { Ban, Check, Loader2 } from "lucide-react"

type Props = {
    params: {
      id: string
    }
}

export default function File({ params: { id } }: Props) {
    const [loading, setLoading] = useState(true)
    const [url, setUrl] = useState<string | null>(null)
    const [found, setFound] = useState(true)
    const [scanResult, setScanResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const fileLink = useMutation(api.files.getLink)
    const router = useRouter()

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const result = await fileLink({ linkId: id })
                if (result) {
                    setUrl(result)
                } else {
                    setUrl(null)
                }
                setLoading(false)
            } catch (e) {
                setFound(false)
            }
        }
        
        fetchLink()
    }, [fileLink, id])

    const handleScan = async () => {
        if (!url) return 

        const apiKey = process.env.VIRUSTOTAL_API_KEY

        const options = {
            method: 'POST',
            url: 'https://www.virustotal.com/api/v3/urls',
            headers: {
                accept: 'application/json',
                'x-apikey': apiKey,
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({ url }).toString()
        } 

        try {
            setScanResult(null) 
            setError(null) 

            const response = await axios.request(options) 
            const analysisId = response.data.data.id 

            const analysisResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                headers: {
                    accept: 'application/json',
                    'x-apikey': apiKey,
                },
            }) 

            const stats = analysisResponse.data.data.attributes.stats 

            if (stats.malicious > 0) {
                setError('Сканирование обнаружело вирус. Переход не выполнен') 
            } else {
                setScanResult('Сканирование произошло успешно') 
                router.push(url)
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Ошибка сканирования')
        }
    } 

    useEffect(() => {
        if (url) {
            handleScan() 
        }
    }, [url])

    if (!found) {
        return <Page404 />
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center text-center h-screen">
            {!scanResult && !error && (
                <Loader2 className="animate-spin"/>
            )}
            {scanResult && (
                <div className="text-green-500 flex flex-col justify-center items-center">
                    <Check color="#22c55e"/>
                    <span>
                        {scanResult}
                    </span>
                </div>
            )}
            {error &&
                <div className="text-red-600 flex flex-col justify-center items-center">
                    <Ban color="#dc2626"/>
                    <span>
                        {error}
                    </span>
                </div>
            }
            {!scanResult && !error && <div>Сканирование...</div>}
        </div>
    ) 
}

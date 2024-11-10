"use client"

import { useMutation } from "convex/react"
import { useEffect, useState } from 'react'
import { api } from "../../../../convex/_generated/api"
import Page404 from "@/app/errors/404"
import { redirect } from "next/navigation"

type Props = {
    params: {
      id: string
    }
}

export default function File({ params: { id } }: Props) {
    const [loading, setLoading] = useState(true)
    const [url, setUrl] = useState<string | null>(null)
    const [found, setFound] = useState(true)
    const fileLink = useMutation(api.files.getLink)

    useEffect(() => {
        const fetchLink = async () => {
            try{
                const result = await fileLink({ linkId: id })
                if (result) {
                    setUrl(result)
                } else {
                    setUrl(null)
                }
                setLoading(false)
            } catch (e){
                setFound(false)
            }
        }
        
        fetchLink()
    }, [fileLink, id])

    if(!found){
        return <Page404/>
    }

    if (loading) {
        return <div>Redirect...</div>
    }

    redirect(`${url}`)
}

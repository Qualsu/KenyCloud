"use client"

import Image from "next/image";
import img from "../../../../public/image/Landing.png"
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";

export default function Main(){

    const { isSignedIn } = useUser()
    const { isLoading } = useConvexAuth()

    return (
        <section className="flex justify-center md:flex-row flex-col items-center mt-12">
            <Image src={img} width="700" alt="" className="m-2 md:mr-2 animate-fade-right animate-duration-1000 animate-delay-[100ms] animate-ease-in-out"/>
            <div className="text-center md:text-left mt-6 mx-2 animate-fade-left animate-duration-1000 animate-delay-[100ms] animate-ease-in-out">
                <div className="text-5xl lg:text-6xl text-white my-5 md:my-2">
                    <h1 className="text-main-whitedark dark:text-main font-bold filter flex items-center justify-center md:justify-normal">
                        <span className="text-main-grey dark:text-white-grey">Keny</span>Cloud
                    </h1>
                </div>
                <h3 className="text-2xl break-word max-w-[500px] text-gray-600 dark:text-gray-50 px-4 md:px-0">Open source Файловое хранилище</h3>
                {isLoading ? (
                    <Loader2 className="animate-spin mt-6"/>
                ) : (
                    <>
                        {isSignedIn ? (
                            <a href="/dashboard/files">
                                <Button className="mt-2">Перейти</Button>
                            </a>
                        ) : (
                            <SignedOut>
                                <SignInButton>
                                    <a href="/auth/sign-in">
                                        <Button className="mt-2">Войти</Button>
                                    </a>
                                </SignInButton>
                            </SignedOut>
                        )}
                        <a href="https://github.com/sandstonehub/kenycloud" className="ml-2" target="_blank" rel="noopener noreferrer">
                            GitHub {"->"}
                        </a>
                    </>
                )}
            </div>
        </section>
    )
}
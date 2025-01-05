"use client"

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function Header(){

    const { isLoading } = useConvexAuth()

    return (
    <div className="header border-b py-4 bg-white-light dark:bg-zinc-950">
        <div className="container mx-3 justify-between flex items-center md:mx-auto">
            <Link href="/">
                <h1 className="text-main-whitedark dark:text-main font-bold filter flex items-center">
                    <span className="text-main-grey dark:text-zinc-500">Keny</span>Cloud
                </h1>
            </Link>
            {isLoading ? (
                <Loader2 className="animate-spin"/>
            ) : (
                <div className="flex gap-2">
                    <OrganizationSwitcher/>
                    <UserButton/>
                    <SignedOut>
                        <SignInButton>
                            <a href="/auth/sign-in">
                                <Button>Войти</Button>
                            </a>
                        </SignInButton>
                    </SignedOut>
                </div>
            )}
        </div>
    </div>
    )
}
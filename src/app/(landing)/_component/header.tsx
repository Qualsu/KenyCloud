import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header(){
    return (
    <div className="header border-b py-4 bg-white-light">
        <div className="container mx-3 justify-between flex items-center md:mx-auto">
            <Link href="/">
                <h1 className="text-main-whitedark font-bold filter flex items-center">
                    <span className="text-main-grey">Keny</span>Cloud
                </h1>
            </Link>
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
        </div>
    </div>
    )
}
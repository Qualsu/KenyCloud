import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header(){
    return <div className="border-b py-4 bg-white-light">
        <div className="container mx-auto justify-between flex">
            <h1 className="text-main-whitedark font-bold filter"><span className="text-main-grey">Keny</span>Cloud</h1>
            <div className="flex gap-2">
                <OrganizationSwitcher/>
                <UserButton/>
                <SignedOut>
                    <SignInButton>
                        <Button>Войти</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>
}
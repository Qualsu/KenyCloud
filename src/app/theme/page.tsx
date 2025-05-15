import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Check, Cloud, Loader2 } from "lucide-react";

export default function Theme(){
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <div className="flex flex-row items-center gap-2">
                <ModeToggle/>
                <h1>{"<-"} Выберите тему</h1>
            </div>

            <Separator className="w-80 h-0.5"/>

            <p>Текст</p>
            <Button>Кнопка</Button>
            
            <div className="flex flex-row gap-x-4">
                <Check/>
                <Cloud/>
                <Loader2 className="animate-spin"/>
            </div>
        </div>
    )
}
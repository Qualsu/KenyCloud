import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "../../../../convex/_generated/dataModel"
import { 
    AppWindow,
    ArchiveIcon, 
    AudioLinesIcon, 
    Code2Icon, 
    DatabaseIcon, 
    FileIcon, 
    ImageIcon, 
    ListIcon, 
    PresentationIcon, 
    VideoIcon 
} from "lucide-react"
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelative } from 'date-fns'
import { FileCardActions, getFileImageUrl } from "./file-actions"

export function FileCard({file}: {file: Doc<"files"> & {isFavorited: boolean}}){

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })

    const typeIcons = {
        image: <ImageIcon/>,
        imageother: <ImageIcon/>,
        presentation: <PresentationIcon/>,
        table: <ListIcon/>,
        txt: <FileIcon/>,
        audio: <AudioLinesIcon/>,
        video: <VideoIcon/>,
        exe: <AppWindow/>,
        db: <DatabaseIcon/>,
        programming: <Code2Icon/>
    } as Record<Doc<"files">["type"], ReactNode>

    return (
    <Card>
        <CardHeader className="relative">
            <CardTitle className="text-base font-normal">
                <div className="break-all flex gap-2">
                    <div>{typeIcons[file.type]}</div>{" "}
                    {file.name}
                </div>
            </CardTitle>
            <div className="absolute top-1 right-1 ">
                <FileCardActions isFavorited={file.isFavorited} file={file}/>
            </div>
            {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="break-words h-[200px] flex justify-center items-center">
            {
                file.type === "image" && <Image alt={file.name} width="100" height="150" className="max-w-[130px] max-h-[180px]" src={getFileImageUrl(file.fileId)}/>
            }
            {
                file.type === "imageother" && <ImageIcon className="w-20 h-20"/>
            }
            {
                file.type === "presentation" && <PresentationIcon className="w-20 h-20"/>
            }
            {
                file.type === "table" && <ListIcon className="w-20 h-20"/>
            }
            {
                file.type === "txt" && <FileIcon className="w-20 h-20"/>
            }
            {
                file.type === "audio" && <AudioLinesIcon className="w-20 h-20"/>
            }
            {
                file.type === "video" && <VideoIcon className="w-20 h-20"/>
            }
            {
                file.type === "exe" && <AppWindow className="w-20 h-20"/>
            }
            {
                file.type === "db" && <DatabaseIcon className="w-20 h-20"/>
            }
            {
                file.type === "programming" && <Code2Icon className="w-20 h-20"/>
            }
            {
                file.type === "archive" && <ArchiveIcon className="w-20 h-20"/>
            }
        </CardContent>
        <CardFooter className="flex justify-between">
            <div className="flex gap-2 text-gray-500 dark:text-gray-300 items-center">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {userProfile?.name}
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-300 mx-3">
                Загружено {formatRelative(new Date(file._creationTime), new Date())}
            </div>
        </CardFooter>
    </Card>
  )
  
}
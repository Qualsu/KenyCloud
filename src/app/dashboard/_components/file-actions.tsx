import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { EditIcon, FileIcon, Loader2, MoreVertical, Share2Icon, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/hooks/use-toast"
import { Protect, useOrganization, useUser } from "@clerk/nextjs"
import Image from "next/image"
import starImg from "../../../../public/icon/Star.svg"
import unstarImg from "../../../../public/icon/UnStar.svg"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    title: z.string().min(2).max(69)
})

const copyTextToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
}

export function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited:boolean }){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isAbsoluteConfirmOpen, setIsAbsoluteConfirmOpen] = useState(false)
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const deleteFile = useMutation(api.files.deleteFile)
    const renameFile = useMutation(api.files.renameFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const absoluteDeleteFile = useMutation(api.files.absoluteDeleteFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const me = useQuery(api.users.getMe)
    const organization = useOrganization()
    const user = useUser()
    const { toast } = useToast()
    
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(!orgId) return
                
        try{
          await renameFile({
            name: values.title,
            fileId: file._id,
          })
    
          form.reset()
          setIsRenameOpen(false)
      
          toast({
            variant: "success",
            title: "Успешно!",
            description: "Ваш файл успешно переименнован"
          })
    
        } catch (error){
    
          toast({
            variant: "destructive",
            title: "Попробуйте позже",
            description: "Ваш файл не может быть переименнован, попробуйте позже"
          })
    
        }
      }

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded){
        orgId = organization.organization?.id ?? user.user?.id
    }

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие переместит ваш файл в корзину, а при повторном действии, удалит его навсегда без возможности восстановления
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({fileId: file._id})
                            toast({
                                variant: "default",
                                title: "Файл удален",
                                description: "Ваш файл был перемещен в корзину, перейдите чтобы его восстановить"
                            })
                        }}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isAbsoluteConfirmOpen} onOpenChange={setIsAbsoluteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие полностью удалит ваш файл без возможность восстановления
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await absoluteDeleteFile({fileId: file._id})
                            toast({
                                variant: "default",
                                title: "Файл удален",
                                description: "Ваш файл успешно удален"
                            })
                        }}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isRenameOpen} onOpenChange={(isOpen) => {
                    setIsRenameOpen(isOpen)
                    form.reset()
                }}
            >
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="mb-4">Переименовать ваш файл</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Название файла" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-2">
                                {form.formState.isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>)}
                                Переименовать
                            </Button>
                            </form>
                        </Form>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    
                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        window.open(getFileImageUrl(file.fileId), "_blank")
                    }}>
                        <FileIcon className="w-4 h-4"/> Открыть
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        copyTextToClipboard(getFileForCopyLink(file.linkId))
                        toast({
                            variant: "default",
                            title: "Ссылка скопирована",
                          })
                    }}>
                        <Share2Icon className="w-4 h-4"/> Поделиться
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                        toggleFavorite({fileId: file._id})
                    }}>
                        {isFavorited ? (
                            <div className="flex gap-1 items-center">
                                <Image src={starImg} className="w-4 h-4" alt="избранные"/> Удалить из Избранных
                            </div>
                        ):(
                            <div className="flex gap-1 items-center">
                                <Image src={unstarImg} className="w-4 h-4" alt="избранные"/> Добавить в Избранные
                            </div>
                        )}
                    </DropdownMenuItem>

                    <Protect
                        condition={(check) => {
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?._id
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                            setIsRenameOpen(true)
                        }}>
                            <div className="flex gap-1 items-center cursor-pointer">
                                <EditIcon className="w-4 h-4"/> Переименовать
                            </div>
                        </DropdownMenuItem>
                    </Protect>

                    <Protect
                        condition={(check) => {
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?._id
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                            if (file.shouldDelete){
                                restoreFile({
                                    fileId: file._id
                                })
                            } else {
                                setIsConfirmOpen(true)
                            }
                            
                        }}>
                            {file.shouldDelete ? (
                                <div className="flex gap-1 text-green-500 items-center cursor-pointer">
                                    <UndoIcon className="w-4 h-4"/> Восстановить
                                </div>
                            ) :
                            (<div className="flex gap-1 text-red-500 items-center cursor-pointer">
                                <TrashIcon className="w-4 h-4"/> Удалить
                            </div>)
                            }
                        </DropdownMenuItem>
                    </Protect>
                    
                    {file.shouldDelete && (
                        <Protect
                            condition={(check) => {
                                return check({
                                    role: "org:admin"
                                }) || file.userId === me?._id
                            }}
                            fallback={<></>}
                        >
                            <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
                                setIsAbsoluteConfirmOpen(true)
                            }}>
                                
                                <div className="flex gap-1 text-red-500 items-center cursor-pointer">
                                    <TrashIcon className="w-4 h-4"/> Удалить
                                </div>
                            </DropdownMenuItem>
                        </Protect>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function getFileImageUrl(fileId: Id<"_storage">): string{
    return `${process.env.NEXT_PUBLIC_CONVEX_ACTION_URL}/getImage?storageId=${fileId}`
}

export function getFileForCopyLink(linkId: string | undefined): string{
    return `https://keny.cloud/file/${linkId}`
}
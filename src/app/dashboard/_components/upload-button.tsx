"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  useOrganization, 
  useUser
} from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { Loader2, TriangleAlert, X } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(2).max(69),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
})

export function UploadButton() {
  const { toast } = useToast()
  const organization = useOrganization()
  const user = useUser()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined
    },
  })

  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!orgId) return

    const postUrl = await generateUploadUrl()
    const fileType = values.file[0].type
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    })
    const { storageId } = await result.json()

    console.debug(fileType)
    const types = {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "txt",
      "application/rtf": "txt",
      "text/csv": "table",
      "application/vnd.ms-excel": "table",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "table",
      "text/plain": "txt",
      "image/bmp": "imageother",
      "image/gif": "imageother",
      "image/svg+xml": "imageother",
      "image/jpeg": "image",
      "image/png": "image",
      "audio/mpeg": "audio",
      "audio/ogg": "audio",
      "audio/wav": "audio",
      "video/avi": "video",
      "video/flac": "video",
      "video/mp4": "video",
      "video/quicktime": "video",
      "video/x-matroska": "video",
      "application/vnd.sqlite3": "db",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "presentation",
      "application/pdf": "presentation",
      "application/x-zip-compressed": "archive",
    } as Record<string, Doc<"files">["type"]>
    
    try{
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: types[fileType]
      })

      form.reset()
      setIsFileDialogOpen(false)
  
      toast({
        variant: "success",
        title: "Успешно!",
        description: "Ваш файл успешно загружен"
      })

    } catch (error){
      console.error(error)
      toast({ 
        variant: "destructive",
        title: "Попробуйте позже",
        description: "Ваш файл не может быть загружен, попробуйте позже"
      })

    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  const createFile = useMutation(api.files.createFile)

  return (
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
          setIsFileDialogOpen(isOpen)
          form.reset()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              
              }}>
                Загрузить файл
            </Button>
            </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">Загрузить ваш файл</DialogTitle>
                  <DialogDescription>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Загаловок</FormLabel>
                                <FormControl>
                                  <Input placeholder="Название файла" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="file"
                            render={() => (
                              <FormItem>
                                <FormLabel>Файл</FormLabel>
                                <FormControl>
                                  <Input type="file" {...fileRef}/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div>
                            <p className="flex items-center flex-row"><TriangleAlert className="w-5 h-5 mr-1"/> На данный момент загрузка отключена</p>
                            <i className="text-[12px] opacity-50">от 15.05.25</i>
                          </div>
                        </form>
                      </Form>
                  </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
  )
}
"use client"
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { useOrganization, useUser } from '@clerk/nextjs'
import { Loader2, Upload, UploadCloudIcon, X } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { allAlloweedTypes } from '../../app/data/data'
import { useRouter } from 'next/navigation'

interface uploadDialogProps {
    onUploadSuccess?: () => void,
    trigger?: React.ReactElement,
}
function DocumentUploadDialog({ onUploadSuccess, trigger }: uploadDialogProps) {
    const { organization } = useOrganization()
    const { user } = useUser()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [documentName, setDocumentName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const router = useRouter()

    const handleCancelBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); //to prevent Event Bubbling and not to execute the (label or upload input)
        setSelectedFile(null)
        if (selectedFile) fileInputRef.current = null
    }
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return
        if(file.size>10 * 1024 * 1024) { // if file > 10MB
            toast.error("File size must be less than 10MB")
            // setSelectedFile(null)
            // e.target.value = ""
            return
        }
        if (!allAlloweedTypes.includes(file.type)) {
            toast.error("This file type is not supported")
            // setSelectedFile(null)
            // e.target.value = ""
            return
        }
        setDocumentName(file.name.replace(/\.[^/.]+$/, "")) // remove file extension from name
        setSelectedFile(file)
    }

    const handleUpload = async() => {
        if(!organization || !user || !selectedFile){
            toast.error("Please select a file and make sure you are logged in")
            return
        }
        if(!documentName.trim()){
            toast.error("Please enter a document name")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("name",documentName)
        formData.append("organizationId", organization.id)
        if(selectedFile) formData.append("file", selectedFile)
        try{
            const response =await fetch("/api/documents",{
                method: "POST",
                body: formData
            })
            if(response.ok){
                toast.success("Document uploaded successfully")
   
                //Reset the form
                setDocumentName("")
                setSelectedFile(null)
                setIsOpen(false)
                onUploadSuccess?.()
            }else{
                const error = await response.json()
                console.log(error, "the error")
                toast.error(error.error || "Failed to upload document")
                 
                // const error: { error?: string; message?: string } = await response.json()
                // console.error("Document upload failed:", error)
                // toast.error(error.error || error.message || "Failed to upload document")
            }
        }catch(err:any){
            console.error("Upload error: ", err)
            toast.error("Upload error: ", err)
        }finally{
            setIsUploading(false)
            await new Promise((resolve) => setTimeout(resolve, 500)); // wait for 0.5s before calling onUploadSuccess to ensure the document is available in the database
            router.refresh()
        }
     }
    const handleDialogOpenChange = (open: boolean) => {
        setIsOpen(open)
        if(!open){
            setDocumentName("")
            setSelectedFile(null)
            if(fileInputRef.current) fileInputRef.current.value = "" // the if condition, if the input element is not mounted yet, this line will not be executed
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger render={trigger || <Button><Upload className="h-4 w-4 mr-2"/> Upload Document</Button>} />
            <DialogContent>
                <DialogHeader className='sm:max-w-125'>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>upload file for analysis</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Document Name *
                        </label>
                        <Input placeholder='enter document name' value={documentName} onChange={(e) => setDocumentName(e.target.value)} disabled={isUploading} />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Upload file</label>
                        <div className='border2 border-dashed rounded-lg p-6 text-center'>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept='.txt, .pdf, .doc, .docx, .md' className='hidden' id="file-upload" disabled={isUploading} />
                            <label htmlFor='file-upload' className='cursor-pointer'>
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className='h-8 w-8 text-gray-500' />
                                    <span className='font-medium'>{selectedFile ? selectedFile.name : "click to select file"}</span>
                                    <span className='text-sm text-gray-500'>Supports: .txt, .pdf, .doc, .docx, .md (Max 10MB)</span>
                                    {selectedFile && (
                                        <Button type='button' variant='ghost' size='sm' onClick={handleCancelBtn}>
                                            <X className='h-3 w-3 mr-1' />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setIsOpen(false)}>
                        <X className='h-3 w-3 mr-1' />
                        Cancel
                    </Button>
                    <Button variant='outline' onClick={handleUpload} disabled={isUploading || !documentName.trim()}>
                        {isUploading ? (
                            <>
                                <Loader2 className='animate-spin h-4 w-4 mr-2' />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className='h-4 w-4 mr-2' />
                                Upload Document
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default DocumentUploadDialog
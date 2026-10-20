import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { useOrganization, useUser } from '@clerk/nextjs'

function DocumentCard() {
    const { organization } = useOrganization()
    const { user } = useUser()
    const inputRef = useRef("")
    const [isUploading, setIsLoading] = useState(false)
    const [documentName, setDocumentName] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog>
            <DialogTrigger></DialogTrigger>
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
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default DocumentCard
'use client'
import { formatFileSize } from '@/app/data/data'
import DocumentCard from '@/components/document/Document-card'
import DocumentUploadDialog from '@/components/document/document-upload-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Document } from '@/types'
import { useOrganization } from '@clerk/nextjs'
import { FileText, Loader2 } from 'lucide-react'
import React, { use, Suspense, useState, useEffect } from 'react'
import { toast } from 'sonner'


export default function DocumentsPage() {
    const { organization } = useOrganization()
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(false);

    async function fetchingData() {
        if (!organization) return;
        setIsLoading(true)
        try {
            const response = await fetch(`/api/documents?organizationId=${organization.id}`)
            if (response.ok) {
                const data = await response.json()
                setDocuments(data.documents)
            }
        } catch (err) {
            console.error("failed to fetch documents: ", err)
            toast.error("Failed to fetch documents")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchingData()
    }, [organization])
    console.log(documents, " myDocs")
    return (
        <div className='space-y-8'>
            {/* // Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1>Documents</h1>
                    <p className='text-gray-600'>Upload and analyze documents in {organization?.name}</p>
                </div>
            </div>
            {/* // Upload dialog */}
            <DocumentUploadDialog />
            {/* // stats bar */}
            {documents.length > 0 && !isLoading && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-green-600'>{documents.length}</div>
                                <p className='text-sm text-gray-500'>Total Documents</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-green-600'>{documents?.filter(doc => doc.aiSummary).length}</div>
                                <p className='text-sm text-gray-500'>Analyzed</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='pt-6'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-green-600'>{formatFileSize(documents?.reduce((total, doc) => total + doc.fileSize, 0))}</div>
                                <p className='text-sm text-gray-500'>Total Size</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* // documents list */}
            <Card>
                <CardHeader>
                    <CardTitle>Documents ({documents.length})</CardTitle>
                    {isLoading && (
                        <Loader2 className='h-4 w-4 inline ml-2 animate-spin' />
                    )}
                    <CardDescription>
                        {documents.filter(doc => doc.aiSummary).length} analyzed.
                        {documents.filter(doc => !doc.aiSummary).length} pending.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <>
                            <div className='text-center py-12'>
                                <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
                                <p className="text-gray-600">Loading Documents</p>
                            </div>
                        </>
                    ) : (
                        documents.length === 0 ? (
                            <div className='text-center py-12'>
                                <FileText className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                                <p className="">No documents uploaded yet</p>
                                <p className="text-gray-600">Upload your first document to get started</p>
                            </div>
                        ) : (<div className='space-y-6'>
                            {documents.map(doc => (<DocumentCard key={doc.id} />))}
                        </div>)
                    )}
                </CardContent>
            </Card>


        </div>
    )
}
'use client'
import { analysisTypes, formatFileSize } from '@/app/data/data'
import DocumentCard from '@/components/document/Document-card'
import DocumentUploadDialog from '@/components/document/document-upload-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisType, Document } from '@/types'
import { useOrganization } from '@clerk/nextjs'
import { FileText, Loader2, Upload, UploadCloudIcon } from 'lucide-react'
import React, { use, Suspense, useState, useEffect } from 'react'
import { toast } from 'sonner'


export default function DocumentsPage() {
    const { organization } = useOrganization()
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null)
    const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>("summary")
    const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set())

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

    const handleAnalyze = async (documentId: string) => {
        if(!organization) return;
        setIsAnalyzing(documentId)
        try{
            const response= await fetch("/api/analyze", {
            method:"POST",
            headers:{contentType: "application/json"},
            body: JSON.stringify({documentId: documentId, organizationId:organization?.id, analysisType: selectedAnalysisType})
        })
        if(response.ok){
            const data = await response.json()
            const analysisTypeLabel= analysisTypes.find((t) => t.value === selectedAnalysisType)?.label;
            toast.success(`${analysisTypeLabel || "Document"} analyzed successfully. `)
            fetchingData()
            setExpandedSummaries(prev => new Set(prev).add(documentId))
        }else{
            const error= await response.json();
            toast.error(error.error || "Failed to analyze document")
        }
        }catch(err){
            console.log("analyze err: ", err)
            toast.error("something went wrong while analyzing the document")
        }finally{setIsAnalyzing(null)}
    }
    
    const handleDelete = async (documentId: string) => {
        if(!confirm("Are you sure you want to delete this document?")) return;

        try{
            const response = await fetch(`/api/documents/${documentId}`, {
            method: "DELETE"
        });
        if(response.ok){
            toast.success("Document deleted successfully")
            fetchingData()    
        }else{
            toast.error("Failed to delete document")
        }
        } catch(err){
            console.log("Delete error: ", err)
            toast.error("Failed to delete document")
        }
        

    }
    const toggleSummary = async (documentId: string) => {
        const newExpanded= new Set(expandedSummaries);
        if(newExpanded.has(documentId)){
            newExpanded.delete(documentId)
        }
        newExpanded.add(documentId)
        setExpandedSummaries(newExpanded)
    }

    return (
        <div className='space-y-8'>
            {/* // Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1>Documents</h1>
                    <p className='text-gray-600'>Upload and analyze documents in {organization?.name}</p>
                </div>
            {/* // Upload dialog */}
            <DocumentUploadDialog trigger={<Button><Upload className="h-4 w-4 mr-2"/> Upload Document</Button>} onUploadSuccess={fetchingData}/>
            </div>
            
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
                            {documents.map(doc => (<DocumentCard 
                                key={doc.id}
                                document={doc}
                                isAnalyzing={isAnalyzing===doc.id}
                                selectedAnalysisType= {selectedAnalysisType}
                                onAnalsisTypeChange={setSelectedAnalysisType}
                                onAnalyze={handleAnalyze}
                                onDelete={handleDelete}
                                onToggleSummary={toggleSummary}
                                expandedSummaries={expandedSummaries}
                                formatFileSize={formatFileSize}
                             />
                             ))}
                        </div>)
                    )}
                </CardContent>
            </Card>


        </div>
    )
}
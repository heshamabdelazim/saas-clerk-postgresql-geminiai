"use client"

import { AnalysisType, Document } from "@/types"
import { Brain, Calendar, Download, FileText, Loader2, Sparkles, User } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { analysisTypes } from "@/app/data/data"


interface DocumentCardProps {
    document: Document
    isAnalyzing:boolean
    selectedAnalysisType: AnalysisType
    onAnalsisTypeChange: (type:AnalysisType)=>void
    onAnalyze:(documentId:string)=>void
    onDelete:(documentId:string)=>void
    onToggleSummary:(documentId:string)=>void
    expandedSummaries: Set<string>
    formatFileSize:(bytes?: number)=>string
}
function DocumentCard({document:doc, isAnalyzing, selectedAnalysisType, onAnalsisTypeChange, onAnalyze, onDelete, onToggleSummary, expandedSummaries, formatFileSize}:DocumentCardProps) {
    const getAnalysisTypeIcon=(type: AnalysisType)=> {
        const analysisType=analysisTypes.find((t) => t.value === type);
        const Icon = analysisType?.icon || Sparkles;
        return <Icon className="h-4 w-4"/>;
    }
    return (
        <div className="border border-lg rounded-lg hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
                {/* left side */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600"/>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{doc?.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3"/>
                                        {doc?.user.name || doc?.user.email}
                                    </span>
                                    <span className="flex items-center gap">
                                        <Calendar className="h-3 w-3"/>
                                        {new Date(doc?.createdAt).toLocaleDateString()}
                                    </span>
                                    {doc?.fileSize && (
                                        <span className="flex items-center gap-1">
                                            <FileText className="h-3 w-3"/>
                                            {formatFileSize(doc?.fileSize)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {doc.sentiment && (
                                <Badge>
                                    <div className="flex items-center gap-1">
                                        <span className="capitalize">{doc.sentiment}</span>
                                    </div>
                                </Badge>
                            )}
                        </div>
                    {/* ai analysis */}
                    {doc.aiSummary && (
                        <div className="mt-4 p-4 bg-linear-to-r from-gray-50 to-blue">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-green-600"/>
                                    <span className="font-medium">AI Analysis</span>
                                    <Badge variant="outline" className="ml-2">Gemini AI</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <ReactMarkdown>{doc.aiSummary||"not analyzed yet"}</ReactMarkdown>
                    </div>
                </div>
                
                {/* right side */}
                <div className="flex flex-col items-end gap-2">
                    {/* download button */}
                    {doc.fileUrl && (
                        <Button variant="outline" size="sm" className="justify-start" onClick={()=>window.open(doc.fileUrl, "_blank")}>
                            <Download className="h-4 w-4 mr-2"/>
                            Download
                        </Button>
                    )}

                    {/* analyze section */}
                    <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                            {doc.aiSummary? "Re-analyze document" : "Analyze document with AI"}
                        </div>
                        <Select value={selectedAnalysisType} onValueChange={(value:AnalysisType)=> onAnalsisTypeChange(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue>
                                    <div className="flex items-center gap-2">
                                        {getAnalysisTypeIcon(selectedAnalysisType)}
                                        {analysisTypes.find((t) => t.value === selectedAnalysisType)?.label}
                                        {/* AnalysisType */}
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {analysisTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                            <type.icon className="h-4 w-4"/>
                                            {type.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant={doc.aiSummary ? "outline" : "default"} size="sm" onClick={()=> onAnalyze(doc.id)} disabled={isAnalyzing} className="justify-start w-full">
                                {isAnalyzing? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {doc.aiSummary? "Re-analyzing..." : "Analyzing..."}
                                    </>
                                ):(
                                    <>
                                        <Brain className="h-4 w-4 mr-2" />
                                        {doc.aiSummary ? "Re-analyze" : "Analyze"}
                                    </>
                                )}
                        </Button>
                    </div>
                    {/* delete button */}
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                    onClick={()=>onDelete(doc.id)}>delete</Button>
                </div>
            </div>
        </div>
    )
}

export default DocumentCard
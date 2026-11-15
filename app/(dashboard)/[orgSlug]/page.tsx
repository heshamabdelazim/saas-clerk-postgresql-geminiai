
import { formatFileSize } from '@/app/data/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { prisma } from '@/lib/prisma';
import { Button } from '@base-ui/react';
import { auth } from '@clerk/nextjs/server';
import { ArrowRight, Brain, Calendar, File, FileText, Upload, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import ReactMarkdown from "react-markdown"


interface OrgPageProps {
    params: Promise<{ orgSlug: string }>
}
async function OrgPage({ params }: OrgPageProps) {
    const { userId } = await auth()
    const { orgSlug } = await params;

    if (!userId) {
        redirect("/sign-in")
    }


    //org comparison


    // const org = await prisma.organization.findUnique({
    //     where: {
    //         slug: orgSlug
    //     },
    //     select: {
    //         id: true,
    //         name: true,
    //         _count: {
    //             select: {
    //                 members: true
    //             }
    //         }
    //     }
    // })

    const org = await prisma.organization.findUnique({
        where: {
            slug: orgSlug
        },
        include: {
            _count: {
                select: {
                    members: true,
                    documents: true
                }
            },
            documents: {
                take: 5,
                orderBy: { createdAt: "desc" },
                // how can I do the same _count in the line 50, to return number of analyzed documents
            }
        }

    })

    //2
    const membership = await prisma.organizationMember.findFirst({
        where: {
            organizationId: org?.id,
            user: { clerkUserId: userId }
        },
        include: {
            user: {
                select: { name: true }
            }
        }
    })
    if (!membership) {
        redirect("/select-org")
    }

    // 3
    const analyzedDocsNum: number = await prisma.document.count({
        where: {
            organizationId: org?.id,
            aiSummary: { not: null }
        }
    })

    return (
        <>
            <h1 className='text-3xl font-bold'>{org?.name} Dashboard</h1>
            <span>Welcome to your organization workspace</span>
            <div className='flex wrap justify-between items-center my-5'>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='text-xl font-bold'>Total Documents</CardTitle>
                        <CardDescription>In this Organization </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-2xl py-1.5'>{org?._count.documents}</span>
                        <Button className='text-gray-600 flex items-center gap-1.5'>View Documents <ArrowRight className='ml-1' size={14} /></Button>
                    </CardContent>
                </Card>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='text-xl font-bold'>Team Members</CardTitle>
                        <CardDescription>Organization Members </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-2xl py-1.5'>{org?._count?.members}</span>
                        <Button className='text-gray-600 flex items-center gap-1.5'>View Documents <ArrowRight size={14} /></Button>
                    </CardContent>
                </Card>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='text-xl font-bold'>Analyzed</CardTitle>
                        <CardDescription>Document with AI insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className='font-bold text-2xl py-1.5'>{org?._count.documents == 0 ? "No Documents" : analyzedDocsNum}</span>
                        <Button className='text-gray-600 flex items-center gap-1.5'>View Documents <ArrowRight size={14} /></Button>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>Recent Documents</CardTitle>
                    <CardDescription>Latest uploads in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                    {org?._count.documents == 0 ? (<div className='text-center  py-8'>
                        <FileText size={36} className='mx-auto text-gray-300 mb-4' />
                        <p className='text-gray-300 text-[20px] mb-3'>No Documents uploaded yet</p>
                        <Link href={`/${orgSlug}/documents`} className='mx-auto block w-fit'>
                            <Button className=" cursor-pointer flex items-center text-center bg-gray-700 text-white rounded p-3 hover:bg-gray-400"><Upload className='h-4 w-4 mr-2' />Upload First Document!</Button>
                        </Link>
                    </div>)
                        :
                        (
                            <div className='flex flex-col gap-6 '>
                                {org?.documents.map(doc => (
                                    <div key={doc.id}>
                                        <Link href={`/${orgSlug}/documents`} className='flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors'>
                                            <File />
                                            <div>
                                                <h5>{doc.name}</h5>
                                                <div className='text-gray-600 flex gap-3'>
                                                    <span className='flex gap-0.5 items-center'><User size={14} /> {membership.user.name}</span>
                                                    <span className='flex gap-0.5 items-center'><Calendar size={14} /> {doc.createdAt.toLocaleDateString()} </span>
                                                    {doc.fileSize && (<span className="flex gap-0.5 items-center"><File size="14" />{formatFileSize(doc.fileSize)}</span>)}
                                                </div>
                                            </div>
                                        </Link>
                                        {doc.aiSummary && <Card className='ml-10'>
                                            <CardHeader className='flex items-center gap-3.5'>
                                                <span className='flex items-center gap-1'><Brain size={14} className="text-green-300" /> AI Analysis</span>
                                                <span>Gemini AI</span>
                                            </CardHeader>
                                            <CardContent >
                                                <ReactMarkdown>{doc.aiSummary}</ReactMarkdown>
                                            </CardContent>
                                        </Card>}
                                    </div>
                                ))}
                            </div>
                        )}
                </CardContent>
            </Card>

        </>
    )
}

export default OrgPage


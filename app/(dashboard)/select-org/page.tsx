"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOrganizationList, useUser } from '@clerk/nextjs';
import { ArrowRight, Building, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

function SelectOrg() {
    const { user } = useUser();
    const { isLoaded, userMemberships, setActive, createOrganization } = useOrganizationList({
        userMemberships: {
            infinite: true,
        }
    });
    const router = useRouter();
    const [orgName, setOrgName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshOrganization = async () => {
        setIsRefreshing(true);
        try {
            if (userMemberships.revalidate) {
                await userMemberships.revalidate();
            }
            toast.success("Organization list refreshed")
        } catch (err) {
            console.error("failed to refresh organization", err)
        } finally {
            setIsRefreshing(false);
        }
    }

    const handleCreateOrg = async () => {
        if (!orgName.trim()) {
            toast.error("Please enter an organization name");
            return;
        }
        setIsCreating(true);
        try {
            if (!createOrganization) {
                throw new Error("Organization creation is not avilable at this time")
            }
            const newOrg = await createOrganization({ name: orgName.trim() });
            if (!newOrg) { toast.error("Failed to create organization") };
            toast.success(`Organization ${newOrg} created successfully`)
            setOrgName("")

            // Save to your DB
            try {
                const response = await fetch("/api/organizations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clerkOrgId: newOrg.id,
                        name: newOrg.name,
                        slug: newOrg.slug || orgName.trim().toLowerCase().replace(/\s+/g, "-"),
                    })
                })
                if (!response) {
                    console.log("Database sync had issues but organization had been created in clerk")
                }
            } catch (dbErr: any) {
                console.warn("database sync failed", dbErr)
            }

            // set as active organization
            if (setActive) {
                await setActive({ organization: newOrg.id })
            }
            //now, giving Clerk's backend a brief window to propagate the state change before you try to refresh data.
            //Then, refresh the organization list
            await new Promise((resolve) => setTimeout(resolve, 500));
            refreshOrganization()
            router.refresh();

        } catch (err) {
            console.error("failed to create org ", err)
            toast.error("failed to create org")
        } finally {
            setIsCreating(false)
        }
    };

    const handleSelectOrg = async (org: any) => {
        try {
            if (setActive) { //checking clerk service availability
                await setActive({ organization: org.id })
                router.push(`/${org.slug}`)
            }
        } catch (err) {
            console.error("Failed to switch orgnization: ", err)
            toast.error("Failed to switch orgnization")
        }
    };

    return (
        <div className='container max-auto mx-w-4xl p-6'>
            <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold'>Welcome, {user?.firstName}</h1>
                <p className='text-gray-600'>Select or create an organization</p>
            </div>

            {/* Create Organization */}
            <Card className='mb-8'>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                            <Plus className='h-5 w-5' />
                            Create Organization
                        </CardTitle>
                        <CardDescription>
                            Start a new workspace for your team
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div className='flex gap-2'>
                            <Input placeholder='Enter organization name' value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={isCreating} className="flex-1" onKeyDown={e => e.key === "Enter" && handleCreateOrg} />
                            <Button className="min-w-25" onClick={handleCreateOrg} disabled={isCreating || !orgName.trim()}>{isCreating ? (<><Loader2 className='h-4 w-4 mr-2 animate-spin' />Creating...</>) : ("Create")}</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Your organization list */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className='h-5 w-5' />
                        Your Organizations ({userMemberships.count || 0})
                    </CardTitle>
                    <CardDescription>{userMemberships.count === 0 ? "Create your first organization above" : "Click on an organization to enter"}</CardDescription>
                </CardHeader>
                <CardContent>{userMemberships.count === 0 ?
                    <>
                        <div className='text-center py-12'>
                            <Building className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                            <p className="text-gray-600 mb-2"> No Organizations yet </p>
                            <p className='text-sm text-gray-500'>Create your first organization go get started</p>
                        </div>
                    </>
                    :
                    <>
                        <div className='space-y-3'>
                            {userMemberships.data?.map(membership => (
                                <div key={membership.organization.id} className='border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors' onClick={() => handleSelectOrg(membership.organization)}>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                <Building className='h-6 w-6 text-blue-600' />
                                            </div>

                                            <div>
                                                <h3 className='font-semibold text-lg'>{membership.organization.name}</h3>
                                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                    <span className='bg-gray-100 px-2 py-1 rounded text-xs capitalize'>{membership.role}</span>
                                                    <span>ID: {membership.organization.id.substring(0, 8)}...</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className='h-5 w-5 text-gray-400' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>}
                </CardContent>
            </Card>
        </div>
    )
}

export default SelectOrg;
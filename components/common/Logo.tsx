import { Brain } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Logo() {
    return (
        <Link href="/" className='flex items-center gap-2 font-bold text-xl'>
            <Brain className='h-6 w-6 text-blue-600' /> Doc AI
        </Link>
    )
}

export default Logo
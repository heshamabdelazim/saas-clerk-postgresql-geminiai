"use client"
import { useEffect } from 'react'

function page() {
    useEffect(() => {
        fetch("http://localhost:3000/api/organizations").then(data => data.json()).then(data => console.log("server data", data))
    }, [])
    return (
        <div>page</div>
    )
}

export default page
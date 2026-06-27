"use client"
import { Brain, Home, LogIn, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button';
import { Show, SignIn, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import Logo from './Logo';

function Header() {
  const pathName = usePathname();
  console.log(pathName, " pathname")
  const items = [
    { href: "/", label: "Home", icon: <Home className='w-4 h-4' /> },
    { href: "/switch-org", label: "Switch Organization", icon: <Users className='w-4 h-4' /> }
  ]

  const NavLinks = () => {
    return items.map((item) => {
      const isActive = pathName === item.href || (item.href !== "/" && pathName?.startsWith(item.href))
      return (
        <Link key={item.href} href={item.href}>
          <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">{item.icon} {item.label}</Button>
        </Link>
      )
    })
  }

  return (
    <header className='sticky top-0 z-50 border-b bg-white/95 backdrop-blur text-slate-900 supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto px-4 h-16 bg-white/95 flex items-center justify-between'>
        {/* logo */}
        <Logo />
        {/* Navigation */}
        <nav className='md:flex items-center gap-1'>
          {NavLinks()}
        </nav>
        {/* Auth buttons */}
        <div className='flex items-center gap-4'>
          <Show when="signed-out">
            <div className='md:flex items-center gap-2'>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  <LogIn className='h-4 w-4 mr-2' /> Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">
                  <UserPlus className='h-4 w-4 mr-1' /> Sign Up
                </Button>
              </Link>
            </div>
          </Show>
          <Show when="signed-in">
            <div className='md:flex items-center gap-2'>
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </header>
  )
}

export default Header
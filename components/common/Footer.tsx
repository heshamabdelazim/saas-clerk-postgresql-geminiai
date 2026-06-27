import React from 'react'
import { GitBranch, Mail, X, } from "lucide-react";
import Link from 'next/link';
import Logo from './Logo';

function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    Products: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/api-docs" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    Resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "Legal", href: "/legal" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    Legal: [
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ]
  }

  const socialLinks = [
    { icon: <X />, label: "Twitter", href: "https://www.twitter.com" },
    { icon: <GitBranch />, label: "GitHub", href: "https://www.github.com" },
    { icon: <Mail />, label: "G-mail", href: "https://www.gmail.com" },
  ]
  return (
    <footer className='border-t bg-gray-50 '>
      <div className='container flex flex-wrap gap-7 mx-auto px-4 py-12 justify-between'>
        <div className='flex md:flex-col gap-3 text-sm w-70 text-gray-600'>
          <Logo />
          Doc AI is a revolutionary tool that will change the way you interact with documents and AI technology for good.
        </div>
        <div className='flex md:flex-col gap-3 text-sm text-gray-600'>
          <strong className='text-lg'>Company</strong>
          {footerLinks.Company.map((ele) => (
            <Link key={ele.label} href={ele.href}>{ele.label}</Link>
          ))}
        </div>
        <div className='flex md:flex-col gap-3 text-sm text-gray-600'>
          <strong className='text-lg'>Legal</strong>
          {footerLinks.Legal.map((ele) => (
            <Link key={ele.label} href={ele.href}>{ele.label}</Link>
          ))}
        </div>
        <div className='flex md:flex-col gap-3 text-sm text-gray-600'>
          <strong className='text-lg'>Products</strong>
          {footerLinks.Products.map((ele) => (
            <Link key={ele.label} href={ele.href}>{ele.label}</Link>
          ))}
        </div>
      </div>
      <div className='py-1 text-center'>
        &copy; {currentYear} Doc AI. All rights reserved. @Hesham Abdelazim
      </div>
    </footer>
  )
}

export default Footer
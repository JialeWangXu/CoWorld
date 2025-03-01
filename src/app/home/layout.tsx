import React from 'react'
import { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarCandidate } from 'app/components/NavbarCandidate';


export const meta: Metadata = {
  title: 'This is home page for candidates',
  description: 'This project is a Next.js app with TypeScript, ESLint, Prettier, and Bootstrap.' 
}

interface HomeLayoutProps {
  children: React.ReactNode 
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div>
            <NavbarCandidate/>
            {children}
        </div>
    )
  }
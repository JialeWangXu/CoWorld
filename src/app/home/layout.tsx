import React from 'react'
import { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarCandidate } from 'app/components/NavbarCandidate';
import { UserProvider } from 'app/context/UserContext';
import AccessChecker from 'app/components/AccessChecker';


export const meta: Metadata = {
  title: 'This is home page for candidates',
  description: 'This project is a Next.js app with TypeScript, ESLint, Prettier, and Bootstrap.' 
}

interface HomeLayoutProps {
  children: React.ReactNode 
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
      <AccessChecker>
        <UserProvider>
              <NavbarCandidate/>
              {children}
        </UserProvider>
      </AccessChecker>
    )
  }
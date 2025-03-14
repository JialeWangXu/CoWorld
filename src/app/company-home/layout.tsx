import React from 'react'
import { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarCompany } from 'app/components/NavbarCompany';
import { CompanyProvider } from 'app/context/CompanyContext';
import AccessChecker from 'app/components/AccessChecker';


export const meta: Metadata = {
  title: 'This is home page for company',
  description: 'This project is a Next.js app with TypeScript, ESLint, Prettier, and Bootstrap.' 
}

interface HomeLayoutProps {
  children: React.ReactNode 
}

export default function CompanyHomeLayout({ children }: HomeLayoutProps) {
    return (
      <AccessChecker>
        <CompanyProvider>
              <NavbarCompany/>
              {children}
        </CompanyProvider>
      </AccessChecker>
    )
  }
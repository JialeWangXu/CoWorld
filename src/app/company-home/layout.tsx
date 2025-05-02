import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarCompany } from 'app/components/NavbarCompany';
import { CompanyProvider } from '../../context/CompanyContext';
import AccessChecker from 'app/components/AccessChecker';


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
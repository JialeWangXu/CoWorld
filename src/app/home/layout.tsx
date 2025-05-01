import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarCandidate } from 'app/components/NavbarCandidate';
import { UserProvider } from 'app/context/UserContext';
import AccessChecker from 'app/components/AccessChecker';

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
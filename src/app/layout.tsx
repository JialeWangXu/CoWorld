import React from 'react'
import { Metadata } from 'next'
import {Inter} from 'next/font/google'
import { ToastProvider } from './context/ToastContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from './components/Bootstrap/BootstrapClient';
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const inter = Inter({subsets: ['latin']})

export const meta: Metadata = {
  title: 'Hi! This is CoWorld!',
  description: 'This project is a Next.js app with TypeScript, ESLint, Prettier, and Bootstrap.' 
}

interface RootLayoutProps {
  children: React.ReactNode 
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
      <html lang="en">
        <body className={inter.className}>
        <SkeletonTheme baseColor="#f2f4f4" highlightColor="#444">
          <BootstrapClient/>
          <ToastProvider>
            <main className='container-fluid p-0'>{children}</main>
          </ToastProvider>
          </SkeletonTheme>
        </body>
      </html>
    )
  }
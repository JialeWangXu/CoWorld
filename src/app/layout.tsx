import React from 'react'
import {Inter} from 'next/font/google'
import { ToastProvider } from './context/ToastContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from './components/Bootstrap/BootstrapClient';
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const inter = Inter({subsets: ['latin']}) // Importing the Inter font from Google Fonts, preloading it for better performance

interface RootLayoutProps {
  children: React.ReactNode 
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
      <html lang="en">
        <head>
          <title>CoWorld</title>
          <meta charSet="UTF-8"></meta>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <meta name="description" content="Una aplicación de busqueda de empleo orientado a las personas con discapacidad." />
          <meta name="keywords" content="CoWorld, empleo, discapacidad, busqueda de empleo, personas con discapacidad" />
          <meta name="author" content="Jiale Wang" />
        </head>
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
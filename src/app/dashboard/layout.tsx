"use client"

import { useUser } from '@clerk/clerk-react'
import { SideNav } from "./side-nav"
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Header } from '../(landing)/_component/header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isSignedIn } = useUser()
  const [showPage, setshowPage] = useState(false)

  useEffect(() => {
    if (process.env.SERVER_STATE === "True" || !isSignedIn) {
      const timer = setTimeout(() => {
        setshowPage(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setshowPage(false)
    }
  }, [isSignedIn])

  return (
      <>
        {showPage ? (
          redirect("/auth/sign-in")
        ) : (
          <div>
            <Header/>
            <main className="container mx-auto pt-12">
              <div className="flex gap-8">
                <SideNav />
                <div className="w-full">
                  {children}
                </div>
              </div>
            </main>
          </div>
        )}
      </>
  );
}
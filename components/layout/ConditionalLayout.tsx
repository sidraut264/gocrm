"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages where we don't want sidebar/navbar
  const authPages = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top navigation */}
        <Navbar />
        
        {/* Main content with dark theme */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
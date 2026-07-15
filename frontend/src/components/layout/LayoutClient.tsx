'use client';

import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import InquiryModal from "@/components/common/InquiryModal";
import { usePathname } from "next/navigation";

// Intercept window.fetch to route all backend calls through our Next.js rewrite proxy
if (typeof window !== 'undefined' && !(window as any).__fetchWrapped) {
  (window as any).__fetchWrapped = true;
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === 'string'
      ? input
      : (input instanceof URL ? input.toString() : (input as Request).url);

    const localBackendUrl = 'https://aaj-tech-backend.onrender.com/api';
    const prodBackendUrl = 'https://aaj-tech-backend.onrender.com/api';

    if (url && (url.startsWith(localBackendUrl) || url.startsWith(prodBackendUrl))) {
      // Rewrite the URL to use our relative Next.js proxy route /backend-api
      const path = url.startsWith(localBackendUrl)
        ? url.slice(localBackendUrl.length)
        : url.slice(prodBackendUrl.length);

      url = `/backend-api${path}`;

      // Reconstruct the input argument with the rewritten URL
      if (typeof input === 'string') {
        input = url;
      } else if (input instanceof URL) {
        input = new URL(url, window.location.origin);
      } else {
        input = new Request(url, input);
      }

      init = init || {};
      init.credentials = 'include';
    } else if (url && url.startsWith('/api/')) {
      init = init || {};
      init.credentials = 'include';
    }
    return originalFetch(input, init);
  };
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname === '/login';
  const isAuthPage = isAdmin || isLogin;

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAuthPage && <InquiryModal />}
    </>
  );
}

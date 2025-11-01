'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const cmsKey = params.key as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (cmsKey === process.env.NEXT_PUBLIC_CMS_API_KEY) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [cmsKey]);

  if (!isAuthenticated) {
    return (
      <div className="p-5 text-center">
        <h1 className="text-3xl font-bold mb-4">CMS Access Denied</h1>
        <p className="mb-4">Invalid CMS Key provided in the URL.</p>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-gray-100 p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">CMS Dashboard</h1>
        <nav className="mt-2">
          <ul className="flex space-x-4">
            <li><a href={`/${cmsKey}/cms/products`} className="text-blue-600 hover:underline">Products</a></li>
            <li><a href={`/${cmsKey}/cms/albums`} className="text-blue-600 hover:underline">Albums</a></li>
            <li><a href={`/${cmsKey}/cms/customers`} className="text-blue-600 hover:underline">Customers</a></li>
            <li><a href={`/${cmsKey}/cms/homepage-sections`} className="text-blue-600 hover:underline">Homepage Sections</a></li>
          </ul>
        </nav>
      </header>
      <main className="p-5">{children}</main>
    </div>
  );
}

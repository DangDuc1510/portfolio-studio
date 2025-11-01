'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CmsDashboard() {
  const params = useParams();
  const cmsKey = params.key as string;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Welcome to CMS Dashboard</h1>
      <p className="mb-6">Select an option from the navigation to manage content:</p>
      <ul className="space-y-2">
        <li><Link href={`/${cmsKey}/cms/products`} className="text-blue-600 hover:underline">Manage Products</Link></li>
        <li><Link href={`/${cmsKey}/cms/albums`} className="text-blue-600 hover:underline">Manage Albums</Link></li>
        <li><Link href={`/${cmsKey}/cms/customers`} className="text-blue-600 hover:underline">View Customers</Link></li>
        <li><Link href={`/${cmsKey}/cms/homepage-sections`} className="text-blue-600 hover:underline">Manage Homepage Sections</Link></li>
      </ul>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCustomers, deleteCustomerById } from '@/lib/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  submissionDate: string;
}

const CustomerManagement = () => {
  const params = useParams();
  const cmsKey = params.key as string; // `cmsKey` vẫn được giữ lại để tương thích với `useParams()` nhưng không được sử dụng trong API calls
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []); // Loại bỏ `cmsKey` khỏi dependency array

  const fetchCustomers = async () => {
    const data = await getCustomers(); // Không truyền `cmsKey`
    setCustomers(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomerById(id); // Sử dụng `deleteCustomerById` và không truyền `cmsKey`
      fetchCustomers();
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Customer Inquiries</h1>
      <ul className="space-y-4">
        {customers.map((customer) => (
          <li key={customer.id} className="p-4 border border-gray-200 rounded">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Message:</strong> {customer.message}</p>
            <p><strong>Date:</strong> {new Date(customer.submissionDate).toLocaleString()}</p>
            <button onClick={() => handleDelete(customer.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerManagement;

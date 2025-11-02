'use client';

import { useState, useCallback } from 'react';
import { Button } from "antd";
import { createCustomer } from '../lib/api';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(formData);
      alert('Inquiry submitted successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Failed to submit inquiry', error);
      alert('Failed to submit inquiry.');
    }
  }, [formData]);

  return (
    <section className="py-16 bg-white">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <input name="name" placeholder="Name" required className="w-full p-2 border border-gray-300 rounded" value={formData.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border border-gray-300 rounded" value={formData.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="w-full p-2 border border-gray-300 rounded" value={formData.phone} onChange={handleChange} />
        <textarea name="message" placeholder="Message" className="w-full p-2 border border-gray-300 rounded" value={formData.message} onChange={handleChange}></textarea>
        <Button type="primary" htmlType="submit">Submit Inquiry</Button>
      </form>
    </section>
  );
};

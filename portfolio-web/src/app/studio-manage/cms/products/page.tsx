'use client';
import { useState, useEffect } from 'react';
import { getProducts, getProductById, createProduct, updateProductById, deleteProductById } from '@/lib/api';

interface Product {
  id: string; // Changed from _id to id based on user's change for updateProduct
  name: string;
  description: string;
  images: string[];
  category: string;
  albumId: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ name: '', description: '', images: [], category: '', albumId: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts(); // Public API, no key needed
    setProducts(data);
  };

  const handleEdit = async (id: string) => {
    const product = await getProductById(id); // Public API, no key needed
    setEditingProduct(product);
    setForm({ name: product.name, description: product.description, images: product.images, category: product.category, albumId: product.albumId });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProductById(id);
      fetchProducts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProductById(editingProduct.id, form);
    } else {
      await createProduct(form);
    }
    setEditingProduct(null);
    setForm({ name: '', description: '', images: [], category: '', albumId: '' });
    fetchProducts();
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Product Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Images (comma separated URLs)"
          value={form.images.join(',')}
          onChange={(e) => setForm({ ...form, images: e.target.value.split(',') })}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Album ID"
          value={form.albumId}
          onChange={(e) => setForm({ ...form, albumId: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {editingProduct ? 'Update' : 'Create'} Product
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <span>{product.name} - {product.category}</span>
            <div>
              <button onClick={() => handleEdit(product.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;

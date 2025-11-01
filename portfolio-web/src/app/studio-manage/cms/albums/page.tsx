'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from '@/lib/api';

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  productIds: string[];
}

const AlbumManagement = () => {
  const params = useParams();
  const cmsKey = params.key as string;
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [form, setForm] = useState<Omit<Album, 'id'>>({ name: '', description: '', coverImage: '', productIds: [] });

  useEffect(() => {
    fetchAlbums();
  }, [cmsKey]);

  const fetchAlbums = async () => {
    const data = await getAlbums(); // Public API, no key needed
    setAlbums(data);
  };

  const handleEdit = async (id: string) => {
    const album = await getAlbumById(id); // Public API, no key needed
    setEditingAlbum(album);
    setForm({ name: album.name, description: album.description, coverImage: album.coverImage, productIds: album.productIds });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this album?')) {
      await deleteAlbum(id);
      fetchAlbums();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlbum) {
      await updateAlbum(editingAlbum.id, form);
    } else {
      await createAlbum(form);
    }
    setEditingAlbum(null);
    setForm({ name: '', description: '', coverImage: '', productIds: [] });
    fetchAlbums();
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Album Management</h1>
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
          placeholder="Cover Image URL"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Product IDs (comma separated)"
          value={form.productIds.join(',')}
          onChange={(e) => setForm({ ...form, productIds: e.target.value.split(',') })}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {editingAlbum ? 'Update' : 'Create'} Album
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Albums</h2>
      <ul className="space-y-2">
        {albums.map((album) => (
          <li key={album.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <span>{album.name}</span>
            <div>
              <button onClick={() => handleEdit(album.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(album.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumManagement;

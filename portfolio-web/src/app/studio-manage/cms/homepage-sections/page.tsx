'use client';
import { useState, useEffect } from 'react';
import { getHomepageSections, updateHomepageSection } from '@/lib/api';

interface HomepageSection {
  id: string;
  sectionName: string;
  isVisible: boolean;
  content: any;
}

const HomepageSectionManagement = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [form, setForm] = useState<Omit<HomepageSection, 'id' | 'sectionName'>>({ isVisible: true, content: {} });

  useEffect(() => {
    fetchSections();
  }, []); // Loại bỏ `cmsKey` khỏi dependency array

  const fetchSections = async () => {
    const data = await getHomepageSections(); // Public API, no key needed
    setSections(data);
  };

  const handleEdit = async (sectionName: string) => {
    const section = sections.find(s => s.sectionName === sectionName);
    if (section) {
      setEditingSection(section);
      setForm({ isVisible: section.isVisible, content: section.content });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      await updateHomepageSection(editingSection.id, { sectionName: editingSection.sectionName, ...form });
    }
    setEditingSection(null);
    setForm({ isVisible: true, content: {} });
    fetchSections();
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Homepage Section Management</h1>

      <h2 className="text-2xl font-bold mb-4">Edit Section</h2>
      {editingSection && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-gray-200 rounded">
          <h3 className="text-xl font-semibold">Editing: {editingSection.sectionName}</h3>
          <label className="flex items-center space-x-2">
            <span className="font-medium">Visible:</span>
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>
          <label className="block">
            <span className="font-medium">Content (JSON):</span>
            <textarea
              value={JSON.stringify(form.content, null, 2)}
              onChange={(e) => {
                try {
                  setForm({ ...form, content: JSON.parse(e.target.value) });
                } catch (error) {
                  console.error('Invalid JSON', error);
                }
              }}
              rows={10}
              cols={50}
              className="w-full p-2 border border-gray-300 rounded mt-1 font-mono text-sm"
            />
          </label>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Section</button>
            <button type="button" onClick={() => setEditingSection(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          </div>
        </form>
      )}

      <h2 className="text-2xl font-bold mb-4">Existing Sections</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <span>{section.sectionName} - {section.isVisible ? 'Visible' : 'Hidden'}</span>
            <button onClick={() => handleEdit(section.sectionName)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomepageSectionManagement;

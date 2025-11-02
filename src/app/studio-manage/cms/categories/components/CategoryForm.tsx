"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  Category,
} from "../hooks/useCategories";

interface CategoryFormProps {
  categoryId?: string;
  onSuccess?: () => void;
}

export default function CategoryForm({
  categoryId,
  onSuccess,
}: CategoryFormProps) {
  const router = useRouter();
  const { data: category, isLoading: isLoadingCategory } = useCategory(
    categoryId
  );
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isLoading = isLoadingCategory;
  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const [form, setForm] = useState<Omit<Category, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoryId) {
        await updateCategory.mutateAsync({ id: categoryId, data: form });
      } else {
        await createCategory.mutateAsync(form);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio-manage/cms/categories");
      }
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Category Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Enter category name"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all resize-none"
          placeholder="Enter category description"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          {isSubmitting
            ? "Saving..."
            : categoryId
            ? "Update Category"
            : "Create Category"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-transparent hover:bg-[#2C2C2C] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


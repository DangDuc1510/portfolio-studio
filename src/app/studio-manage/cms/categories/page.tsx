"use client";
import Link from "next/link";
import {
  useCategories,
  useDeleteCategory,
  Category,
} from "./hooks/useCategories";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CategoriesListPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id: string, name: string) => {
    // Prevent deletion of "Video" category
    if (name.toLowerCase() === "video") {
      alert("Cannot delete the 'Video' category");
      return;
    }
    
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error: unknown) {
        console.error("Failed to delete category:", error);
        let errorMessage = "Failed to delete category";
        if (error && typeof error === 'object') {
          const err = error as { response?: { data?: { message?: string } }; message?: string };
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
        alert(errorMessage);
      }
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
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Categories</h1>
          <p className="text-gray-400">
            Manage product categories ({categories.length} items)
          </p>
        </div>
        <Link
          href="/studio-manage/cms/categories/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
        >
          <PlusOutlined />
          <span>Create Category</span>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg mb-6">No categories found</p>
          <Link
            href="/studio-manage/cms/categories/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
          >
            <PlusOutlined />
            <span>Create Your First Category</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: Category) => (
            <div
              key={category._id}
              className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/studio-manage/cms/categories/edit/${category._id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-lg transition-all border border-white/10"
                >
                  <EditOutlined />
                  <span>Edit</span>
                </Link>
                {category.name.toLowerCase() !== "video" && (
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    disabled={deleteCategory.isPending}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select } from "antd";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  Product,
} from "../hooks/useProducts";
import { useAlbums, Album } from "../../albums/hooks/useAlbums";
import { useCategories, Category } from "../../categories/hooks/useCategories";
import ImageUpload from "@/components/ImageUpload";

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export default function ProductForm({
  productId,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { data: albums = [], isLoading: isLoadingAlbums } = useAlbums();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isLoading = isLoadingProduct || isLoadingAlbums || isLoadingCategories;
  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const categoryOptions = categories.map((cat: Category) => ({
    label: cat.name,
    value: cat.name,
  }));

  const [form, setForm] = useState<Omit<Product, "_id">>({
    name: "",
    description: "",
    images: [],
    category: "",
    albumId: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        images: product.images || [],
        category: product.category || "",
        albumId: product.albumId || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productId) {
        await updateProduct.mutateAsync({ id: productId, data: form });
      } else {
        await createProduct.mutateAsync(form);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio-manage/cms/products");
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product");
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
          Product Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Enter product name"
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
          placeholder="Enter product description"
        />
      </div>

      <div>
        <ImageUpload
          label="Product Images"
          multiple
          multipleUrls={form.images}
          onMultipleChange={(urls) => setForm({ ...form, images: urls })}
        />
        <p className="text-gray-400 text-xs mt-2">
          Upload multiple images for your product. You can also manually add
          URLs below.
        </p>
        <textarea
          value={form.images.join("\n")}
          onChange={(e) =>
            setForm({
              ...form,
              images: e.target.value.split("\n").filter((url) => url.trim()),
            })
          }
          rows={2}
          className="w-full px-4 py-3 mt-2 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all resize-none font-mono text-sm"
          placeholder="Or paste image URLs here (one per line)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Category
          </label>
          <Select
            value={form.category || undefined}
            onChange={(value) => setForm({ ...form, category: value || "" })}
            placeholder="Select a category"
            allowClear
            showSearch
            style={{ width: "100%" }}
            className="category-select"
            options={categoryOptions}
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Album
          </label>
          <Select
            value={form.albumId || undefined}
            onChange={(value) => setForm({ ...form, albumId: value || "" })}
            placeholder="Select an album"
            allowClear
            showSearch
            style={{ width: "100%" }}
            className="album-select"
            disabled={isLoadingAlbums}
            options={albums.map((album: Album) => ({
              label: album.name,
              value: album._id,
            }))}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          {isSubmitting
            ? "Saving..."
            : productId
            ? "Update Product"
            : "Create Product"}
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

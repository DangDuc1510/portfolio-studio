"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAlbum,
  useCreateAlbum,
  useUpdateAlbum,
  Album,
} from "../hooks/useAlbums";

interface AlbumFormProps {
  albumId?: string;
  onSuccess?: () => void;
}

export default function AlbumForm({
  albumId,
  onSuccess,
}: AlbumFormProps) {
  const router = useRouter();
  const { data: album, isLoading: isLoadingAlbum } = useAlbum(albumId);
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();

  const isLoading = isLoadingAlbum;
  const isSubmitting = createAlbum.isPending || updateAlbum.isPending;

  const [form, setForm] = useState<Omit<Album, "id">>({
    name: "",
    description: "",
    coverImage: "",
    productIds: [],
  });

  useEffect(() => {
    if (album) {
      setForm({
        name: album.name,
        description: album.description || "",
        coverImage: album.coverImage || "",
        productIds: album.productIds || [],
      });
    }
  }, [album]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (albumId) {
        await updateAlbum.mutateAsync({ id: albumId, data: form });
      } else {
        await createAlbum.mutateAsync(form);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio-manage/cms/albums");
      }
    } catch (error) {
      console.error("Failed to save album:", error);
      alert("Failed to save album");
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
          Album Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Enter album name"
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
          placeholder="Enter album description"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="https://example.com/cover-image.jpg"
        />
        {form.coverImage && (
          <div className="mt-4 rounded-xl overflow-hidden bg-[#2C2C2C] aspect-video max-w-md">
            <img
              src={form.coverImage}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Product IDs (one per line)
        </label>
        <textarea
          value={form.productIds.join("\n")}
          onChange={(e) =>
            setForm({
              ...form,
              productIds: e.target.value
                .split("\n")
                .map((id) => id.trim())
                .filter((id) => id),
            })
          }
          rows={4}
          className="w-full px-4 py-3 bg-[#2C2C2C]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all resize-none font-mono text-sm"
          placeholder="product-id-1&#10;product-id-2&#10;product-id-3"
        />
        <p className="text-gray-400 text-xs mt-2">
          Enter one product ID per line
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/10 font-medium"
        >
          {isSubmitting
            ? "Saving..."
            : albumId
            ? "Update Album"
            : "Create Album"}
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


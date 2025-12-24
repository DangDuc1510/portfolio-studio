"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAlbum,
  useCreateAlbum,
  useUpdateAlbum,
  Album,
} from "@/hooks/useAlbums";
import ImageUpload from "@/components/ImageUpload";
import LoadingScreen from "@/components/LoadingScreen";

interface AlbumFormProps {
  albumId?: string;
  onSuccess?: () => void;
}

export default function AlbumForm({ albumId, onSuccess }: AlbumFormProps) {
  const router = useRouter();
  const { data: album, isLoading: isLoadingAlbum } = useAlbum(albumId);
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();

  const isLoading = isLoadingAlbum;
  const isSubmitting = createAlbum.isPending || updateAlbum.isPending;

  const [form, setForm] = useState<Omit<Album, "_id" | "productIds">>({
    name: "",
    description: "",
    coverImage: "",
  });

  useEffect(() => {
    if (album) {
      setForm({
        name: album.name,
        description: album.description || "",
        coverImage: album.coverImage || "",
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
        router.push("/studio/cms/albums");
      }
    } catch (error) {
      console.error("Failed to save album:", error);
      alert("Không thể lưu dự án");
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải thông tin dự án..." fullScreen={false} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên dự án <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Nhập tên dự án"
        />
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Mô tả
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all resize-none"
          placeholder="Nhập mô tả dự án"
        />
      </div>

      <div>
        <ImageUpload
          label="Hình ảnh bìa"
          value={form.coverImage}
          onChange={(url) => setForm({ ...form, coverImage: url || "" })}
        />
        <input
          type="url"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className="w-full px-4 py-3 mt-2 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Hoặc dán URL hình ảnh ở đây"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-secondary-cyan hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          {isSubmitting
            ? "Đang lưu..."
            : albumId
            ? "Cập nhật dự án"
            : "Tạo dự án"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-transparent hover:bg-moonlight-light disabled:opacity-50 disabled:cursor-not-allowed text-ice-white rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}


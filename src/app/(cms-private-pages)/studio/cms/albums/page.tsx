"use client";
import Link from "next/link";
import { useAlbums, useDeleteAlbum, Album } from "@/hooks/useAlbums";
import { PlusOutlined } from "@ant-design/icons";
import AlbumCard from "./components/AlbumCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function AlbumsListPage() {
  const { data: albums = [], isLoading } = useAlbums();
  const deleteAlbum = useDeleteAlbum();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
      try {
        await deleteAlbum.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete album:", error);
        alert("Không thể xóa album");
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải danh sách dự án..." fullScreen={false} />;
  }

  return (
    <div className="text-ice-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-pure-white">Dự án</h1>
          <p className="text-muted-blue">
            Quản lý dự án của bạn ({albums.length} mục)
          </p>
        </div>
        <Link
          href="/studio/cms/albums/create"
          className="flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          <PlusOutlined />
          <span>Tạo dự án</span>
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-spirit-cyan/20 text-center">
          <p className="text-muted-blue text-lg mb-6">Không tìm thấy dự án</p>
          <Link
            href="/studio/cms/albums/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
          >
            <PlusOutlined />
            <span>Tạo dự án đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album: Album) => (
            <AlbumCard
              key={album._id}
              album={album}
              coverImageUrl={album.coverImage || ""}
              onDelete={handleDelete}
              isDeleting={deleteAlbum.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

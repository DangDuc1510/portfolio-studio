"use client";
import { useParams } from "next/navigation";
import AlbumForm from "../../components/AlbumForm";

export default function EditAlbumPage() {
  const params = useParams();
  const albumId = params.id as string;

  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Chỉnh sửa dự án
        </h1>
        <p className="text-muted-blue">Cập nhật thông tin dự án</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <AlbumForm albumId={albumId} />
      </div>
    </div>
  );
}


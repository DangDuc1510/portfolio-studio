"use client";
import AlbumForm from "../components/AlbumForm";

export default function CreateAlbumPage() {
  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">Tạo dự án</h1>
        <p className="text-muted-blue">Thêm dự án mới vào bộ sưu tập</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <AlbumForm />
      </div>
    </div>
  );
}


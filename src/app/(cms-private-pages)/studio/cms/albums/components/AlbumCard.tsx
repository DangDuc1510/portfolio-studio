"use client";
import Link from "next/link";
import Image from "next/image";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Album } from "@/hooks/useAlbums";

// Helper component to handle both Next.js Image and regular img
const AlbumImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  // Check if it's an external URL
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={225}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

interface AlbumCardProps {
  album: Album;
  coverImageUrl: string;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export default function AlbumCard({
  album,
  coverImageUrl,
  onDelete,
  isDeleting,
}: AlbumCardProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden hover-lift hover-glow-cyan border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group">
      {coverImageUrl && (
        <div className="bg-gradient-to-br from-spirit-cyan/30 via-mystic/25 to-soft-gold/20 h-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/15 via-mystic/15 to-soft-gold/10 group-hover:from-spirit-cyan/25 group-hover:via-mystic/25 group-hover:to-soft-gold/15 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,209,255,0.1)_0%,_transparent_70%)]"></div>
          <AlbumImage
            src={coverImageUrl}
            alt={album.name}
            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-pure-white text-xl font-bold mb-2 line-clamp-1">
          {album.name}
        </h3>
        <p className="text-muted-blue mb-4 text-sm line-clamp-2">
          {album.description || "Không có mô tả"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-spirit-cyan text-midnight px-3 py-1 rounded-full text-xs font-semibold">
            {album.productIds?.length || 0} sản phẩm
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/studio/cms/albums/edit/${album._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-cyan hover:opacity-90 text-midnight rounded-lg transition-all border border-spirit-cyan/20 font-medium"
          >
            <EditOutlined />
            <span>Chỉnh sửa</span>
          </Link>
          <button
            onClick={() => onDelete(album._id, album.name)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-error/20 text-error hover:text-error-light rounded-lg transition-all border border-error/30 hover:border-error/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}


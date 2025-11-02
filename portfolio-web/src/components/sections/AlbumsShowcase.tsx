"use client";

import Link from "next/link";
import { Album } from "@/app/studio-manage/cms/albums/hooks/useAlbums";
import { FolderOutlined } from "@ant-design/icons";

interface AlbumsShowcaseProps {
  albums: Album[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function AlbumsShowcase({
  albums,
  title = "Photo Albums",
  subtitle,
  limit = 6,
}: AlbumsShowcaseProps) {
  const featuredAlbums = albums.slice(0, limit);

  if (featuredAlbums.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredAlbums.map((album) => (
            <Link
              key={album._id}
              href={`/albums/${album._id}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10 hover:border-[#FFDD00]/50 transition-all"
            >
              {album.coverImage ? (
                <img
                  src={album.coverImage}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#414141] to-[#2C2C2C]">
                  <FolderOutlined className="text-4xl text-gray-400 mb-2" />
                  <span className="text-gray-400">No Cover Image</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  {album.name}
                </h3>
                {album.description && (
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                    {album.description}
                  </p>
                )}
                {album.productIds && album.productIds.length > 0 && (
                  <span className="inline-block px-3 py-1 bg-[#FFDD00] text-[#1C1C1C] text-xs font-semibold rounded-full">
                    {album.productIds.length} photos
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {albums.length > limit && (
          <div className="text-center">
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              View All Albums
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


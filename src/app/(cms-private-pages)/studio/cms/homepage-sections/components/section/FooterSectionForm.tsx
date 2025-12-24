"use client";

import { Input } from "antd";

interface FooterSectionFormProps {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}

export default function FooterSectionForm({
  content,
  updateContent,
}: FooterSectionFormProps) {
  const getStringValue = (value: unknown): string => {
    return typeof value === "string" ? value : "";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên thương hiệu
        </label>
        <Input
          value={getStringValue(content.brandName)}
          onChange={(e) => updateContent("brandName", e.target.value)}
          placeholder="Portfolio Studio"
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Mô tả thương hiệu
        </label>
        <Input.TextArea
          value={getStringValue(content.brandDescription)}
          onChange={(e) => updateContent("brandDescription", e.target.value)}
          placeholder="Dịch vụ nhiếp ảnh và quay phim chuyên nghiệp..."
          rows={3}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Facebook URL
          </label>
          <Input
            value={getStringValue(content.facebookUrl)}
            onChange={(e) => updateContent("facebookUrl", e.target.value)}
            placeholder="https://facebook.com"
            className="bg-moonlight border-spirit-cyan/20 text-ice-white"
          />
        </div>

        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Instagram URL
          </label>
          <Input
            value={getStringValue(content.instagramUrl)}
            onChange={(e) => updateContent("instagramUrl", e.target.value)}
            placeholder="https://instagram.com"
            className="bg-moonlight border-spirit-cyan/20 text-ice-white"
          />
        </div>

        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            YouTube URL
          </label>
          <Input
            value={getStringValue(content.youtubeUrl)}
            onChange={(e) => updateContent("youtubeUrl", e.target.value)}
            placeholder="https://youtube.com"
            className="bg-moonlight border-spirit-cyan/20 text-ice-white"
          />
        </div>
      </div>

      <div className="border-t border-spirit-cyan/20 pt-4">
        <h4 className="text-ice-white font-semibold mb-4">Thông tin liên hệ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-ice-white text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              value={getStringValue(content.email)}
              onChange={(e) => updateContent("email", e.target.value)}
              placeholder="info@portfoliostudio.com"
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>

          <div>
            <label className="block text-ice-white text-sm font-medium mb-2">
              Số điện thoại
            </label>
            <Input
              value={getStringValue(content.phone)}
              onChange={(e) => updateContent("phone", e.target.value)}
              placeholder="+84 123 456 789"
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-ice-white text-sm font-medium mb-2">
              Địa chỉ
            </label>
            <Input
              value={getStringValue(content.address)}
              onChange={(e) => updateContent("address", e.target.value)}
              placeholder="123 Studio Street, Thành phố, Việt Nam"
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-spirit-cyan/20 pt-4">
        <h4 className="text-ice-white font-semibold mb-4">Liên kết nhanh</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-ice-white text-sm font-medium mb-2">
              Liên kết "Về chúng tôi" (URL)
            </label>
            <Input
              value={getStringValue(content.aboutLink)}
              onChange={(e) => updateContent("aboutLink", e.target.value)}
              placeholder="/ve-chung-toi"
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-spirit-cyan/20 pt-4">
        <h4 className="text-ice-white font-semibold mb-4">
          Fixed Contact Button
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-ice-white text-sm font-medium mb-2">
              Zalo URL/Số điện thoại
            </label>
            <Input
              value={getStringValue(content.zaloContact)}
              onChange={(e) => updateContent("zaloContact", e.target.value)}
              placeholder="https://zalo.me/0123456789 hoặc 0123456789"
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>

          <div>
            <label className="block text-ice-white text-sm font-medium mb-2">
              Chat Widget URL (nếu có)
            </label>
            <Input
              value={getStringValue(content.chatUrl)}
              onChange={(e) => updateContent("chatUrl", e.target.value)}
              placeholder="https://..."
              className="bg-moonlight border-spirit-cyan/20 text-ice-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

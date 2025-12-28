"use client";

import React, { useState } from "react";
import { Select, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEquipment, Equipment } from "@/hooks/useEquipment";
import { PlatformLink } from "@/hooks/useProducts";

interface QuayDungFormProps {
  formData: {
    name: string;
    description: string;
    images: string[];
    videoUrl: string;
    platformLinks: PlatformLink[];
    categoryText: string;
    location: string;
    equipmentIds: string[];
    aspectRatio?: string;
  };
  onChange: (field: string, value: unknown) => void;
}

export default function QuayDungForm({
  formData,
  onChange,
}: QuayDungFormProps) {
  const { data: equipmentData } = useEquipment({ limit: 1000 });
  const equipmentList = equipmentData?.data || [];

  // Auto set aspectRatio to "16/9" if has video and aspectRatio is not set
  React.useEffect(() => {
    const hasVideo =
      (formData.platformLinks && formData.platformLinks.length > 0) ||
      formData.videoUrl;
    if (hasVideo && !formData.aspectRatio) {
      onChange("aspectRatio", "16/9");
    }
  }, [formData.platformLinks, formData.videoUrl, formData.aspectRatio, onChange]);

  const addPlatformLink = () => {
    const newLinks = [
      ...formData.platformLinks,
      { platform: "youtube" as const, url: "" },
    ];
    onChange("platformLinks", newLinks);
  };

  const updatePlatformLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const newLinks = [...formData.platformLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange("platformLinks", newLinks);
  };

  const removePlatformLink = (index: number) => {
    const newLinks = formData.platformLinks.filter((_, i) => i !== index);
    onChange("platformLinks", newLinks);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên video <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Nhập tên video"
        />
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Mô tả
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all resize-none"
          placeholder="Nhập mô tả video"
        />
      </div>

      {/* Platform Links */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Liên kết video
        </label>
        {formData.platformLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Select
              value={link.platform}
              onChange={(value) => updatePlatformLink(index, "platform", value)}
              className="w-40"
              options={[
                { label: "YouTube", value: "youtube" },
                { label: "Vimeo", value: "vimeo" },
                { label: "Google Drive", value: "drive" },
                { label: "Self Hosted", value: "self_host" },
              ]}
            />
            <Input
              value={link.url}
              onChange={(e) => updatePlatformLink(index, "url", e.target.value)}
              placeholder="Nhập URL video"
              className="flex-1"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removePlatformLink(index)}
            />
          </div>
        ))}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addPlatformLink}
          className="w-full"
        >
          Thêm liên kết
        </Button>
      </div>

      {/* Category Text */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thể loại (mô tả chi tiết)
        </label>
        <textarea
          value={formData.categoryText}
          onChange={(e) => onChange("categoryText", e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all resize-none"
          placeholder="Mô tả thể loại video (khoảng 10 dòng)..."
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Địa điểm
        </label>
        <Input
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="Nhập địa điểm quay"
          className="w-full"
        />
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thiết bị sử dụng
        </label>
        <Select
          mode="multiple"
          value={formData.equipmentIds}
          onChange={(value) => onChange("equipmentIds", value)}
          placeholder="Chọn thiết bị"
          className="w-full"
          options={equipmentList.map((eq: Equipment) => ({
            label: `${eq.name} (${eq.type})`,
            value: eq._id,
          }))}
        />
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tỉ lệ khung hình
        </label>
        <Select
          value={formData.aspectRatio || "16/9"}
          onChange={(value) => onChange("aspectRatio", value)}
          className="w-full"
          options={[
            { label: "16:9 (Widescreen - Mặc định cho video)", value: "16/9" },
            { label: "4:3 (Màn hình)", value: "4/3" },
            { label: "1:1 (Vuông)", value: "1/1" },
            { label: "3:2 (Ảnh)", value: "3/2" },
            { label: "2:3 (Dọc)", value: "2/3" },
            { label: "9:16 (Story)", value: "9/16" },
            { label: "21:9 (Ultrawide)", value: "21/9" },
          ]}
        />
        <p className="text-muted-blue text-xs mt-2">
          Tỉ lệ khung hình của video/ảnh. Mặc định là 16:9 cho video.
        </p>
      </div>

      {/* Note about automatic thumbnail */}
      <div className="bg-spirit-cyan/10 border border-spirit-cyan/20 rounded-xl p-4">
        <p className="text-spirit-cyan text-sm">
          💡 <strong>Lưu ý:</strong> Hình thu nhỏ sẽ được tự động lấy từ YouTube
          nếu bạn có link YouTube. Không cần upload hình thu nhỏ thủ công.
        </p>
      </div>
    </div>
  );
}

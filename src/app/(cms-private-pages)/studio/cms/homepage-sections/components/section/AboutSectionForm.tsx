"use client";
import { useState } from "react";
import { Input, Select } from "antd";
import ImageUpload from "@/components/ImageUpload";

interface AboutSectionFormProps {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}

const getStringValue = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const getStringOrUndefined = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const ASPECT_RATIO_OPTIONS = [
  { label: "1:1 (Vuông)", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
];

export default function AboutSectionForm({
  content,
  updateContent,
}: AboutSectionFormProps) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tiêu đề
        </label>
        <Input
          value={getStringValue(content.title)}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="Tiêu đề phần About"
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Mô tả
        </label>
        <Input.TextArea
          value={getStringValue(content.description)}
          onChange={(e) => updateContent("description", e.target.value)}
          placeholder="Mô tả About"
          rows={6}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tỉ lệ ảnh
        </label>
        <Select
          value={aspectRatio}
          onChange={setAspectRatio}
          placeholder="Chọn tỉ lệ ảnh"
          className="w-full"
          options={ASPECT_RATIO_OPTIONS}
          classNames={{
            root: "!bg-moonlight !border-spirit-cyan/20",
          }}
        />
        <p className="text-muted-blue text-xs mt-1">
          Chọn tỉ lệ ảnh trước khi tải lên. Ảnh sẽ được cắt theo tỉ lệ đã chọn.
        </p>
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Hình ảnh
        </label>
        <ImageUpload
          value={getStringOrUndefined(content.image)}
          onChange={(url) => updateContent("image", url || "")}
          label="Tải hình ảnh About"
          aspectRatio={aspectRatio}
        />
      </div>
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Thống kê
        </label>
        <Input.TextArea
          value={
            Array.isArray(content.stats)
              ? JSON.stringify(content.stats, null, 2)
              : JSON.stringify([], null, 2)
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              updateContent("stats", parsed);
            } catch {
              // Invalid JSON, keep as is
            }
          }}
          placeholder='[{"label": "Năm", "value": "10+"}, {"label": "Dự án", "value": "500+"}]'
          rows={4}
          className="bg-moonlight border-spirit-cyan/20 text-ice-white font-mono text-sm"
        />
        <p className="text-muted-blue text-xs mt-2">
          Mảng các object thống kê với "label" và "value"
        </p>
      </div>
    </div>
  );
}


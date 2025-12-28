"use client";

import { Form, Input } from "antd";
import { IHeroSection } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";

interface HeroSectionFormProps {
  data: IHeroSection;
  onChange: (data: IHeroSection) => void;
}

export default function HeroSectionForm({
  data,
  onChange,
}: HeroSectionFormProps) {
  const handleChange = (field: keyof IHeroSection, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <Form layout="vertical" className="max-w-4xl">
        {/* Title */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Tiêu đề</span>}
          required
        >
          <Input
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Ví dụ: Về chúng tôi"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Subtitle */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Phụ đề</span>}
          required
        >
          <Input.TextArea
            value={data.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Ví dụ: Câu chuyện của chúng tôi"
            rows={3}
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Background Image */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Hình nền (tùy chọn)</span>
          }
        >
          <ImageUpload
            value={data.backgroundImage}
            onChange={(url) => handleChange("backgroundImage", url)}
            folder="about-page/hero"
          />
          <p className="text-muted-blue text-sm mt-2">
            Khuyến nghị: Kích thước 1920x1080px hoặc lớn hơn
          </p>
        </Form.Item>

        {/* Background Video */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">
              Video nền (tùy chọn)
            </span>
          }
        >
          <Input
            value={data.backgroundVideo}
            onChange={(e) => handleChange("backgroundVideo", e.target.value)}
            placeholder="URL video (ưu tiên hơn hình ảnh nếu có)"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
          <p className="text-muted-blue text-sm mt-2">
            Nếu có cả video và hình ảnh, video sẽ được ưu tiên hiển thị
          </p>
        </Form.Item>
      </Form>
    </div>
  );
}


"use client";

import { Form, Input } from "antd";
import { ICTASection } from "@/lib/models/AboutPage";

interface CTASectionFormProps {
  data: ICTASection;
  onChange: (data: ICTASection) => void;
}

export default function CTASectionForm({
  data,
  onChange,
}: CTASectionFormProps) {
  const handleChange = (field: keyof ICTASection, value: string) => {
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
            placeholder="Ví dụ: Sẵn sàng hợp tác?"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Mô tả</span>}
          required
        >
          <Input.TextArea
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Ví dụ: Hãy liên hệ với chúng tôi ngay hôm nay để bắt đầu dự án của bạn"
            rows={3}
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Button Text */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Text nút bấm</span>
          }
          required
        >
          <Input
            value={data.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder="Ví dụ: Liên hệ ngay"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Button Link */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Link nút bấm</span>
          }
          required
        >
          <Input
            value={data.buttonLink}
            onChange={(e) => handleChange("buttonLink", e.target.value)}
            placeholder="Ví dụ: / hoặc URL khác"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
          <p className="text-muted-blue text-sm mt-2">
            Link nội bộ (bắt đầu bằng /) hoặc link bên ngoài (https://...)
          </p>
        </Form.Item>
      </Form>
    </div>
  );
}


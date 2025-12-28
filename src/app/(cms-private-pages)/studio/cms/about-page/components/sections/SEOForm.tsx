"use client";

import { Form, Input, Tag } from "antd";
import { useState } from "react";
import { ISEO } from "@/lib/models/AboutPage";

interface SEOFormProps {
  data: ISEO;
  onChange: (data: ISEO) => void;
}

export default function SEOForm({ data, onChange }: SEOFormProps) {
  const [keywordInput, setKeywordInput] = useState("");

  const handleChange = (field: keyof ISEO, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !data.keywords.includes(keywordInput.trim())) {
      handleChange("keywords", [...data.keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    handleChange(
      "keywords",
      data.keywords.filter((k) => k !== keyword)
    );
  };

  return (
    <div className="space-y-6">
      <Form layout="vertical" className="max-w-4xl">
        {/* Meta Title */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Meta Title</span>}
          required
        >
          <Input
            value={data.metaTitle}
            onChange={(e) => handleChange("metaTitle", e.target.value)}
            placeholder="Tiêu đề hiển thị trên Google (50-60 ký tự)"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
            maxLength={60}
            showCount
          />
          <p className="text-muted-blue text-sm mt-2">
            Hiển thị trên kết quả tìm kiếm Google và tab trình duyệt
          </p>
        </Form.Item>

        {/* Meta Description */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Meta Description</span>
          }
          required
        >
          <Input.TextArea
            value={data.metaDescription}
            onChange={(e) => handleChange("metaDescription", e.target.value)}
            placeholder="Mô tả ngắn về trang (150-160 ký tự)"
            rows={3}
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
            maxLength={160}
            showCount
          />
          <p className="text-muted-blue text-sm mt-2">
            Hiển thị dưới tiêu đề trên kết quả tìm kiếm Google
          </p>
        </Form.Item>

        {/* Keywords */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Keywords</span>}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onPressEnter={handleAddKeyword}
                placeholder="Nhập keyword và nhấn Enter"
                size="large"
                className="bg-moonlight border-spirit-cyan/30 text-ice-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveKeyword(keyword)}
                  className="bg-spirit-cyan/20 border-spirit-cyan/40 text-ice-white px-3 py-1 text-sm"
                >
                  {keyword}
                </Tag>
              ))}
            </div>

            <p className="text-muted-blue text-sm">
              Các từ khóa giúp SEO tốt hơn. Nhập và nhấn Enter để thêm.
            </p>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}


"use client";

import { Form, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { IStorySection } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";

interface StorySectionFormProps {
  data: IStorySection;
  onChange: (data: IStorySection) => void;
}

export default function StorySectionForm({
  data,
  onChange,
}: StorySectionFormProps) {
  const handleChange = (field: keyof IStorySection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddImage = () => {
    handleChange("images", [...data.images, ""]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    handleChange("images", newImages);
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...data.images];
    newImages[index] = url;
    handleChange("images", newImages);
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
            placeholder="Ví dụ: Câu chuyện của chúng tôi"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Content */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Nội dung</span>}
          required
        >
          <Input.TextArea
            value={data.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Kể câu chuyện về studio của bạn..."
            rows={10}
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
          <p className="text-muted-blue text-sm mt-2">
            Hỗ trợ xuống dòng. Nội dung sẽ hiển thị đúng format.
          </p>
        </Form.Item>

        {/* Images */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Hình ảnh minh họa</span>
          }
        >
          <div className="space-y-4">
            {data.images.map((image, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <ImageUpload
                    value={image}
                    onChange={(url) => handleImageChange(index, url)}
                    folder="about-page/story"
                  />
                </div>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveImage(index)}
                  className="mt-2"
                >
                  Xóa
                </Button>
              </div>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddImage}
              block
              size="large"
              className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan hover:text-spirit-cyan"
            >
              Thêm hình ảnh
            </Button>
          </div>
          <p className="text-muted-blue text-sm mt-2">
            Tối đa 4 hình ảnh. Hình đầu tiên sẽ hiển thị lớn hơn nếu có 3 hình.
          </p>
        </Form.Item>
      </Form>
    </div>
  );
}


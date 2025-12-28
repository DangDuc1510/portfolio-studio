"use client";

import { useState } from "react";
import { Form, Input, Button, Modal, Card, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IValuesSection, IValue } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";

const iconOptions = [
  { label: "⭐ Star", value: "star" },
  { label: "🚀 Rocket", value: "rocket" },
  { label: "❤️ Heart", value: "heart" },
  { label: "👥 Team", value: "team" },
  { label: "💡 Bulb", value: "bulb" },
  { label: "🏆 Trophy", value: "trophy" },
];

interface ValuesSectionFormProps {
  data: IValuesSection;
  onChange: (data: IValuesSection) => void;
}

export default function ValuesSectionForm({
  data,
  onChange,
}: ValuesSectionFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentValue, setCurrentValue] = useState<IValue>({
    icon: "star",
    title: "",
    description: "",
    order: 0,
  });
  const [useCustomIcon, setUseCustomIcon] = useState(false);

  const handleChange = (field: keyof IValuesSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddValue = () => {
    setCurrentValue({
      icon: "star",
      title: "",
      description: "",
      order: data.values.length,
    });
    setEditingIndex(null);
    setUseCustomIcon(false);
    setIsModalOpen(true);
  };

  const handleEditValue = (index: number) => {
    const value = data.values[index];
    setCurrentValue(value);
    setEditingIndex(index);
    // Check if icon is a URL (custom image)
    setUseCustomIcon(
      value.icon.startsWith("http") || value.icon.startsWith("/")
    );
    setIsModalOpen(true);
  };

  const handleSaveValue = () => {
    if (!currentValue.title || !currentValue.description) {
      return;
    }

    const newValues = [...data.values];
    if (editingIndex !== null) {
      newValues[editingIndex] = currentValue;
    } else {
      newValues.push(currentValue);
    }

    handleChange("values", newValues);
    setIsModalOpen(false);
  };

  const handleDeleteValue = (index: number) => {
    Modal.confirm({
      title: "Xóa giá trị?",
      content: "Bạn có chắc chắn muốn xóa giá trị này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        const newValues = data.values.filter((_, i) => i !== index);
        handleChange("values", newValues);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Form layout="vertical" className="max-w-4xl">
        <Form.Item
          label={<span className="text-ice-white font-medium">Tiêu đề</span>}
          required
        >
          <Input
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Ví dụ: Giá trị cốt lõi"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-ice-white font-medium">Phụ đề (tùy chọn)</span>
          }
        >
          <Input
            value={data.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Mô tả ngắn"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-ice-white font-medium">Giá trị</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {data.values.map((value, index) => (
              <Card
                key={index}
                className="bg-moonlight border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all text-center"
              >
                <h4 className="text-ice-white font-bold mb-2">{value.title}</h4>
                <p className="text-muted-blue text-sm mb-4 line-clamp-2">
                  {value.description}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditValue(index)}
                    className="bg-navy border-spirit-cyan/30 text-ice-white"
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteValue(index)}
                  >
                    Xóa
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddValue}
            block
            size="large"
            className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan"
          >
            Thêm giá trị
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={
          <span className="text-ice-white">
            {editingIndex !== null ? "Chỉnh sửa giá trị" : "Thêm giá trị"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSaveValue}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        className="cms-modal"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Icon" required>
            <div className="space-y-3">
              <Select
                value={useCustomIcon ? "custom" : currentValue.icon}
                onChange={(value) => {
                  if (value === "custom") {
                    setUseCustomIcon(true);
                  } else {
                    setUseCustomIcon(false);
                    setCurrentValue({ ...currentValue, icon: value });
                  }
                }}
                size="large"
                options={[...iconOptions, { label: "🖼️ Custom Image", value: "custom" }]}
              />

              {useCustomIcon && (
                <ImageUpload
                  value={currentValue.icon}
                  onChange={(url) =>
                    setCurrentValue({ ...currentValue, icon: url })
                  }
                  folder="about-page/values"
                />
              )}
            </div>
          </Form.Item>

          <Form.Item label="Tiêu đề" required>
            <Input
              value={currentValue.title}
              onChange={(e) =>
                setCurrentValue({ ...currentValue, title: e.target.value })
              }
              placeholder="Ví dụ: Sáng tạo"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Mô tả" required>
            <Input.TextArea
              value={currentValue.description}
              onChange={(e) =>
                setCurrentValue({ ...currentValue, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về giá trị này"
              rows={4}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


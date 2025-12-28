"use client";

import { useState } from "react";
import { Form, Input, Button, Modal, Card, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IPartnersSection, IPartner } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

interface PartnersSectionFormProps {
  data: IPartnersSection;
  onChange: (data: IPartnersSection) => void;
}

export default function PartnersSectionForm({
  data,
  onChange,
}: PartnersSectionFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentPartner, setCurrentPartner] = useState<IPartner>({
    name: "",
    logo: "",
    url: "",
    order: 0,
  });

  const handleChange = (field: keyof IPartnersSection, value: unknown) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddPartner = () => {
    setCurrentPartner({
      name: "",
      logo: "",
      url: "",
      order: data.logos.length,
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditPartner = (index: number) => {
    setCurrentPartner(data.logos[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSavePartner = () => {
    if (!currentPartner.name || !currentPartner.logo) {
      return;
    }

    const newLogos = [...data.logos];
    if (editingIndex !== null) {
      newLogos[editingIndex] = currentPartner;
    } else {
      newLogos.push(currentPartner);
    }

    handleChange("logos", newLogos);
    setIsModalOpen(false);
  };

  const handleDeletePartner = (index: number) => {
    const newLogos = data.logos.filter((_, i) => i !== index);
    handleChange("logos", newLogos);
  };

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  return (
    <div className="space-y-6">
      <Form layout="vertical" className="max-w-4xl">
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Hiển thị section</span>
          }
        >
          <Switch
            checked={data.isVisible}
            onChange={(checked) => handleChange("isVisible", checked)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-ice-white font-medium">Tiêu đề</span>}
        >
          <Input
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Ví dụ: Đối tác & Khách hàng"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-ice-white font-medium">Đối tác</span>}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            {data.logos.map((partner, index) => (
              <Card
                key={index}
                className="bg-moonlight border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all p-2"
              >
                <div className="aspect-square relative mb-2 bg-navy rounded flex items-center justify-center p-2">
                  {partner.logo &&
                    (isExternalImage(partner.logo) ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain p-2"
                      />
                    ))}
                </div>
                <p className="text-ice-white text-xs text-center mb-2 truncate">
                  {partner.name}
                </p>
                <div className="flex gap-1 justify-center">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditPartner(index)}
                    className="bg-navy border-spirit-cyan/30 text-ice-white text-xs px-2"
                  />
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeletePartner(index)}
                    className="text-xs px-2"
                  />
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddPartner}
            block
            size="large"
            className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan"
          >
            Thêm đối tác
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={
          <span className="text-ice-white">
            {editingIndex !== null ? "Chỉnh sửa đối tác" : "Thêm đối tác"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSavePartner}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        className="cms-modal"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Logo" required>
            <ImageUpload
              value={currentPartner.logo}
              onChange={(url) =>
                setCurrentPartner({ ...currentPartner, logo: url })
              }
              folder="about-page/partners"
            />
            <p className="text-muted-blue text-sm mt-2">
              Khuyến nghị: Logo nền trong, định dạng PNG
            </p>
          </Form.Item>

          <Form.Item label="Tên đối tác" required>
            <Input
              value={currentPartner.name}
              onChange={(e) =>
                setCurrentPartner({ ...currentPartner, name: e.target.value })
              }
              placeholder="Tên công ty/đối tác"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Website (tùy chọn)">
            <Input
              value={currentPartner.url}
              onChange={(e) =>
                setCurrentPartner({ ...currentPartner, url: e.target.value })
              }
              placeholder="https://..."
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


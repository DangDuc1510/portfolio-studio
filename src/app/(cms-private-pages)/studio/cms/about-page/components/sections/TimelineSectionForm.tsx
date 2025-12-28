"use client";

import { useState } from "react";
import { Form, Input, Button, Modal, Card, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ITimelineSection, IMilestone } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";

interface TimelineSectionFormProps {
  data: ITimelineSection;
  onChange: (data: ITimelineSection) => void;
}

export default function TimelineSectionForm({
  data,
  onChange,
}: TimelineSectionFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<IMilestone>({
    year: "",
    title: "",
    description: "",
    image: "",
    order: 0,
  });

  const handleChange = (field: keyof ITimelineSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddMilestone = () => {
    setCurrentMilestone({
      year: "",
      title: "",
      description: "",
      image: "",
      order: data.milestones.length,
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditMilestone = (index: number) => {
    setCurrentMilestone(data.milestones[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveMilestone = () => {
    if (!currentMilestone.year || !currentMilestone.title) {
      return;
    }

    const newMilestones = [...data.milestones];
    if (editingIndex !== null) {
      newMilestones[editingIndex] = currentMilestone;
    } else {
      newMilestones.push(currentMilestone);
    }

    handleChange("milestones", newMilestones);
    setIsModalOpen(false);
  };

  const handleDeleteMilestone = (index: number) => {
    const newMilestones = data.milestones.filter((_, i) => i !== index);
    handleChange("milestones", newMilestones);
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
            placeholder="Ví dụ: Hành trình của chúng tôi"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-ice-white font-medium">Mốc thời gian</span>}
        >
          <div className="space-y-4 mb-4">
            {data.milestones.map((milestone, index) => (
              <Card
                key={index}
                className="bg-moonlight border-spirit-cyan/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 rounded-full bg-spirit-cyan/20 text-spirit-cyan text-sm font-bold mb-2">
                      {milestone.year}
                    </div>
                    <h4 className="text-ice-white font-bold mb-1">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-blue text-sm">
                      {milestone.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditMilestone(index)}
                      className="bg-navy border-spirit-cyan/30 text-ice-white"
                    />
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteMilestone(index)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddMilestone}
            block
            size="large"
            className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan"
          >
            Thêm mốc thời gian
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={
          <span className="text-ice-white">
            {editingIndex !== null ? "Chỉnh sửa mốc thời gian" : "Thêm mốc thời gian"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSaveMilestone}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        className="cms-modal"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Năm" required>
            <Input
              value={currentMilestone.year}
              onChange={(e) =>
                setCurrentMilestone({ ...currentMilestone, year: e.target.value })
              }
              placeholder="Ví dụ: 2020, Q1 2021"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Tiêu đề" required>
            <Input
              value={currentMilestone.title}
              onChange={(e) =>
                setCurrentMilestone({ ...currentMilestone, title: e.target.value })
              }
              placeholder="Ví dụ: Thành lập công ty"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Mô tả" required>
            <Input.TextArea
              value={currentMilestone.description}
              onChange={(e) =>
                setCurrentMilestone({
                  ...currentMilestone,
                  description: e.target.value,
                })
              }
              placeholder="Mô tả chi tiết về mốc thời gian này"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Hình ảnh (tùy chọn)">
            <ImageUpload
              value={currentMilestone.image}
              onChange={(url) =>
                setCurrentMilestone({ ...currentMilestone, image: url })
              }
              folder="about-page/timeline"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


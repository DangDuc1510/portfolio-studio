"use client";

import { useState } from "react";
import { Form, Input, Button, Modal, Card, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IStatsSection, IStat } from "@/lib/models/AboutPage";

interface StatsSectionFormProps {
  data: IStatsSection;
  onChange: (data: IStatsSection) => void;
}

export default function StatsSectionForm({
  data,
  onChange,
}: StatsSectionFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentStat, setCurrentStat] = useState<IStat>({
    value: "",
    label: "",
    order: 0,
  });

  const handleChange = (field: keyof IStatsSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddStat = () => {
    setCurrentStat({
      value: "",
      label: "",
      order: data.stats.length,
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditStat = (index: number) => {
    setCurrentStat(data.stats[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveStat = () => {
    if (!currentStat.value || !currentStat.label) {
      return;
    }

    const newStats = [...data.stats];
    if (editingIndex !== null) {
      newStats[editingIndex] = currentStat;
    } else {
      newStats.push(currentStat);
    }

    handleChange("stats", newStats);
    setIsModalOpen(false);
  };

  const handleDeleteStat = (index: number) => {
    const newStats = data.stats.filter((_, i) => i !== index);
    handleChange("stats", newStats);
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
          <p className="text-muted-blue text-sm mt-2">
            Bật/tắt hiển thị section thống kê trên trang
          </p>
        </Form.Item>

        <Form.Item
          label={<span className="text-ice-white font-medium">Thống kê</span>}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {data.stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-moonlight border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all text-center"
              >
                <div className="text-3xl font-bold text-golden mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-blue text-sm mb-3">{stat.label}</div>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditStat(index)}
                    className="bg-navy border-spirit-cyan/30 text-ice-white"
                  />
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteStat(index)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddStat}
            block
            size="large"
            className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan"
          >
            Thêm thống kê
          </Button>
          <p className="text-muted-blue text-sm mt-2">
            Ví dụ: "100+" - "Dự án hoàn thành", "5 năm" - "Kinh nghiệm"
          </p>
        </Form.Item>
      </Form>

      <Modal
        title={
          <span className="text-ice-white">
            {editingIndex !== null ? "Chỉnh sửa thống kê" : "Thêm thống kê"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSaveStat}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
        className="cms-modal"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Giá trị" required>
            <Input
              value={currentStat.value}
              onChange={(e) =>
                setCurrentStat({ ...currentStat, value: e.target.value })
              }
              placeholder="Ví dụ: 100+, 5 năm, 50+"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Nhãn" required>
            <Input
              value={currentStat.label}
              onChange={(e) =>
                setCurrentStat({ ...currentStat, label: e.target.value })
              }
              placeholder="Ví dụ: Dự án hoàn thành, Kinh nghiệm"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


"use client";

import { useState } from "react";
import { Form, Input, Button, Modal, Card } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ITeamSection, ITeamMember } from "@/lib/models/AboutPage";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

interface TeamSectionFormProps {
  data: ITeamSection;
  onChange: (data: ITeamSection) => void;
}

export default function TeamSectionForm({
  data,
  onChange,
}: TeamSectionFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentMember, setCurrentMember] = useState<ITeamMember>({
    name: "",
    role: "",
    bio: "",
    avatar: "",
    order: 0,
    socialLinks: {},
  });

  const handleChange = (field: keyof ITeamSection, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddMember = () => {
    setCurrentMember({
      name: "",
      role: "",
      bio: "",
      avatar: "",
      order: data.members.length,
      socialLinks: {},
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (index: number) => {
    setCurrentMember(data.members[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveMember = () => {
    if (!currentMember.name || !currentMember.role || !currentMember.bio) {
      return;
    }

    const newMembers = [...data.members];
    if (editingIndex !== null) {
      newMembers[editingIndex] = currentMember;
    } else {
      newMembers.push(currentMember);
    }

    handleChange("members", newMembers);
    setIsModalOpen(false);
  };

  const handleDeleteMember = (index: number) => {
    Modal.confirm({
      title: "Xóa thành viên?",
      content: "Bạn có chắc chắn muốn xóa thành viên này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        const newMembers = data.members.filter((_, i) => i !== index);
        handleChange("members", newMembers);
      },
    });
  };

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
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
            placeholder="Ví dụ: Đội ngũ của chúng tôi"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Subtitle */}
        <Form.Item
          label={
            <span className="text-ice-white font-medium">Phụ đề (tùy chọn)</span>
          }
        >
          <Input
            value={data.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Mô tả ngắn về đội ngũ"
            size="large"
            className="bg-moonlight border-spirit-cyan/30 text-ice-white"
          />
        </Form.Item>

        {/* Team Members */}
        <Form.Item
          label={<span className="text-ice-white font-medium">Thành viên</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {data.members.map((member, index) => (
              <Card
                key={index}
                className="bg-moonlight border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-spirit-cyan/30">
                    {member.avatar ? (
                      isExternalImage(member.avatar) ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-navy flex items-center justify-center">
                        <UserOutlined className="text-2xl text-muted-blue" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h4 className="text-ice-white font-bold mb-1 truncate">
                    {member.name}
                  </h4>
                  <p className="text-golden text-sm mb-3 truncate">
                    {member.role}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditMember(index)}
                      className="bg-navy border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan"
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteMember(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddMember}
            block
            size="large"
            className="border-spirit-cyan/30 text-ice-white hover:border-spirit-cyan hover:text-spirit-cyan"
          >
            Thêm thành viên
          </Button>
        </Form.Item>
      </Form>

      {/* Member Modal */}
      <Modal
        title={
          <span className="text-ice-white">
            {editingIndex !== null ? "Chỉnh sửa thành viên" : "Thêm thành viên"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSaveMember}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
        className="cms-modal"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Ảnh đại diện" required>
            <ImageUpload
              value={currentMember.avatar}
              onChange={(url) =>
                setCurrentMember({ ...currentMember, avatar: url })
              }
              folder="about-page/team"
            />
          </Form.Item>

          <Form.Item label="Tên" required>
            <Input
              value={currentMember.name}
              onChange={(e) =>
                setCurrentMember({ ...currentMember, name: e.target.value })
              }
              placeholder="Tên thành viên"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Vai trò" required>
            <Input
              value={currentMember.role}
              onChange={(e) =>
                setCurrentMember({ ...currentMember, role: e.target.value })
              }
              placeholder="Ví dụ: Creative Director"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Giới thiệu" required>
            <Input.TextArea
              value={currentMember.bio}
              onChange={(e) =>
                setCurrentMember({ ...currentMember, bio: e.target.value })
              }
              placeholder="Giới thiệu ngắn về thành viên"
              rows={4}
              size="large"
            />
          </Form.Item>

          <div className="text-ice-white font-medium mb-2">
            Mạng xã hội (tùy chọn)
          </div>

          <Form.Item label="Facebook">
            <Input
              value={currentMember.socialLinks?.facebook}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  socialLinks: {
                    ...currentMember.socialLinks,
                    facebook: e.target.value,
                  },
                })
              }
              placeholder="https://facebook.com/..."
              size="large"
            />
          </Form.Item>

          <Form.Item label="Instagram">
            <Input
              value={currentMember.socialLinks?.instagram}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  socialLinks: {
                    ...currentMember.socialLinks,
                    instagram: e.target.value,
                  },
                })
              }
              placeholder="https://instagram.com/..."
              size="large"
            />
          </Form.Item>

          <Form.Item label="LinkedIn">
            <Input
              value={currentMember.socialLinks?.linkedin}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  socialLinks: {
                    ...currentMember.socialLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              placeholder="https://linkedin.com/in/..."
              size="large"
            />
          </Form.Item>

          <Form.Item label="Email">
            <Input
              value={currentMember.socialLinks?.email}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  socialLinks: {
                    ...currentMember.socialLinks,
                    email: e.target.value,
                  },
                })
              }
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


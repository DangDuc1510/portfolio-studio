"use client";
import Link from "next/link";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Equipment } from "@/hooks/useEquipment";

interface EquipmentCardProps {
  equipment: Equipment;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    camera: "📷 Máy ảnh",
    lens: "🔍 Ống kính",
    drone: "🚁 Drone",
    gimbal: "📹 Gimbal",
    other: "⚙️ Khác",
  };
  return labels[type] || type;
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    camera: "bg-spirit-cyan/20 text-spirit-cyan border-spirit-cyan/30",
    lens: "bg-mystic/20 text-mystic border-mystic/30",
    drone: "bg-soft-gold/20 text-soft-gold border-soft-gold/30",
    gimbal: "bg-golden/20 text-golden border-golden/30",
    other: "bg-muted-blue/20 text-muted-blue border-muted-blue/30",
  };
  return colors[type] || colors.other;
};

export default function EquipmentCard({
  equipment,
  onDelete,
  isDeleting,
}: EquipmentCardProps) {
  return (
    <div className="glass-card rounded-lg overflow-hidden hover-lift border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 flex flex-col justify-between group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-pure-white text-xl font-bold flex-1">
            {equipment.name}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
              equipment.type
            )}`}
          >
            {getTypeLabel(equipment.type)}
          </span>
        </div>
        {(equipment.createdAt || equipment.updatedAt) && (
          <div className="text-xs text-muted-blue mb-4 space-y-1">
            {equipment.createdAt && (
              <div>
                Tạo: {new Date(equipment.createdAt).toLocaleDateString("vi-VN")}
              </div>
            )}
            {equipment.updatedAt && (
              <div>
                Cập nhật:{" "}
                {new Date(equipment.updatedAt).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <Link
            href={`/studio/cms/equipment/edit/${equipment._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-cyan hover:opacity-90 text-midnight rounded-lg transition-all border border-spirit-cyan/20 font-medium"
          >
            <EditOutlined />
            <span>Chỉnh sửa</span>
          </Link>
          <button
            onClick={() => onDelete(equipment._id, equipment.name)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-error/15 text-error hover:text-error rounded-lg transition-all border border-error/50 hover:border-error disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}


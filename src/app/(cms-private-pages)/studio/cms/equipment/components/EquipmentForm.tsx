"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select } from "antd";
import {
  useEquipmentById,
  useCreateEquipment,
  useUpdateEquipment,
  Equipment,
  EquipmentType,
} from "@/hooks/useEquipment";
import LoadingScreen from "@/components/LoadingScreen";

interface EquipmentFormProps {
  equipmentId?: string;
  onSuccess?: () => void;
}

export default function EquipmentForm({
  equipmentId,
  onSuccess,
}: EquipmentFormProps) {
  const router = useRouter();
  const { data: equipment, isLoading: isLoadingEquipment } =
    useEquipmentById(equipmentId);
  const createEquipment = useCreateEquipment();
  const updateEquipment = useUpdateEquipment();

  const isLoading = isLoadingEquipment;
  const isSubmitting =
    createEquipment.isPending || updateEquipment.isPending;

  const [form, setForm] = useState<
    Omit<Equipment, "_id" | "createdAt" | "updatedAt">
  >({
    name: "",
    type: "camera",
  });

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name,
        type: equipment.type,
      });
    }
  }, [equipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (equipmentId) {
        await updateEquipment.mutateAsync({ id: equipmentId, data: form });
      } else {
        await createEquipment.mutateAsync({
          name: form.name,
          type: form.type,
        });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio/cms/equipment");
      }
    } catch (error) {
      console.error("Failed to save equipment:", error);
      alert("Không thể lưu thiết bị");
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải thông tin thiết bị..." fullScreen={false} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên thiết bị <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 bg-moonlight border border-spirit-cyan/20 rounded-xl text-ice-white placeholder-muted-blue focus:outline-none focus:border-spirit-cyan/40 focus:ring-2 focus:ring-spirit-cyan/20 transition-all"
          placeholder="Ví dụ: Canon EOS R5, Sony FE 24-70mm f/2.8..."
        />
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Loại thiết bị <span className="text-error">*</span>
        </label>
        <Select
          value={form.type}
          onChange={(value: EquipmentType) =>
            setForm({ ...form, type: value })
          }
          placeholder="Chọn loại thiết bị"
          style={{ width: "100%" }}
          className="equipment-type-select"
          options={[
            { label: "📷 Máy ảnh", value: "camera" },
            { label: "🔍 Ống kính", value: "lens" },
            { label: "🚁 Drone", value: "drone" },
            { label: "📹 Gimbal", value: "gimbal" },
            { label: "⚙️ Khác", value: "other" },
          ]}
        />
        <p className="text-muted-blue text-xs mt-2">
          Chọn loại thiết bị để phân loại dễ dàng hơn
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-secondary-cyan hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          {isSubmitting
            ? "Đang lưu..."
            : equipmentId
            ? "Cập nhật thiết bị"
            : "Tạo thiết bị"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 bg-transparent hover:bg-moonlight-light disabled:opacity-50 disabled:cursor-not-allowed text-ice-white rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}


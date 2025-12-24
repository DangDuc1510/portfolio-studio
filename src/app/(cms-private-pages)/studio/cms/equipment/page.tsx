"use client";
import Link from "next/link";
import {
  useEquipment,
  useDeleteEquipment,
  Equipment,
} from "@/hooks/useEquipment";
import { PlusOutlined } from "@ant-design/icons";
import EquipmentCard from "./components/EquipmentCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function EquipmentListPage() {
  const { data: equipmentData, isLoading } = useEquipment({ limit: 1000 });
  const equipmentList = equipmentData?.data || [];
  const deleteEquipment = useDeleteEquipment();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thiết bị "${name}"?`)) {
      try {
        await deleteEquipment.mutateAsync(id);
      } catch (error: unknown) {
        console.error("Failed to delete equipment:", error);
        let errorMessage = "Không thể xóa thiết bị";
        if (error && typeof error === "object") {
          const err = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          errorMessage =
            err.response?.data?.message || err.message || errorMessage;
        }
        alert(errorMessage);
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải danh sách thiết bị..." fullScreen={false} />;
  }

  return (
    <div className="text-ice-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-pure-white">
            Thiết bị
          </h1>
          <p className="text-muted-blue">
            Quản lý thiết bị sử dụng ({equipmentList.length} mục)
          </p>
        </div>
        <Link
          href="/studio/cms/equipment/create"
          className="flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          <PlusOutlined />
          <span>Tạo thiết bị</span>
        </Link>
      </div>

      {equipmentList.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-spirit-cyan/20 text-center">
          <p className="text-muted-blue text-lg mb-6">
            Không tìm thấy thiết bị
          </p>
          <Link
            href="/studio/cms/equipment/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
          >
            <PlusOutlined />
            <span>Tạo thiết bị đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((equipment: Equipment) => (
            <EquipmentCard
              key={equipment._id}
              equipment={equipment}
              onDelete={handleDelete}
              isDeleting={deleteEquipment.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}


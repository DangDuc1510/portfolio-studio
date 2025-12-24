"use client";
import { useParams } from "next/navigation";
import EquipmentForm from "../../components/EquipmentForm";

export default function EditEquipmentPage() {
  const params = useParams();
  const equipmentId = params.id as string;

  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Chỉnh sửa thiết bị
        </h1>
        <p className="text-muted-blue">Cập nhật thông tin thiết bị</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <EquipmentForm equipmentId={equipmentId} />
      </div>
    </div>
  );
}


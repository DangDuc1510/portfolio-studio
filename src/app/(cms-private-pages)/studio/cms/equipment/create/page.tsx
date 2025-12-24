"use client";
import EquipmentForm from "../components/EquipmentForm";

export default function CreateEquipmentPage() {
  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Tạo thiết bị
        </h1>
        <p className="text-muted-blue">Thêm thiết bị mới vào danh mục</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <EquipmentForm />
      </div>
    </div>
  );
}


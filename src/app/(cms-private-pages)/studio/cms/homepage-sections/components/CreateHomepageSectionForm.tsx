"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { useCreateHomepageSection } from "@/hooks/useHomepageSections";

export default function CreateHomepageSectionForm() {
  const router = useRouter();
  const createSection = useCreateHomepageSection();

  const [form, setForm] = useState({
    sectionName: "",
    isVisible: true,
    content: {},
  });

  const isSubmitting = createSection.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.sectionName.trim()) {
      alert("Vui lòng nhập tên section");
      return;
    }

    try {
      await createSection.mutateAsync(form);
      router.push("/studio/cms/homepage-sections");
    } catch (error: unknown) {
      console.error("Failed to create section:", error);
      let errorMessage = "Không thể tạo section";
      if (error && typeof error === "object") {
        const err = error as {
          response?: { data?: { error?: string; message?: string } };
          message?: string;
        };
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          errorMessage;
      }
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-pure-white mb-2">
          Tạo Section Mới
        </h3>
        <p className="text-muted-blue text-sm">
          Tạo một section mới để quản lý nội dung trang chủ
        </p>
      </div>

      <div>
        <label className="block text-ice-white text-sm font-medium mb-2">
          Tên Section <span className="text-error">*</span>
        </label>
        <Input
          value={form.sectionName}
          onChange={(e) => setForm({ ...form, sectionName: e.target.value })}
          placeholder="Ví dụ: featured-content, hero, about..."
          required
          className="bg-moonlight border-spirit-cyan/20 text-ice-white"
        />
        <p className="text-muted-blue text-xs mt-1">
          Tên section phải là duy nhất và không có khoảng trắng. Sử dụng dấu
          gạch ngang để phân cách (ví dụ: featured-content)
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-secondary-cyan hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          {isSubmitting ? "Đang tạo..." : "Tạo Section"}
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

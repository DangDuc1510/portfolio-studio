"use client";
import { useParams } from "next/navigation";
import ProductForm from "../../components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="text-ice-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-muted-blue">Cập nhật thông tin sản phẩm</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20">
        <ProductForm productId={productId} />
      </div>
    </div>
  );
}


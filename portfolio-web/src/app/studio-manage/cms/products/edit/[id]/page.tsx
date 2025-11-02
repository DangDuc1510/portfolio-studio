"use client";
import { useParams } from "next/navigation";
import ProductForm from "../../components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Edit Product</h1>
        <p className="text-gray-400">Update product information</p>
      </div>

      <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <ProductForm productId={productId} />
      </div>
    </div>
  );
}


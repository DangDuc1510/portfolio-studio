"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select } from "antd";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  Product,
  ProductType,
  PlatformLink,
} from "@/hooks/useProducts";
import { useAlbums, Album } from "@/hooks/useAlbums";
import QuayDungForm from "./forms/QuayDungForm";
import ThietKeForm from "./forms/ThietKeForm";
import ChupChinhAnhForm from "./forms/ChupChinhAnhForm";
import LoadingScreen from "@/components/LoadingScreen";

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

type FormStep = "select-type" | "fill-details";

export default function ProductForm({
  productId,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { data: albums = [], isLoading: isLoadingAlbums } = useAlbums();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isLoading = isLoadingProduct || isLoadingAlbums;
  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  // Step management: if editing, skip to fill-details, otherwise start with select-type
  const [currentStep, setCurrentStep] = useState<FormStep>(
    productId ? "fill-details" : "select-type"
  );
  const [selectedProductType, setSelectedProductType] = useState<
    ProductType | undefined
  >(productId ? product?.productType : undefined);

  // Form state with all fields
  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    description: "",
    images: [],
    productType: "QUAY_DUNG",
    albumId: "",
    videoUrl: "",
    thumbnail: "",
    aspectRatio: "",
    platformLinks: [],
    categoryText: "",
    location: "",
    equipmentIds: [],
    designType: "",
    clientType: "",
    toolsUsed: [],
    photographyType: "",
    isPublished: false,
  });

  useEffect(() => {
    if (product) {
      // For THIET_KE: Handle backward compatibility - merge coverImage (thumbnail) and gallery (images) into images
      let images = product.images || [];
      if (product.productType === "THIET_KE") {
        // If thumbnail exists and not already in images, add it as first image
        if (product.thumbnail && !images.includes(product.thumbnail)) {
          images = [product.thumbnail, ...images];
        }
      }

      // Convert equipmentIds from ObjectId to string array if needed
      let equipmentIds: string[] = [];
      if (product.equipmentIds) {
        equipmentIds = product.equipmentIds.map((id: unknown) => {
          // Handle both ObjectId and string formats
          if (typeof id === "string") return id;
          if (id && typeof id === "object" && "toString" in id) {
            return id.toString();
          }
          return String(id);
        });
      }

      // Ensure platformLinks is always an array
      let platformLinks: PlatformLink[] = [];
      if (product.platformLinks && Array.isArray(product.platformLinks)) {
        platformLinks = product.platformLinks;
      }

      // Ensure toolsUsed is always an array
      let toolsUsed: string[] = [];
      if (product.toolsUsed && Array.isArray(product.toolsUsed)) {
        toolsUsed = product.toolsUsed;
      }

      setForm({
        name: product.name || "",
        description: product.description || "",
        images: images,
        productType: product.productType || "QUAY_DUNG",
        albumId: product.albumId
          ? typeof product.albumId === "string"
            ? product.albumId
            : product.albumId.toString()
          : "",
        videoUrl: product.videoUrl || "",
        thumbnail: product.thumbnail || "",
        aspectRatio: product.aspectRatio || "",
        platformLinks: platformLinks,
        categoryText: product.categoryText || "",
        location: product.location || "",
        equipmentIds: equipmentIds,
        designType: product.designType || "",
        clientType: product.clientType || "",
        toolsUsed: toolsUsed,
        photographyType: product.photographyType || "",
        isPublished: product.isPublished || false,
      });
      setSelectedProductType(product.productType);
      setCurrentStep("fill-details");
    }
  }, [product]);

  const handleFieldChange = (field: string, value: unknown) => {
    if (field === "toolsUsed") {
      console.log("ProductForm - handleFieldChange toolsUsed:", {
        field,
        value,
        valueType: typeof value,
        isArray: Array.isArray(value),
      });
    }
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "toolsUsed") {
        console.log("ProductForm - Updated form state:", {
          toolsUsed: updated.toolsUsed,
        });
      }
      return updated;
    });
  };

  const handleProductTypeSelect = (type: ProductType) => {
    setSelectedProductType(type);
    setForm((prev) => ({ ...prev, productType: type }));
    setCurrentStep("fill-details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productType) {
      alert("Vui lòng chọn loại sản phẩm");
      return;
    }

    try {
      // Prepare data based on product type
      const submitData: Partial<Product> = {
        name: form.name || "",
        description: form.description || "",
        productType: form.productType,
        albumId: form.albumId || "",
        aspectRatio: form.aspectRatio || "",
        isPublished: form.isPublished || false,
      };

      // Add type-specific fields
      if (form.productType === "QUAY_DUNG") {
        submitData.platformLinks =
          form.platformLinks && Array.isArray(form.platformLinks)
            ? form.platformLinks
            : [];
        submitData.categoryText = form.categoryText || "";
        submitData.location = form.location || "";
        submitData.equipmentIds =
          form.equipmentIds && Array.isArray(form.equipmentIds)
            ? form.equipmentIds
            : [];
        // Thumbnail will be automatically generated from YouTube if available
        // Use first platform link as videoUrl for backward compatibility
        if (
          form.platformLinks &&
          Array.isArray(form.platformLinks) &&
          form.platformLinks.length > 0
        ) {
          submitData.videoUrl = form.platformLinks[0].url;
        }
      } else if (form.productType === "THIET_KE") {
        submitData.designType = form.designType || "";
        submitData.clientType = form.clientType || "";
        // Always include toolsUsed, ensure it's always an array
        console.log("form.toolsUsed", form.toolsUsed);
        submitData.toolsUsed = Array.isArray(form.toolsUsed)
          ? form.toolsUsed
          : [];
        submitData.images = form.images || [];
        // Use first image as thumbnail (cover image)
        if (form.images && form.images.length > 0) {
          submitData.thumbnail = form.images[0];
        }
      } else if (form.productType === "CHUP_CHINH_ANH") {
        submitData.photographyType = form.photographyType || "";
        submitData.location = form.location || "";
        submitData.equipmentIds =
          form.equipmentIds && Array.isArray(form.equipmentIds)
            ? form.equipmentIds
            : [];
        submitData.images = form.images || [];
      }

      if (productId) {
        console.log("submitData", submitData);
        await updateProduct.mutateAsync({ id: productId, data: submitData });
      } else {
        await createProduct.mutateAsync(submitData as Record<string, unknown>);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/studio/cms/products");
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Không thể lưu sản phẩm");
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải thông tin sản phẩm..." fullScreen={false} />;
  }

  // Step 1: Select Product Type
  if (currentStep === "select-type") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-pure-white mb-2">
            Chọn loại sản phẩm
          </h2>
          <p className="text-muted-blue">
            Vui lòng chọn loại sản phẩm bạn muốn tạo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => handleProductTypeSelect("QUAY_DUNG")}
            className="p-6 glass-card rounded-2xl border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift text-left"
          >
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-xl font-bold text-pure-white mb-2">
              QUAY DỰNG
            </h3>
            <p className="text-muted-blue text-sm">
              Video quay dựng với thông tin về platform, thiết bị, địa điểm
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleProductTypeSelect("THIET_KE")}
            className="p-6 glass-card rounded-2xl border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift text-left"
          >
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-bold text-pure-white mb-2">THIẾT KẾ</h3>
            <p className="text-muted-blue text-sm">
              Dự án thiết kế với gallery, công cụ sử dụng, loại khách hàng
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleProductTypeSelect("CHUP_CHINH_ANH")}
            className="p-6 glass-card rounded-2xl border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift text-left"
          >
            <div className="text-3xl mb-3">📸</div>
            <h3 className="text-xl font-bold text-pure-white mb-2">
              CHỤP - CHỈNH ẢNH
            </h3>
            <p className="text-muted-blue text-sm">
              Bộ ảnh với thể loại nhiếp ảnh, địa điểm, thiết bị sử dụng
            </p>
          </button>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-transparent hover:bg-moonlight-light text-ice-white rounded-xl transition-all border border-spirit-cyan/20 font-medium"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Fill Details based on selected type
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            if (!productId) {
              setCurrentStep("select-type");
              setSelectedProductType(undefined);
            }
          }}
          className="text-muted-blue hover:text-spirit-cyan transition-colors"
        >
          ← Quay lại chọn loại
        </button>
        <div className="flex-1 h-px bg-spirit-cyan/20"></div>
        <span className="text-muted-blue text-sm">
          Loại:{" "}
          <span className="text-spirit-cyan font-semibold">
            {selectedProductType === "QUAY_DUNG"
              ? "QUAY DỰNG"
              : selectedProductType === "THIET_KE"
              ? "THIẾT KẾ"
              : "CHỤP - CHỈNH ẢNH"}
          </span>
        </span>
      </div>

      {/* Dynamic Form based on Product Type */}
      {selectedProductType === "QUAY_DUNG" && (
        <QuayDungForm
          formData={{
            name: form.name || "",
            description: form.description || "",
            images: form.images || [],
            videoUrl: form.videoUrl || "",
            platformLinks: (form.platformLinks || []) as PlatformLink[],
            categoryText: form.categoryText || "",
            location: form.location || "",
            equipmentIds: form.equipmentIds || [],
            aspectRatio: form.aspectRatio || "",
          }}
          onChange={handleFieldChange}
        />
      )}

      {selectedProductType === "THIET_KE" && (
        <ThietKeForm
          formData={{
            name: form.name || "",
            description: form.description || "",
            images: form.images || [],
            designType: form.designType || "",
            clientType: form.clientType || "",
            toolsUsed: form.toolsUsed || [],
            aspectRatio: form.aspectRatio || "",
          }}
          onChange={handleFieldChange}
        />
      )}

      {selectedProductType === "CHUP_CHINH_ANH" && (
        <ChupChinhAnhForm
          formData={{
            name: form.name || "",
            description: form.description || "",
            images: form.images || [],
            photographyType: form.photographyType || "",
            location: form.location || "",
            equipmentIds: form.equipmentIds || [],
            aspectRatio: form.aspectRatio || "",
          }}
          onChange={handleFieldChange}
        />
      )}

      {/* Common Fields */}
      <div className="pt-6 border-t border-spirit-cyan/20">
        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Dự án
          </label>
          <Select
            value={form.albumId || undefined}
            onChange={(value) => handleFieldChange("albumId", value || "")}
            placeholder="Chọn dự án"
            allowClear
            showSearch
            style={{ width: "100%" }}
            className="album-select"
            disabled={isLoadingAlbums}
            options={albums.map((album: Album) => ({
              label: album.name,
              value: album._id,
            }))}
          />
          <p className="text-muted-blue text-xs mt-2">
            Nhóm sản phẩm vào một dự án cụ thể (tùy chọn)
          </p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-secondary-cyan hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
        >
          {isSubmitting
            ? "Đang lưu..."
            : productId
            ? "Cập nhật sản phẩm"
            : "Tạo sản phẩm"}
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

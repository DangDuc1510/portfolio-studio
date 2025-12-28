"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Form, Input, Button, Select, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  usePageSettings,
  useUpdatePageSettings,
  PageType,
} from "@/hooks/usePageSettings";
import { useProducts, Product } from "@/hooks/useProducts";
import ImageUpload from "@/components/ImageUpload";
import LoadingScreen from "@/components/LoadingScreen";

const { TextArea } = Input;

interface PageSettingsFormProps {
  pageType: PageType;
}

export default function PageSettingsForm({ pageType }: PageSettingsFormProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(16 / 9);

  const { data: pageSettings, isLoading } = usePageSettings(pageType);
  const { mutate: updatePageSettings, isPending: isUpdating } =
    useUpdatePageSettings();

  // Get all products of this type for featured selection
  const { data: productsData } = useProducts({
    productType: pageType,
    limit: 100,
  });

  const products = productsData?.data || [];

  useEffect(() => {
    if (pageSettings) {
      // Extract IDs from featuredProductIds (could be objects or strings)
      const featuredIds = Array.isArray(pageSettings.featuredProductIds)
        ? pageSettings.featuredProductIds.map((item: unknown) => {
            // If it's an object with _id, extract _id
            if (typeof item === "object" && item !== null && "_id" in item) {
              return (item as { _id: string })._id;
            }
            // If it's already a string, return as is
            return typeof item === "string" ? item : String(item);
          })
        : [];

      form.setFieldsValue({
        title: pageSettings.title,
        description: pageSettings.description,
        seoTitle: pageSettings.seoTitle,
        seoDescription: pageSettings.seoDescription,
        featuredProductIds: featuredIds,
      });
      setBackgroundImage(pageSettings.backgroundImage || "");
    }
  }, [pageSettings, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      updatePageSettings(
        {
          pageType,
          updates: {
            ...values,
            backgroundImage,
          },
        },
        {
          onSuccess: () => {
            messageApi.success("Cập nhật thành công!");
          },
          onError: (error) => {
            messageApi.error(
              `Cập nhật thất bại: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating page settings:", error);
    }
  };

  const pageTypeLabels = {
    QUAY_DUNG: "Quay dựng",
    THIET_KE: "Thiết kế",
    CHUP_CHINH_ANH: "Chụp - Chỉnh ảnh",
  };

  if (isLoading) {
    return (
      <LoadingScreen message="Đang tải cài đặt trang..." fullScreen={false} />
    );
  }

  return (
    <>
      {contextHolder}
      <div className="text-ice-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/studio/cms/page-settings"
              className="inline-flex items-center gap-2 text-muted-blue hover:text-spirit-cyan mb-4 transition-colors"
            >
              <ArrowLeftOutlined />
              <span>Quay lại danh sách</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-pure-white">
              Cài đặt trang {pageTypeLabels[pageType]}
            </h1>
            <p className="text-muted-blue">
              Quản lý nội dung và cài đặt cho trang {pageTypeLabels[pageType]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card rounded-2xl p-8 border border-spirit-cyan/20 ">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Tiêu đề trang"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input size="large" placeholder="Nhập tiêu đề trang" />
            </Form.Item>

            <Form.Item
              label="Mô tả trang"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả cho trang"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label="Ảnh nền">
              <div className="space-y-4">
                <div>
                  <label className="block text-ice-white text-sm font-medium mb-2">
                    Tỉ lệ ảnh
                  </label>
                  <Select
                    value={aspectRatio}
                    onChange={setAspectRatio}
                    placeholder="Chọn tỉ lệ"
                    size="large"
                    className="w-full"
                    options={[
                      { label: "16:9 (Widescreen)", value: 16 / 9 },
                      { label: "21:9 (Ultrawide)", value: 21 / 9 },
                      { label: "4:3 (Standard)", value: 4 / 3 },
                      { label: "1:1 (Square)", value: 1 },
                      { label: "3:4 (Portrait)", value: 3 / 4 },
                      { label: "9:16 (Vertical)", value: 9 / 16 },
                      { label: "Tự do (Free)", value: undefined },
                    ]}
                  />
                </div>
                <ImageUpload
                  value={backgroundImage}
                  onChange={setBackgroundImage}
                  aspectRatio={aspectRatio}
                />
              </div>
            </Form.Item>

            <Form.Item label="Sản phẩm nổi bật" name="featuredProductIds">
              <Select
                mode="multiple"
                placeholder="Chọn sản phẩm nổi bật"
                size="large"
                options={products.map((product: Product) => ({
                  label: product.name,
                  value: product._id,
                }))}
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={isUpdating}
                className="w-full md:w-auto font-medium"
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

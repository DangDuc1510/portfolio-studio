"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api";
import {
  PictureOutlined,
  ShoppingOutlined,
  HomeOutlined,
  BarChartOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import LoadingScreen from "@/components/LoadingScreen";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
  color: string;
  size?: "normal" | "small";
}

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function CmsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <LoadingScreen message="Đang tải dashboard..." fullScreen={false} />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-blue">Không có dữ liệu</div>
      </div>
    );
  }

  // Prepare data
  const albumsData = stats.albumsWithProductCount || [];
  const productsByType = stats.productsByType || [];
  const equipmentByType = stats.equipmentByType || [];
  const recentProducts = stats.recentProducts || [];
  const growth = stats.growth || { currentWeek: 0, previousWeek: 0, rate: 0 };

  // Colors for charts
  const PRODUCT_TYPE_COLORS: Record<string, string> = {
    QUAY_DUNG: "#4FD1FF",
    THIET_KE: "#6C63FF",
    CHUP_CHINH_ANH: "#F6C177",
  };

  const EQUIPMENT_TYPE_COLORS: Record<string, string> = {
    camera: "#4FD1FF",
    lens: "#6C63FF",
    drone: "#F6C177",
    gimbal: "#4FFFB0",
    other: "#8B84FF",
  };

  // Format date for recent products
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProductTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      QUAY_DUNG: "Quay Dựng",
      THIET_KE: "Thiết Kế",
      CHUP_CHINH_ANH: "Chụp - Chỉnh Ảnh",
    };
    return labels[type] || type;
  };

  return (
    <div className="text-ice-white space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-pure-white">
          Tổng quan Dashboard
        </h1>
        <p className="text-muted-blue">Thống kê tổng quan về hệ thống</p>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<PictureOutlined className="text-3xl text-spirit-cyan" />}
          title="Dự án"
          value={stats.totals.albums}
          color="from-spirit-cyan/30 to-cyan-dark/50"
        />
        <StatCard
          icon={<ShoppingOutlined className="text-3xl text-mystic" />}
          title="Sản phẩm"
          value={stats.totals.products}
          subtitle={`${stats.totals.publishedProducts} đã xuất bản`}
          color="from-mystic/30 to-mystic-dark/50"
        />
        <StatCard
          icon={<HomeOutlined className="text-3xl text-soft-gold" />}
          title="Nội dung trang chủ"
          value={stats.totals.homepageSections}
          color="from-soft-gold/30 to-rich-gold/50"
        />
        <StatCard
          icon={<ToolOutlined className="text-3xl text-success" />}
          title="Thiết bị"
          value={stats.totals.equipment}
          color="from-success/30 to-success-dark/50"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={<CheckCircleOutlined className="text-2xl text-success" />}
          title="Đã xuất bản"
          value={stats.totals.publishedProducts}
          subtitle={`${
            stats.totals.products > 0
              ? Math.round(
                  (stats.totals.publishedProducts / stats.totals.products) * 100
                )
              : 0
          }% tổng số`}
          color="from-success/20 to-success-dark/40"
          size="small"
        />
        <StatCard
          icon={<ClockCircleOutlined className="text-2xl text-warning" />}
          title="Chưa xuất bản"
          value={stats.totals.unpublishedProducts}
          subtitle={`${
            stats.totals.products > 0
              ? Math.round(
                  (stats.totals.unpublishedProducts / stats.totals.products) *
                    100
                )
              : 0
          }% tổng số`}
          color="from-warning/20 to-warning-dark/40"
          size="small"
        />
        <StatCard
          icon={
            growth.rate >= 0 ? (
              <RiseOutlined className="text-2xl text-success" />
            ) : (
              <FallOutlined className="text-2xl text-error" />
            )
          }
          title="Tăng trưởng tuần này"
          value={`${growth.rate >= 0 ? "+" : ""}${growth.rate.toFixed(1)}%`}
          subtitle={`${growth.currentWeek} sản phẩm mới`}
          color={
            growth.rate >= 0
              ? "from-success/20 to-success-dark/40"
              : "from-error/20 to-error-dark/40"
          }
          size="small"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Products Over Time - Line Chart */}
        <ChartCard
          title="Sản phẩm theo thời gian (30 ngày qua)"
          icon={<BarChartOutlined />}
        >
          {stats.productsOverTime?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.productsOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(79, 209, 255, 0.2)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(143, 175, 199, 0.8)"
                  tick={{ fill: "rgba(143, 175, 199, 0.8)", fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(143, 175, 199, 0.8)"
                  tick={{ fill: "rgba(143, 175, 199, 0.8)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B3A5D",
                    border: "1px solid rgba(79, 209, 255, 0.3)",
                    borderRadius: "8px",
                    color: "#EAF6FF",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4FD1FF"
                  strokeWidth={2}
                  dot={{ fill: "#4FD1FF", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-blue">
              Không có dữ liệu sản phẩm theo thời gian
            </div>
          )}
        </ChartCard>

        {/* Products by Type - Pie Chart */}
        <ChartCard title="Sản phẩm theo loại" icon={<FileTextOutlined />}>
          {productsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { type?: string; percent?: number }) => {
                    const type = props.type || "";
                    const percent = props.percent || 0;
                    return `${getProductTypeLabel(type)}: ${(
                      percent * 100
                    ).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                >
                  {productsByType.map((entry: { type: string }) => (
                    <Cell
                      key={`cell-${entry.type}`}
                      fill={PRODUCT_TYPE_COLORS[entry.type] || "#8B84FF"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B3A5D",
                    border: "1px solid rgba(79, 209, 255, 0.3)",
                    borderRadius: "8px",
                    color: "#EAF6FF",
                  }}
                  formatter={(value: number | undefined) => [
                    `${value || 0} sản phẩm`,
                    "Số lượng",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-blue">
              Không có dữ liệu
            </div>
          )}
        </ChartCard>
      </div>

      {/* Equipment Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Equipment by Type */}
        {equipmentByType.length > 0 && (
          <ChartCard title="Thiết bị theo loại" icon={<ToolOutlined />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentByType} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(79, 209, 255, 0.2)"
                />
                <XAxis type="number" stroke="rgba(143, 175, 199, 0.8)" />
                <YAxis
                  dataKey="type"
                  type="category"
                  stroke="rgba(143, 175, 199, 0.8)"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B3A5D",
                    border: "1px solid rgba(79, 209, 255, 0.3)",
                    borderRadius: "8px",
                    color: "#EAF6FF",
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {equipmentByType.map(
                    (entry: { type: string }, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EQUIPMENT_TYPE_COLORS[entry.type] || "#8B84FF"}
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Recent Activity */}
        <ChartCard title="Hoạt động gần đây" icon={<ClockCircleOutlined />}>
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map(
                (
                  product: {
                    name: string;
                    productType: string;
                    createdAt: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-moonlight/30 rounded-lg border border-spirit-cyan/10 hover:border-spirit-cyan/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-ice-white font-medium text-sm">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-blue">
                          {getProductTypeLabel(product.productType)}
                        </span>
                        <span className="text-muted-blue">•</span>
                        <span className="text-xs text-muted-blue">
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          PRODUCT_TYPE_COLORS[product.productType] || "#8B84FF",
                      }}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-blue">
              Không có hoạt động gần đây
            </div>
          )}
        </ChartCard>
      </div>

      {/* Albums with Product Count */}
      {albumsData.length > 0 && (
        <ChartCard
          title="Dự án hàng đầu theo số lượng sản phẩm"
          icon={<BarChartOutlined />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={albumsData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(79, 209, 255, 0.2)"
              />
              <XAxis
                type="number"
                stroke="rgba(143, 175, 199, 0.8)"
                tick={{ fill: "rgba(143, 175, 199, 0.8)" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="rgba(143, 175, 199, 0.8)"
                tick={{ fill: "rgba(143, 175, 199, 0.8)" }}
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B3A5D",
                  border: "1px solid rgba(79, 209, 255, 0.3)",
                  borderRadius: "8px",
                  color: "#EAF6FF",
                }}
              />
              <Legend />
              <Bar
                dataKey="productCount"
                fill="#FFD88A"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  size = "normal",
}: StatCardProps) {
  const paddingClass = size === "small" ? "p-4" : "p-6";
  const valueSizeClass = size === "small" ? "text-2xl" : "text-3xl";

  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl ${paddingClass} shadow-lg backdrop-blur-xl border border-spirit-cyan/20 text-midnight hover:shadow-xl transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-midnight/80 text-sm font-medium mb-1">{title}</p>
          <p className={`text-midnight ${valueSizeClass} font-bold`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-midnight/70 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-midnight/90">{icon}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children, className = "" }: ChartCardProps) {
  return (
    <div
      className={`glass-card rounded-xl p-6 border border-spirit-cyan/20 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-spirit-cyan">{icon}</div>
        <h2 className="text-xl font-bold text-pure-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

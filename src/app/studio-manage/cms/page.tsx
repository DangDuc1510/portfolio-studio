"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api";
import {
  PictureOutlined,
  ShoppingOutlined,
  TeamOutlined,
  HomeOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = {
  pending: "#FFA500",
  contacted: "#1890FF",
  scheduled: "#722ED1",
  completed: "#52C41A",
  cancelled: "#FF4D4F",
};

const CHART_COLORS = [
  "#FFDD00",
  "#1890FF",
  "#52C41A",
  "#722ED1",
  "#FF7A45",
  "#13C2C2",
];

export default function CmsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">No data available</div>
      </div>
    );
  }

  // Prepare customer status data for pie chart
  const customerStatusData = [
    {
      name: "Pending",
      value: stats.customerStatus.pending || 0,
      color: COLORS.pending,
    },
    {
      name: "Contacted",
      value: stats.customerStatus.contacted || 0,
      color: COLORS.contacted,
    },
    {
      name: "Scheduled",
      value: stats.customerStatus.scheduled || 0,
      color: COLORS.scheduled,
    },
    {
      name: "Completed",
      value: stats.customerStatus.completed || 0,
      color: COLORS.completed,
    },
    {
      name: "Cancelled",
      value: stats.customerStatus.cancelled || 0,
      color: COLORS.cancelled,
    },
  ].filter((item) => item.value > 0);

  // Prepare products by category data
  const productsByCategoryData = stats.productsByCategory || [];
  // Prepare customers over time data
  const customersOverTimeData = stats.customersOverTime || [];

  // Prepare albums with product count data
  const albumsData = stats.albumsWithProductCount || [];

  return (
    <div className="text-white space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">Thống kê tổng quan về hệ thống</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<PictureOutlined className="text-3xl" />}
          title="Albums"
          value={stats.totals.albums}
          color="from-[#FFDD00] to-[#FFB800]"
        />
        <StatCard
          icon={<ShoppingOutlined className="text-3xl" />}
          title="Products"
          value={stats.totals.products}
          color="from-[#1890FF] to-[#0050B3]"
        />
        <StatCard
          icon={<TeamOutlined className="text-3xl" />}
          title="Customers"
          value={stats.totals.customers}
          subtitle={`${stats.recentCustomers} trong 7 ngày qua`}
          color="from-[#52C41A] to-[#389E0D]"
        />
        <StatCard
          icon={<HomeOutlined className="text-3xl" />}
          title="Homepage Sections"
          value={stats.totals.homepageSections}
          color="from-[#722ED1] to-[#531DAB]"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Status Pie Chart */}
        <ChartCard
          title="Customer Status Distribution"
          icon={<PieChartOutlined />}
        >
          {customerStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    const percent =
                      (entry.value /
                        customerStatusData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        )) *
                      100;
                    return `${entry.name}: ${percent.toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No customer data available
            </div>
          )}
        </ChartCard>

        {/* Products by Category Bar Chart */}
        <ChartCard title="Products by Category" icon={<BarChartOutlined />}>
          {productsByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B4B4B" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#414141",
                    border: "1px solid #4B4B4B",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#FFDD00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No product category data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Customers Over Time Line Chart */}
      <ChartCard
        title="Customers Over Time (Last 30 Days)"
        icon={<LineChartOutlined />}
        className="mb-6"
      >
        {customersOverTimeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customersOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B4B4B" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#414141",
                  border: "1px solid #4B4B4B",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#52C41A"
                strokeWidth={3}
                dot={{ fill: "#52C41A", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            No customer data over time available
          </div>
        )}
      </ChartCard>

      {/* Albums with Product Count */}
      {albumsData.length > 0 && (
        <ChartCard
          title="Top Albums by Product Count"
          icon={<BarChartOutlined />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={albumsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#4B4B4B" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#9ca3af"
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#414141",
                  border: "1px solid #4B4B4B",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="productCount"
                fill="#722ED1"
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
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg backdrop-blur-xl border border-white/10`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-3xl font-bold">
            {value.toLocaleString()}
          </p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-white/90">{icon}</div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[#FFDD00]">{icon}</div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

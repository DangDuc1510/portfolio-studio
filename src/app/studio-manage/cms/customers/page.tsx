"use client";
import { useState, useMemo, useEffect } from "react";
import {
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
  Customer,
} from "./hooks/useCustomers";
import { Select, Input, Pagination } from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

export default function CustomersListPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters = useMemo(() => {
    const filterObj: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {
      page: currentPage,
      limit: pageSize,
      sortBy: "submissionDate",
      sortOrder: sortOrder,
    };

    if (debouncedSearchQuery) filterObj.search = debouncedSearchQuery;
    if (selectedStatus) filterObj.status = selectedStatus;

    return filterObj;
  }, [debouncedSearchQuery, selectedStatus, currentPage, pageSize, sortOrder]);

  const { data, isLoading } = useCustomers(filters);
  const customers = data?.data || [];
  const pagination = {
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 12,
    totalPages: data?.totalPages || 0,
  };

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Reset to page 1 when debounced search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const deleteCustomer = useDeleteCustomer();
  const updateCustomer = useUpdateCustomer();

  const statusOptions = [
    { label: "Chờ phản hồi", value: "pending", color: "text-yellow-400" },
    { label: "Đã liên hệ", value: "contacted", color: "text-blue-400" },
    { label: "Đã đặt lịch", value: "scheduled", color: "text-purple-400" },
    { label: "Đã hoàn thành", value: "completed", color: "text-green-400" },
    { label: "Đã hủy", value: "cancelled", color: "text-red-400" },
  ];

  const getStatusLabel = (status?: string) => {
    const option = statusOptions.find(
      (opt) => opt.value === (status || "pending")
    );
    return option?.label || "Chờ phản hồi";
  };

  const getStatusColor = (status?: string) => {
    const option = statusOptions.find(
      (opt) => opt.value === (status || "pending")
    );
    return option?.color || "text-yellow-400";
  };

  const handleStatusChange = async (
    customerId: string,
    newStatus: string,
    note?: string
  ) => {
    try {
      const updateData: any = { status: newStatus as any };
      if (newStatus === "completed" && note !== undefined) {
        updateData.note = note;
      }
      await updateCustomer.mutateAsync({
        id: customerId,
        data: updateData,
      });
    } catch (error) {
      console.error("Failed to update customer status:", error);
      alert("Failed to update customer status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete inquiry from "${name}"?`)) {
      try {
        await deleteCustomer.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete customer:", error);
        alert("Failed to delete customer inquiry");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Customer Inquiries
          </h1>
          <p className="text-gray-400">
            Manage customer inquiries ({pagination.total} items)
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#2C2C2C]/80 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <AppstoreOutlined />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UnorderedListOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Search
            </label>
            <Input
              placeholder="Search by name, email, phone..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full ant-select-selector"
              allowClear
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Filter by Status
            </label>
            <Select
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                handleFilterChange();
              }}
              placeholder="All Statuses"
              allowClear
              className="w-full"
              options={statusOptions.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
            />
          </div>

          {/* Sort by Created At */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Sort by Date
            </label>
            <Select
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value);
                handleFilterChange();
              }}
              className="w-full"
              options={[
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <SortDescendingOutlined />
                      Newest First
                    </span>
                  ),
                  value: "desc",
                },
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <SortAscendingOutlined />
                      Oldest First
                    </span>
                  ),
                  value: "asc",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      ) : customers.length === 0 && pagination.total === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg mb-6">
            {debouncedSearchQuery || selectedStatus
              ? "No customers match your filters"
              : "No customer inquiries found"}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customers.map((customer: Customer) => {
                const CustomerCardContent = () => {
                  const [localNote, setLocalNote] = useState(
                    customer.note || ""
                  );

                  return (
                    <div
                      key={customer._id}
                      className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#4B4B4B] to-[#41411] border border-white/10 flex items-center justify-center">
                            <UserOutlined className="text-xl text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white">
                                {customer.name}
                              </h3>
                              {customer.isReturningCustomer ? (
                                <span className="px-2 py-1 bg-gradient-to-b from-[#FFD700] to-[#FFA500] text-black text-xs font-semibold rounded-lg">
                                  Khách hàng cũ
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gradient-to-b from-[#4CAF50] to-[#45a049] text-white text-xs font-semibold rounded-lg">
                                  Khách hàng mới
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                              <CalendarOutlined />
                              {formatDate(customer.submissionDate)}
                            </p>
                            {customer.isReturningCustomer &&
                              customer.serviceCount && (
                                <p className="text-gray-400 text-xs mt-1">
                                  Số lần sử dụng dịch vụ:{" "}
                                  {customer.serviceCount}
                                </p>
                              )}
                            {customer.isReturningCustomer &&
                              customer.previousNote && (
                                <div className="mt-2 p-2 bg-[#2C2C2C]/80 border border-yellow-500/30 rounded-lg">
                                  <p className="text-yellow-400 text-xs font-medium mb-1">
                                    Note từ lần đặt trước:
                                  </p>
                                  <p className="text-gray-300 text-xs">
                                    {customer.previousNote}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDelete(customer._id, customer.name)
                          }
                          disabled={deleteCustomer.isPending}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <label className="block text-white text-sm font-medium mb-2">
                          Status
                        </label>
                        <Select
                          value={customer.status || "pending"}
                          onChange={(value) =>
                            handleStatusChange(customer._id, value, localNote)
                          }
                          className="w-full"
                          disabled={updateCustomer.isPending}
                          options={statusOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                        />
                      </div>

                      {/* Note field - only show when status is completed */}
                      {(customer.status === "completed" || customer.note) && (
                        <div className="mb-4">
                          <label className="block text-white text-sm font-medium mb-2">
                            Note
                          </label>
                          <Input.TextArea
                            value={localNote}
                            onChange={(e) => setLocalNote(e.target.value)}
                            onBlur={() => {
                              if (customer.status === "completed") {
                                handleStatusChange(
                                  customer._id,
                                  customer.status || "completed",
                                  localNote
                                );
                              }
                            }}
                            placeholder="Nhập ghi chú về khách hàng..."
                            rows={3}
                            className="w-full"
                            disabled={updateCustomer.isPending}
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                          <MailOutlined className="text-gray-400" />
                          <a
                            href={`mailto:${customer.email}`}
                            className="hover:text-white transition-colors"
                          >
                            {customer.email}
                          </a>
                        </div>

                        {customer.phone && (
                          <div className="flex items-center gap-3 text-gray-300">
                            <PhoneOutlined className="text-gray-400" />
                            <a
                              href={`tel:${customer.phone}`}
                              className="hover:text-white transition-colors"
                            >
                              {customer.phone}
                            </a>
                          </div>
                        )}

                        {customer.message && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-start gap-3">
                              <MessageOutlined className="text-gray-400 mt-1" />
                              <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-3">
                                {customer.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                };

                return <CustomerCardContent key={customer._id} />;
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {customers.map((customer: Customer) => {
                const CustomerListItemContent = () => {
                  const [localNote, setLocalNote] = useState(
                    customer.note || ""
                  );

                  return (
                    <div
                      key={customer._id}
                      className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex gap-6">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#4B4B4B] to-[#41411] border border-white/10 flex items-center justify-center flex-shrink-0">
                          <UserOutlined className="text-2xl text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-white">
                                  {customer.name}
                                </h3>
                                {customer.isReturningCustomer ? (
                                  <span className="px-2 py-1 bg-gradient-to-b from-[#FFD700] to-[#FFA500] text-black text-xs font-semibold rounded-lg">
                                    Khách hàng cũ
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gradient-to-b from-[#4CAF50] to-[#45a049] text-white text-xs font-semibold rounded-lg">
                                    Khách hàng mới
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <CalendarOutlined />
                                  {formatDate(customer.submissionDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MailOutlined />
                                  <a
                                    href={`mailto:${customer.email}`}
                                    className="hover:text-white transition-colors"
                                  >
                                    {customer.email}
                                  </a>
                                </div>
                                {customer.phone && (
                                  <div className="flex items-center gap-2">
                                    <PhoneOutlined />
                                    <a
                                      href={`tel:${customer.phone}`}
                                      className="hover:text-white transition-colors"
                                    >
                                      {customer.phone}
                                    </a>
                                  </div>
                                )}
                                {customer.isReturningCustomer &&
                                  customer.serviceCount && (
                                    <div className="text-gray-400">
                                      Số lần sử dụng: {customer.serviceCount}
                                    </div>
                                  )}
                              </div>
                              {customer.isReturningCustomer &&
                                customer.previousNote && (
                                  <div className="mb-3 p-2 bg-[#2C2C2C]/80 border border-yellow-500/30 rounded-lg">
                                    <p className="text-yellow-400 text-xs font-medium mb-1">
                                      Note từ lần đặt trước:
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                      {customer.previousNote}
                                    </p>
                                  </div>
                                )}
                              {customer.message && (
                                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                  {customer.message}
                                </p>
                              )}
                              {/* Note field - only show when status is completed */}
                              {(customer.status === "completed" ||
                                customer.note) && (
                                <div className="mb-3">
                                  <label className="block text-white text-xs font-medium mb-1">
                                    Note
                                  </label>
                                  <Input.TextArea
                                    value={localNote}
                                    onChange={(e) =>
                                      setLocalNote(e.target.value)
                                    }
                                    onBlur={() => {
                                      if (customer.status === "completed") {
                                        handleStatusChange(
                                          customer._id,
                                          customer.status || "completed",
                                          localNote
                                        );
                                      }
                                    }}
                                    placeholder="Nhập ghi chú về khách hàng..."
                                    rows={2}
                                    className="w-full"
                                    disabled={updateCustomer.isPending}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              <Select
                                value={customer.status || "pending"}
                                onChange={(value) =>
                                  handleStatusChange(
                                    customer._id,
                                    value,
                                    localNote
                                  )
                                }
                                className="w-40"
                                disabled={updateCustomer.isPending}
                                options={statusOptions.map((opt) => ({
                                  label: opt.label,
                                  value: opt.value,
                                }))}
                              />
                              <button
                                onClick={() =>
                                  handleDelete(customer._id, customer.name)
                                }
                                disabled={deleteCustomer.isPending}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <DeleteOutlined />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                };

                return <CustomerListItemContent key={customer._id} />;
              })}
            </div>
          )}

          {/* Pagination */}
          {customers.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                pageSizeOptions={["12", "24", "48", "96"]}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                }}
                className="custom-pagination"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

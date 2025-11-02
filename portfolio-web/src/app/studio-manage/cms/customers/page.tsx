"use client";
import {
  useCustomers,
  useDeleteCustomer,
  Customer,
} from "./hooks/useCustomers";
import {
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function CustomersListPage() {
  const { data: customers = [], isLoading } = useCustomers();
  const deleteCustomer = useDeleteCustomer();

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
    return date.toLocaleDateString("en-US", {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Customer Inquiries
        </h1>
        <p className="text-gray-400">
          View and manage customer inquiries ({customers.length} items)
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg">No customer inquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {customers.map((customer: Customer) => (
            <div
              key={customer.id}
              className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#4B4B4B] to-[#41411] border border-white/10 flex items-center justify-center">
                    <UserOutlined className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {customer.name}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                      <CalendarOutlined />
                      {formatDate(customer.submissionDate)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(customer.id, customer.name)}
                  disabled={deleteCustomer.isPending}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DeleteOutlined />
                </button>
              </div>

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
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {customer.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Admin {
  AdminUser: string;
  Status?: string;
}

interface AdminFormProps {
  existingAdmin?: Admin | null;
}

const AdminForm: React.FC<AdminFormProps> = ({ existingAdmin = null }) => {
  const [adminUser, setAdminUser] = useState(existingAdmin?.AdminUser || "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(existingAdmin?.Status || "Active");
  const isUpdating = !!existingAdmin;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isUpdating ? "PATCH" : "PUT";
    const url = "/api/AdminAccounts";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AdminUser: adminUser,
          Password: password,
          Status: status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(isUpdating ? "Admin updated successfully!" : "Admin added successfully!");
        router.replace("/admin");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold mb-4 text-center">
          {isUpdating ? "Update Admin Account" : "Add New Admin"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Admin Username"
            className="w-full p-2 border rounded"
            value={adminUser}
            onChange={(e) => setAdminUser(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isUpdating}
          />
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {isUpdating ? "Update Admin" : "Add Admin"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminForm;

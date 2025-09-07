"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ForbiddenPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/AdminAccounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ AdminUser: email, Password: password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Append token to URL
        const params = new URLSearchParams();
        params.set("token", data.token);

        toast.success("Login successful!");
        router.push(`/admin?${params.toString()}`);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForbiddenPage;

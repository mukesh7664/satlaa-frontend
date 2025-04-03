"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Warranty = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderNumber: "",
    purchaseSource: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/warranty/registerWarranty`,
        formData
      );

      if (response) {
        setShowOtpInput(true);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/warranty/verifyOtp`, {
        ...formData,
        otp,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: "",
          phone: "",
          orderNumber: "",
          purchaseSource: "",
        });
        setOtp("");
        setShowOtpInput(false);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <ToastContainer />
      <h1 className="mb-4 text-2xl">Register Your Product Warranty</h1>

      {!showOtpInput ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            placeholder="Order Number"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="purchaseSource"
            value={formData.purchaseSource}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Purchase Source</option>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
          </select>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Verify OTP
          </button>
        </form>
      )}
      <p className="my-4 text-sm">
        If you bought from SATLAA website, Warranty is already registered.
      </p>
    </div>
  );
};

export default Warranty;
// WarrantyRegistrationForm.js

import { useState } from "react";
import axios from "axios";
import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
import { API_URL } from "../../config";
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

      // Handle response, show OTP input
      if (response) {
        setShowOtpInput(true);
      }
    } catch (error) {
      // Handle error
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

      // Handle success
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: '',
          email: '',
          orderNumber: "",
          purchaseSource: "",
        });
        setOtp('')
        setShowOtpInput(false);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.error || "An error occurred");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Error", error.message);
      }
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
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            placeholder="Order Number"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="purchaseSource"
            value={formData.purchaseSource}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
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
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Verify OTP
          </button>
        </form>
      )}
      <p className="my-4 text-sm">If you bought from SATLAA website, Warranty is already registered.</p>
    </div>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await fetchData(store.dispatch);

    return {
      props: {},
    };
  }
);

export default Warranty;

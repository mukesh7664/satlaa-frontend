import React, { useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { Form, Input } from "antd";
const DeliveryTime = () => {
  const [deliveryTime, setDeliveryTime] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchInputRef = useRef(null);
  const [pinCodeForm] = Form.useForm();
  const handleSearch = () => {
    pinCodeForm.submit();
  };
  const checkDeliveryTime = async (values) => {
    try {
      const response = await axios.get(
        `${API_URL}/tracking/estimate/${values.pinCode}`
      );
      if (response.data.error) {
        setError(true);
        setErrorMessage(response.data.message);
      } else {
        setError(false);
        setDeliveryTime(response.data.message); // The ETD from the backend
      }
    } catch (error) {
      console.error("Error fetching delivery time:", error.message);
      setError(true);
      setErrorMessage("Unable to fetch delivery time");
    }
  };
  return (
    <div className="my-3">
      <p className="w-full font-semibold text-[15px] md:text-xl text-gray-700">
        Expected Delivery Time
      </p>
      <Form
        form={pinCodeForm}
        onFinish={checkDeliveryTime}
        className="border-0 mb-1 "
      >
        <div className="flex border border-gray-300 rounded py-2 mt-2 ml-2">
          <Form.Item
            name="pinCode"
            className="flex-grow"
            rules={[{ required: true, message: "Please input your PIN code!" }]}
          >
            <Input
              ref={searchInputRef}
              className="border-0  w-full focus:outline-none text-base ml-2"
              placeholder="Enter PIN Code"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </Form.Item>
          <button
            type="submit"
            className="text-primary text-lg font-semibold px-4"
          >
            Check
          </button>
        </div>
      </Form>
      {error && <p className="text-red-600 text-base">{errorMessage}</p>}
      {!error && deliveryTime && <p className="text-base">{deliveryTime}</p>}
    </div>
  );
};

export default DeliveryTime;

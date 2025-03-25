import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { API_URL } from "../../../config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DeliveryTime = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [deliveryTime, setDeliveryTime] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkDeliveryTime = async (data) => {
    try {
      const response = await axios.get(`${API_URL}/tracking/estimate/${data.pinCode}`);
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
    <div className="my-5 space-y-3">
      <Label className="text-lg font-semibold text-gray-700">
        Expected Delivery Time
      </Label>
      <form onSubmit={handleSubmit(checkDeliveryTime)} className="flex gap-2 border border-gray-300 rounded-lg p-2">
        <Input
          {...register("pinCode", { required: "Please enter your PIN code!" })}
          type="text"
          placeholder="Enter PIN Code"
          className={cn("flex-grow border-none focus:ring-0", errors.pinCode && "border-red-500")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(checkDeliveryTime)();
            }
          }}
        />
        <Button type="submit" variant="outline" className="bg-primary text-white hover:bg-primary/90">
          Check
        </Button>
      </form>
      {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
      {error && <p className="text-red-500">{errorMessage}</p>}
      {!error && deliveryTime && <p className="text-green-600">{deliveryTime}</p>}
    </div>
  );
};

export default DeliveryTime;
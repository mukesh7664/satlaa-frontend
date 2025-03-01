import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { API_URL } from "../../../config";
import { TextField, Button, Typography } from "@mui/material";

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
    <div className="my-5">
      <Typography variant="h6" className="text-gray-700 font-semibold">
        Expected Delivery Time
      </Typography>
      <form onSubmit={handleSubmit(checkDeliveryTime)} className="mt-2 mb-1">
        <div className="flex border border-gray-300 rounded py-2 px-2">
          <TextField
            {...register("pinCode", { required: "Please enter your PIN code!" })}
            variant="standard"
            fullWidth
            placeholder="Enter PIN Code"
            error={!!errors.pinCode}
            helperText={errors.pinCode?.message}
            className="flex-grow"
            InputProps={{
              disableUnderline: true,  // Removes the underline
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(checkDeliveryTime)();
              }
            }}
          />
          <Button type="submit" color="primary" className="ml-2" sx={{color: "#e76e81"}}>
            Check
          </Button>
        </div>
      </form>
      {error && <Typography color="error">{errorMessage}</Typography>}
      {!error && deliveryTime && <Typography>{deliveryTime}</Typography>}
    </div>
  );
};

export default DeliveryTime;
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../config";

const formSchema = z.object({
  name: z.string().min(1, "Missing Name"),
  phone: z.string().min(1, "Missing phone number"),
  address: z.string().min(1, "Missing Address"),
  pin_code: z.string().min(6, "Invalid Pincode").max(6, "Invalid Pincode"),
  district: z.string().min(1, "Missing District"),
  state: z.string().min(1, "Please select your state!"),
  alternate_phone: z.string().optional()
});

const AddressForm = ({ initialValues = {}, onSubmitAddress, states, handleCancel }) => {
  const onPincodeChange = async (e, setFieldValue) => {
    const pincode = e.target.value.trim();
    if (pincode.length === 6) {
      try {
        const response = await axios.get(`${API_URL}/pincode/${pincode}`);
        const data = response.data;
        setFieldValue("district", data.districtname);
        setFieldValue("state", data.statename);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  });

  const onPincodeInputChange = async (value) => {
    if (value.length === 6) {
      try {
        const response = await axios.get(`${API_URL}/pincode/${value}`);
        const data = response.data;
        form.setValue("district", data.districtname);
        form.setValue("state", data.statename);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmitAddress)} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input
            {...form.register("name")}
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
          )}
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                type="number"
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500" : ""}
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium">Address (Area and Street)</label>
              <Textarea
                {...form.register("address")}
                className={form.formState.errors.address ? "border-red-500" : ""}
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Pincode</label>
              <Input
                type="text"
                {...form.register("pin_code", {
                  onChange: (e) => onPincodeInputChange(e.target.value)
                })}
                className={form.formState.errors.pin_code ? "border-red-500" : ""}
              />
              {form.formState.errors.pin_code && (
                <p className="text-red-500 text-sm">{form.formState.errors.pin_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">District</label>
              <Input
                {...form.register("district")}
                className={form.formState.errors.district ? "border-red-500" : ""}
              />
              {form.formState.errors.district && (
                <p className="text-red-500 text-sm">{form.formState.errors.district.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">State</label>
              <Select
                onValueChange={(value) => form.setValue("state", value)}
                value={form.watch("state")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm">{form.formState.errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Alternate Number (Optional)</label>
              <Input
                type="number"
                {...form.register("alternate_phone")}
                className={form.formState.errors.alternate_phone ? "border-red-500" : ""}
              />
              {form.formState.errors.alternate_phone && (
                <p className="text-red-500 text-sm">{form.formState.errors.alternate_phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="submit" className="w-3/4">
              Save Address
            </Button>
            <Button variant="outline" onClick={handleCancel} className="w-1/4 text-red-500">
              Cancel
            </Button>
          </div>
    </form>
  );
};

export default AddressForm;
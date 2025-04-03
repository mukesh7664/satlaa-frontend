import React from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Yup from "yup";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../config";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Missing Name"),
  phone: Yup.string().required("Missing phone number"),
  address: Yup.string().required("Missing Address"),
  pin_code: Yup.number().min(6).required("Missing Pincode"),
  district: Yup.string().required("Missing District"),
  state: Yup.string().required("Please select your state!"),
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

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmitAddress}>
      {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => (
        <Form className="space-y-4 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && errors.name ? "border-red-500" : ""}
              />
              {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                name="phone"
                type="number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? "border-red-500" : ""}
              />
              {touched.phone && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium">Address (Area and Street)</label>
              <Textarea
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.address && errors.address ? "border-red-500" : ""}
              />
              {touched.address && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Pincode</label>
              <Input
                name="pin_code"
                type="number"
                value={values.pin_code}
                onChange={(e) => {
                  handleChange(e);
                  onPincodeChange(e, setFieldValue);
                }}
                onBlur={handleBlur}
                className={touched.pin_code && errors.pin_code ? "border-red-500" : ""}
              />
              {touched.pin_code && errors.pin_code && <p className="text-red-500 text-sm">{errors.pin_code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">District</label>
              <Input
                name="district"
                value={values.district}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.district && errors.district ? "border-red-500" : ""}
              />
              {touched.district && errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">State</label>
              <Select
                value={values.state}
                onValueChange={(value) => setFieldValue("state", value)}
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
              {touched.state && errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Alternate Number (Optional)</label>
              <Input
                name="alternate_phone"
                type="number"
                value={values.alternate_phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.alternate_phone && errors.alternate_phone ? "border-red-500" : ""}
              />
              {touched.alternate_phone && errors.alternate_phone && (
                <p className="text-red-500 text-sm">{errors.alternate_phone}</p>
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
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Row, Col } from "antd";
import * as Yup from "yup";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../../config";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Missing Name"),
  phone: Yup.string().required("Missing phone number"),
  address: Yup.string().required("Missing Address"),
  pin_code: Yup.number().min(6).required("Missing Pincode"),
  district: Yup.string().required("Missing District"),
  state: Yup.string().required("Please select your state!")
});

const AddressForm = ({
  initialValues = {},
  onSubmitAddress,
  states,
  handleCancel,
  setEditing
}) => {
  const onPincodeChange = async (e, setFieldValue) => {
    const pincode = e.target.value.trim();

    if (pincode.length === 6) {
      try {
        const response = await axios.get(`${API_URL}/pincode/${pincode}`);
        const data = response.data;
        setFieldValue("district", data.districtname); // Update district field
        setFieldValue("state", data.statename);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitAddress}
    >
      {({
        errors,
        touched,
        values,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form className="p-4 flex flex-wrap gap-y-2 ">
          <div className="relative w-full md:w-1/2 px-1">
            <Field
              type="text"
              name="name"
              id="floating_filled_name"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_filled_name"
              className="form-input-lable-new"
            >
              Name
            </label>
            {errors.name && touched.name && (
              <div className="text-red-400">{errors.name}</div>
            )}
          </div>

          <div className="relative w-full md:w-1/2 px-1">
            <Field
              type="number"
              name="phone"
              id="floating_filled_phone"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_filled_phone"
              className="form-input-lable-new"
            >
              Number
            </label>
            {errors.phone && touched.phone && (
              <div className="text-red-400">{errors.phone}</div>
            )}
          </div>

          <div className="relative w-full px-1">
            <Field
              as="textarea"
              rows={2}
              name="address"
              id="floating_filled_address"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="off"
              value={values.address}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_filled_address"
              className="form-input-lable-new"
            >
              Address (Area and Street)
            </label>
            {errors.address && touched.address && (
              <div className="text-red-400">{errors.address}</div>
            )}
          </div>

          <div className="relative w-full md:w-1/2 px-1">
            <Field
              type="number"
              name="pin_code"
              id="floating_filled_pincode"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="postal-code"
              value={values.pin_code}
              onChange={(e) => {
                handleChange(e); // This will handle Formik's handleChange
                onPincodeChange(e, setFieldValue); // This is your custom onChange
              }}
            />
            <label
              htmlFor="floating_filled_pincode"
              className="form-input-lable-new"
            >
              Pincode
            </label>
            {errors.pin_code && touched.pin_code && (
              <div className="text-red-400">{errors.pin_code}</div>
            )}
          </div>

          <div className="relative w-1/2 px-1">
            <Field
              type="text"
              name="district"
              id="floating_filled_district"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="off"
              value={values.district}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_filled_district"
              className="form-input-lable-new"
            >
              District
            </label>
            {errors.district && touched.district && (
              <div className="text-red-400">{errors.district}</div>
            )}
          </div>

          <div className="relative w-1/2 px-1">
            <Field
              as="select"
              name="state"
              id="floating_filled_state"
              className="form-input-new peer"
              value={values.state}
              onChange={handleChange}
            >
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Field>
            <label
              htmlFor="floating_filled_state"
              className="form-input-lable-new"
            >
              State
            </label>
            {errors.state && touched.state && (
              <div className="text-red-400">{errors.state}</div>
            )}
          </div>

          <div className="relative w-full md:w-1/2 px-1">
            <Field
              type="number"
              name="alternate_phone"
              id="floating_filled_alternate"
              className="form-input-new peer"
              placeholder=" "
              autoComplete="off"
              value={values.alternate_phone}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_filled_alternate"
              className="form-input-lable-new"
            >
              Alternate Number(Optional)
            </label>
            {errors.alternate_phone && touched.alternate_phone && (
              <div className="text-red-400">{errors.alternate_phone}</div>
            )}
          </div>

          <div className="flex flex-wrap mt-2">
            <button
              type="submit"
              className="py-3 w-7/12 px-4 md:px-6 h-auto bg-secondary text-white border text-base rounded"
            >
              Save Address
            </button>

            <button
              onClick={handleCancel}
              className="w-5/12 font-semibold md:py-3 px-6 text-base h-auto text-red-700  rounded text-left"
            >
              CANCEL
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;

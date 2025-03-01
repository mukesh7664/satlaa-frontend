import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, MenuItem, Button, Box, Typography, Grid } from "@mui/material";
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
        <Form>
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (Area and Street)"
                  name="address"
                  multiline
                  rows={2}
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pin_code"
                  type="number"
                  value={values.pin_code}
                  onChange={(e) => {
                    handleChange(e);
                    onPincodeChange(e, setFieldValue);
                  }}
                  onBlur={handleBlur}
                  error={touched.pin_code && Boolean(errors.pin_code)}
                  helperText={touched.pin_code && errors.pin_code}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  name="district"
                  value={values.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.district && Boolean(errors.district)}
                  helperText={touched.district && errors.district}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.state && Boolean(errors.state)}
                  helperText={touched.state && errors.state}
                >
                  {states.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alternate Number (Optional)"
                  name="alternate_phone"
                  type="number"
                  value={values.alternate_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.alternate_phone && Boolean(errors.alternate_phone)}
                  helperText={touched.alternate_phone && errors.alternate_phone}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary" sx={{ width: "70%" }}>
                  Save Address
                </Button>
                <Button onClick={handleCancel} variant="text" color="error" sx={{ width: "30%" }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Select, MenuItem, Divider } from "@mui/material";

const Default = ({ onSubmitSignup }) => {
   const { control, handleSubmit, watch, getValues, formState: { errors } } = useForm({
      defaultValues: {
         email: "",
         password: "",
         confirm: "",
         name: "",
         phone: "",
         prefix: "91",
      },
   });

   const [prefix, setPrefix] = useState("91");

   const handlePrefixChange = (event) => {
      setPrefix(event.target.value);
   };

   return (
      <form onSubmit={handleSubmit(onSubmitSignup)} noValidate>
         {/* Email */}
         <Controller
            name="email"
            control={control}
            rules={{
               required: "Email is required",
               pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
               },
            }}
            render={({ field }) => (
               <TextField
                  {...field}
                  label="E-mail"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
               />
            )}
         />
         {/* Password */}
         <Controller
            name="password"
            control={control}
            rules={{
               required: "Password is required",
               minLength: { value: 6, message: "Password must be at least 6 characters" },
            }}
            render={({ field }) => (
               <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
               />
            )}
         />
         {/* Confirm Password */}
         <Controller
            name="confirm"
            control={control}
            rules={{
               required: "Confirm your password",
               validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
            }}
            render={({ field }) => (
               <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirm}
                  helperText={errors.confirm ? errors.confirm.message : ""}
               />
            )}
         />
         {/* Name */}
         <Controller
            name="name"
            control={control}
            rules={{
               required: "Name is required",
            }}
            render={({ field }) => (
               <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
               />
            )}
         />
         {/* Phone with Prefix */}
         <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem" }}>
            {/* Country Code Select */}
            <Controller
               name="prefix"
               control={control}
               render={({ field }) => (
                  <Select {...field} value={prefix} onChange={(e) => {
                     field.onChange(e);
                     handlePrefixChange(e);
                  }}>
                     <MenuItem value="91">+91</MenuItem>
                     <MenuItem value="1">+1</MenuItem>
                  </Select>
               )}
            />

            {/* Phone Number Input */}
            <Controller
               name="phone"
               control={control}
               rules={{
                  required: "Phone number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
               }}
               render={({ field }) => (
                  <TextField
                     {...field}
                     label="Phone"
                     fullWidth
                     margin="normal"
                     error={!!errors.phone}
                     helperText={errors.phone ? errors.phone.message : ""}
                  />
               )}
            />
         </div>
         <Divider sx={{ my: 2 }} />
         {/* Submit Button */}
         <Button type="submit" variant="contained" fullWidth>
            Save
         </Button>
      </form>
   );
};

export default Default;
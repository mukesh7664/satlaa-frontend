import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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

   return (
      <Card className="p-6 space-y-4">
         <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-4">
            {/* Email */}
            <div>
               <Label>Email</Label>
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
                  render={({ field }) => <Input {...field} type="email" placeholder="Enter your email" />}
               />
               {errors.email && <Alert>{errors.email.message}</Alert>}
            </div>

            {/* Password */}
            <div>
               <Label>Password</Label>
               <Controller
                  name="password"
                  control={control}
                  rules={{
                     required: "Password is required",
                     minLength: { value: 6, message: "Password must be at least 6 characters" },
                  }}
                  render={({ field }) => <Input {...field} type="password" placeholder="Enter your password" />}
               />
               {errors.password && <Alert>{errors.password.message}</Alert>}
            </div>

            {/* Confirm Password */}
            <div>
               <Label>Confirm Password</Label>
               <Controller
                  name="confirm"
                  control={control}
                  rules={{
                     required: "Confirm your password",
                     validate: (value) =>
                        value === getValues("password") || "Passwords do not match",
                  }}
                  render={({ field }) => <Input {...field} type="password" placeholder="Confirm password" />}
               />
               {errors.confirm && <Alert>{errors.confirm.message}</Alert>}
            </div>

            {/* Name */}
            <div>
               <Label>Name</Label>
               <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => <Input {...field} placeholder="Enter your name" />}
               />
               {errors.name && <Alert>{errors.name.message}</Alert>}
            </div>

            {/* Phone with Prefix */}
            <div className="flex gap-4">
               {/* Country Code Select */}
               <div className="w-1/3">
                  <Label>Country Code</Label>
                  <Controller
                     name="prefix"
                     control={control}
                     render={({ field }) => (
                        <Select {...field} onValueChange={(val) => { field.onChange(val); setPrefix(val); }}>
                           <SelectTrigger>
                              <SelectValue placeholder="+91" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="91">+91</SelectItem>
                              <SelectItem value="1">+1</SelectItem>
                           </SelectContent>
                        </Select>
                     )}
                  />
               </div>

               {/* Phone Number Input */}
               <div className="w-2/3">
                  <Label>Phone</Label>
                  <Controller
                     name="phone"
                     control={control}
                     rules={{
                        required: "Phone number is required",
                        pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                     }}
                     render={({ field }) => <Input {...field} placeholder="Enter your phone number" />}
                  />
                  {errors.phone && <Alert>{errors.phone.message}</Alert>}
               </div>
            </div>

            <Separator className="my-2" />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
               Save
            </Button>
         </form>
      </Card>
   );
};

export default Default;
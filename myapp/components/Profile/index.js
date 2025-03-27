"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import AuthService from "../../../util/services/authservice";
import { removeCookies } from "cookies-next";
import axiosInstance from "@/util/axios";
import { setIsAuthenticated, setLogout } from "../../../redux/reducers/Login";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const axios = axiosInstance();

const ProfileForm = () => {
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const dispatch = useDispatch();
  const router = useRouter();
  const [state, setState] = useState(user || {});

  const formMethods = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
      prefix: user?.prefix || "91",
    },
  });

  const { handleSubmit, control, reset } = formMethods;

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
        const data = res.data;
        data.password = "";
        setState(data);
        reset(data);
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/customers/${state._id}`, data);
      if (res.data.variant === "error") {
        toast.error(`Not Updated: ${res.data.message}`);
      } else {
        toast.success("Information Updated");
        setState(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full grid grid-cols-12 gap-0 sm:gap-10 p-0 m-0 w-full my-10">
      <div className="col-span-12 lg:col-span-6">
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField name="email">
              {(field) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" required {...field} />
                  </FormControl>
                </FormItem>
              )}
            </FormField>

            <FormField name="name">
              {(field) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                </FormItem>
              )}
            </FormField>

            <Separator className="my-4" />

            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ProfileForm;
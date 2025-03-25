import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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

const Default = () => {
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [fieldsUser, setFieldsUser] = useState(
    Object.entries(user).map(([name, value]) => ({ name, value }))
  );
  const [state, setState] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  function getDataFc() {
    if (user.id) {
      axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
        const data = res.data;
        data["password"] = "";
        setState(data);
        setFieldsUser(
          Object.entries(data).map(([name, value]) => ({ name, value }))
        );
      });
    }
  }

  useEffect(() => {
    getDataFc();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/customers/${state._id}`, data);
      if (res.data.variant === "error") {
        toast.error(`Not Updated: ${res.data.message}`);
      } else {
        toast.success("Information Updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePrefix = (selected) => {
    setState({
      ...state,
      prefix: selected,
    });
  };

  return (
    <div className="h-full grid grid-cols-12 gap-0 sm:gap-10 p-0 m-0 w-full my-10">
      <div className="col-span-12 lg:col-span-6">
        <Form onSubmit={onSubmit} className="w-full">
          <FormField name="email">
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" required />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="phone">
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <div className="flex gap-2">
                <Select defaultValue="91" onValueChange={changePrefix} disabled>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="+91" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <FormControl>
                  <Input required disabled />
                </FormControl>
              </div>
            </FormItem>
          </FormField>

          <Separator className="my-4" />

          <Button type="submit" className="w-full">
            Update
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={async () => {
              await AuthService.logout();
              await dispatch(setLogout());
              await dispatch(setIsAuthenticated(false));
              removeCookies("token");
              router.refresh();
              router.push("/");
            }}
          >
            Logout
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Default;
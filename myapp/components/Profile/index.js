import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Divider } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../../config";
import AuthService from "../../../util/services/authservice";
import { removeCookies, setCookie } from "cookies-next";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import {
  setIsAuthenticated,
  setLogout,
} from "../../../redux/reducers/Login";
import router from "next/router";
const Defaut = () => {
  const [form] = Form.useForm();
  const { isAuthenticated } = useSelector(({ login }) => login);
  const { user } = useSelector(({ login }) => login);
  const [fieldsUser, seTfieldsUser] = useState(
    Object.entries(user).map(([name, value]) => ({ name, value }))
  );
  const [state, seTstate] = useState([]);
  const dispatch = useDispatch();
  function getDataFc() {
    if (user.id) {
      axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
        const data = res.data;
        data["password"] = "";
        seTstate(data);
        seTfieldsUser(
          Object.entries(data).map(([name, value]) => ({ name, value }))
        );
      });
    }
  }
  useEffect(() => {
    getDataFc();
  }, [user]);

  const onSubmit = (Data) => {
    axios
      .post(`${API_URL}/customers/${state._id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            "Not Updated" + res.data.messagge
          );
        } else {
          message.success("Information Updated");
        }
      })
      .catch((err) => console.log(err));
  };

  const changePrefix = (selected) => {
    seTstate({
      ...state,
      prefix: selected,
    });
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue={"91"}>
      <Select onChange={changePrefix} disabled style={{ width: 70 }}>
        <Select.Option value="91">+91</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <div className="  h-full grid grid-cols-12 gap-0 sm:gap-10 p-0 m-0 w-full my-10 ">
        <div className=" col-span-12 lg:col-span-6 ">
          <Form
            onFinish={onSubmit}
            layout="vertical"
            form={form}
            fields={fieldsUser}
            className="w-full"
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Input is not valid",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please fill this input.",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
           
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: "Please fill this input.",
                },
              ]}
            >
              <Input addonBefore={prefixSelector} disabled />
            </Form.Item>

            <Divider />
            <Form.Item>
              <Button type="default" className="w-full" htmlType="submit">
                Update
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                className="w-full mt-2"
                onClick={async () => {
                  await AuthService.logout();
                  await dispatch(setLogout());
                  await dispatch(setIsAuthenticated(false));
                  removeCookies("token");
                  router.reload();
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Defaut;

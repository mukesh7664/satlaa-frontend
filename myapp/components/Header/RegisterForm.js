import { useState } from "react";
import { Input, Form, Button, Select, Divider } from "antd";


const Default = ({ onSubmitSignup }) => {
   
   const [form] = Form.useForm();
   const [state, seTstate] = useState();
   const changePrefix = (selected) => {
      seTstate({
         ...state,
         prefix: selected,
      });
   };

   const prefixSelector = (
      <Form.Item name="prefix" noStyle initialValue={"91"}>
         <Select onChange={changePrefix} style={{ width: 70 }}>
            <Select.Option value="91">+91</Select.Option>
            <Select.Option value="1">+1</Select.Option>
         </Select>
      </Form.Item>
   );

   return (
      <>
         <Form onFinish={onSubmitSignup} layout="vertical" form={form}>
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
               name="password"
               label="Password"
               rules={[
                  {
                     message: "Input is not valid",
                  },
               ]}
               hasFeedback
            >
               <Input.Password />
            </Form.Item>
            <Form.Item
               name="confirm"
               label="Confirm Password"
               dependencies={["password"]}
               hasFeedback
               rules={[
                  {
                     message: "Input is not valid",
                  },
                  ({ getFieldValue }) => ({
                     validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                           return Promise.resolve();
                        }
                        return Promise.reject(
                           "Password Not Match"
                        );
                     },
                  }),
               ]}
            >
               <Input.Password />
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
               <Input addonBefore={prefixSelector} />
            </Form.Item>

            <Divider />
            <Form.Item>
               <Button type="default" className="w-full" htmlType="submit">
                 Save
               </Button>
            </Form.Item>
         </Form>
      </>
   );
};

export default Default;

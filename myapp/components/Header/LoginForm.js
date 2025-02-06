import { useEffect, useState } from "react";
import { Input, Form, Button, message, Select, Col, Row } from "antd";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setCookie } from "cookies-next";
import AuthService from "../../../util/services/authservice";
import {
  setLogin,
  setIsAuthenticated,
  setLogout,
} from "../../../redux/reducers/Login";
import { getCookie } from "cookies-next";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import TagManager from "react-gtm-module";
const Default = ({ onSuccessfulLogin, handleCancelLogin }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(false); // New state variable for loader
  const [gender, setGender] = useState("");
  const dispatch = useDispatch();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [showResendButton, setShowResendButton] = useState(false);
  const utmParams = getCookie("utm_params");
  const onSubmitPhoneForm = async (data) => {
    setLoading(true);
    AuthService.sendOTP(data).then((response) => {
      setLoading(false);
      if (response) {
        if (response.isRegistered === false) {
          setPhoneNumber(data.phone);
          setIsRegistered(false);
        } else {
          setPhoneNumber(data.phone);
          setStep(1);
        }
      } else {
        message.error("Failed to send OTP");
      }
    });
  };

  const setupTimer = () => {
    setResendTimer(30); // Reset timer to 5 seconds
    const timer = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timer);
          setShowResendButton(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    return setupTimer();
  }, [showResendButton]);

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await AuthService.sendOTP({ phone: phoneNumber });
      setLoading(false);
      if (response) {
        message.success("OTP resent successfully");
        setShowResendButton(false); // Hide the button
        setupTimer(); // Restart the timer
      } else {
        message.error("Failed to resend OTP");
      }
    } catch (error) {
      setLoading(false);
      message.error("Error occurred while resending OTP");
    }
  };

  const onSubmitRegistrationForm = async (data) => {
    data.phone = phoneNumber;
    data.name = first_name;
    data.last_name = last_name;
    data.email = email;
    data.gender = gender;
    data.utm = "";
    if (utmParams) {
      data.utm = utmParams;
    }
    setLoading(true);
    try {
      const response = await AuthService.registerUser(data);
      // Assume register is a method in AuthService to handle registration
      setLoading(false);
      let userInfo = {
        user_name: first_name, // Assume user.name is always available
        user_phone: "+91" + phoneNumber, // Assume user.phone is always available
      };
      if (last_name) {
        userInfo.user_last_name = last_name;
      }
      if (email) {
        userInfo.user_email = email;
      }

      const gtm_data = {
        event: "usersignup",
        user_info: userInfo,
        signup_method: "phone",
        source: utmParams?.utm_source ? utmParams.utm_source : "direct", // Replace 'direct' with the actual traffic source
        campaign: utmParams?.utm_campaign ? utmParams.utm_campaign : "",
        content: utmParams?.utm_content ? utmParams.utm_campaign : "",
        fbclid: utmParams?.fbclid ? utmParams.fbclid : "",
        user_id: response.user.user_id, // Replace with the relevant campaign name
        user_phone: "+91" + phoneNumber, // User's phone number
      };
      TagManager.dataLayer({ dataLayer: null });
      TagManager.dataLayer({ dataLayer: gtm_data });
      setIsRegistered(true);
      // Assume the server returns { success: true } on successful registration
      setStep(1); // Proceed to OTP verification step
    } catch (error) {
      setLoading(false);
      message.error("Registration failed");
    }
  };

  const onSubmitOTPForm = async (data) => {
    data["phone"] = phoneNumber;
    AuthService.verifyOTP(data).then(async (response) => {
      const { isAuthenticated, user, token, userCart } = response;
      if (isAuthenticated) {
        await dispatch(setLogin(user));
        await dispatch(setIsAuthenticated(true));
        setCookie("token", token, {
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 24 * 60,
        });
        setStep(0);
        onSuccessfulLogin(user, userCart);
        handleCancelLogin();
        // router.reload();
      } else {
        message.error("Invalid or expired OTP");
      }
    });
  };
  const handleChangeNumber = () => {
    setStep(0); // Reset to step 0 to show number form again
    setShowResendButton(false); // Hide resend button
  };
  const numberForm = () => {
    return (
      <Form onFinish={onSubmitPhoneForm} layout="vertical" form={form}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
            {
              max: 10,
              message: "Number must be 10 characters long",
            },
            {
              min: 10,
              message: "Number must be 10 characters long",
            },
          ]}
          name="phone"
          label={
            <p className="text-base font-Montserrat">Enter Mobile Number</p>
          }
        >
          <Input
            size="large"
            type="number"
            inputMode="numeric"
            className="mt-4"
            maxLength={10}
            minLength={10}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            className="mb-0 mt-2 w-full bg-primary text-white"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const otpForm = () => {
    return (
      <Form onFinish={onSubmitOTPForm} layout="vertical" form={form}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input the OTP!",
            },
          ]}
          name="otp"
          label={<p>Please enter the OTP send to {phoneNumber}</p>}
        >
          <Input
            size="large"
            type="number"
            inputMode="numeric"
            className="mt-4"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center">
            <Button type="link" onClick={handleChangeNumber}>
              Change No.
            </Button>
            {showResendButton ? (
              <Button onClick={handleResendOTP} type="link">
                Resend OTP
              </Button>
            ) : (
              <p>Resend in {resendTimer} seconds</p>
            )}
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            className="mb-0 w-full mt-2 bg-primary text-white"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const registerForm = () => {
    return (
      <Form onFinish={onSubmitRegistrationForm} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: "Please input your first name" },
              ]}
            >
              <Input
                size="large"
                onChange={(e) => setFirst_name(e.target.value)}
                autoComplete="given-name"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input
                size="large"
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Select size="large" onChange={(value) => setGender(value)}>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            type="email"
            size="large"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            className="mb-0 w-full mt-2"
            size="large"
            htmlType="submit"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  };
  return (
    <div className="mb-5">
      {isRegistered === false
        ? registerForm()
        : step === 0
        ? numberForm()
        : otpForm()}
      <div className="mt-4">
        By continuing, you agree to our
        <Link
          href="/pages/terms-conditions"
          className="text-blue-500 hover:text-blue-700"
        >
          &nbsp;Terms of Use&nbsp;
        </Link>
        and
        <Link
          href="/pages/privacy-policy"
          className="text-blue-500 hover:text-blue-700"
        >
          &nbsp;Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};

export default Default;

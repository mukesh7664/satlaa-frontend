import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCookie, getCookie } from "cookies-next";
import { FaCheck } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import AuthService from "../../../util/services/authservice";
import { setLogin, setIsAuthenticated } from "../../../redux/reducers/Login";
import TagManager from "react-gtm-module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

const Default = ({ onSuccessfulLogin, handleCancelLogin }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      phone: "",
      otp: "",
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
    },
  });

  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [showResendButton, setShowResendButton] = useState(false);
  const dispatch = useDispatch();
  const utmParams = getCookie("utm_params");

  const onSubmitPhoneForm = async (data) => {
    setLoading(true);
    try {
      const response = await AuthService.sendOTP(data);
      setLoading(false);
      if (response) {
        setPhoneNumber(data.phone);
        setIsRegistered(response.isRegistered);
        setStep(response.isRegistered ? 1 : 0);
      } else {
        alert("Failed to send OTP");
      }
    } catch {
      setLoading(false);
      alert("Error sending OTP");
    }
  };

  const setupTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResendButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (showResendButton) setupTimer();
  }, [showResendButton]);

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await AuthService.sendOTP({ phone: phoneNumber });
      setLoading(false);
      if (response) {
        alert("OTP resent successfully");
        setShowResendButton(false);
        setupTimer();
      } else {
        alert("Failed to resend OTP");
      }
    } catch {
      setLoading(false);
      alert("Error occurred while resending OTP");
    }
  };

  const onSubmitOTPForm = async (data) => {
    data.phone = phoneNumber;
    try {
      const response = await AuthService.verifyOTP(data);
      if (response.isAuthenticated) {
        dispatch(setLogin(response.user));
        dispatch(setIsAuthenticated(true));
        setCookie("token", response.token, { secure: true, sameSite: "none", maxAge: 60 * 60 * 24 * 60 });
        setStep(0);
        onSuccessfulLogin(response.user, response.userCart);
        handleCancelLogin();
      } else {
        alert("Invalid or expired OTP");
      }
    } catch {
      alert("Error verifying OTP");
    }
  };

  const onSubmitRegistrationForm = async (data) => {
    data.phone = phoneNumber;
    data.utm = utmParams || "";
    setLoading(true);
    try {
      const response = await AuthService.registerUser(data);
      setLoading(false);
      TagManager.dataLayer({ dataLayer: { event: "usersignup", user_phone: `+91${phoneNumber}` } });
      setIsRegistered(true);
      setStep(1);
    } catch {
      setLoading(false);
      alert("Registration failed");
    }
  };

  return (
    <Card className="w-full p-6 bg-white relative">
      <button className="absolute top-2 right-2 text-gray-600" onClick={handleCancelLogin}>
      </button>

      {isRegistered === false ? (
        <form onSubmit={handleSubmit(onSubmitRegistrationForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Controller name="first_name" control={control} rules={{ required: "First name required" }}
                render={({ field }) => <Input {...field} placeholder="First Name" />} />
              {errors.first_name && <Alert>{errors.first_name.message}</Alert>}
            </div>
            <div>
              <Label>Last Name</Label>
              <Controller name="last_name" control={control} rules={{ required: "Last name required" }}
                render={({ field }) => <Input {...field} placeholder="Last Name" />} />
              {errors.last_name && <Alert>{errors.last_name.message}</Alert>}
            </div>
          </div>

          <div>
            <Label>Gender</Label>
            <Controller name="gender" control={control} rules={{ required: "Select gender" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Controller name="email" control={control} rules={{ required: "Email required" }}
              render={({ field }) => <Input {...field} type="email" placeholder="Email" />} />
            {errors.email && <Alert>{errors.email.message}</Alert>}
          </div>

          <Button type="submit" className="w-full mt-4 bg-red-500 hover:bg-red-600">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      ) : step === 0 ? (
        <form onSubmit={handleSubmit(onSubmitPhoneForm)} className="space-y-4">
          <Label>Enter Mobile Number</Label>
          <Controller name="phone" control={control} rules={{ required: "Phone number required", minLength: 10, maxLength: 10 }}
            render={({ field }) => <Input {...field} type="tel" placeholder="Phone Number" />} />
          {errors.phone && <Alert>{errors.phone.message}</Alert>}

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
            {loading ? "Loading..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmitOTPForm)} className="space-y-4 text-center">
          <h6 className="text-lg">Enter OTP</h6>
          <p className="text-sm text-gray-600">OTP sent to <strong>{phoneNumber}</strong></p>

          <Controller name="otp" control={control} rules={{ required: "Enter OTP" }}
            render={({ field }) => <Input {...field} type="tel" placeholder="Enter OTP" />} />
          {errors.otp && <Alert>{errors.otp.message}</Alert>}

          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default Default;
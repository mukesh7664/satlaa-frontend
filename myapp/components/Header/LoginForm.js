import { useEffect, useState } from "react";
import { FormControl, Button, Alert, Select, Box, Typography, TextField, Grid, InputLabel, MenuItem, Paper, IconButton } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setCookie, getCookie } from "cookies-next";
import AuthService from "../../../util/services/authservice";
import { setLogin, setIsAuthenticated } from "../../../redux/reducers/Login";
import TagManager from "react-gtm-module";

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
    <Paper sx={{ width: "100%", p: 4, bgcolor: "white", mx: "auto", position: "relative" }}>
      <IconButton onClick={handleCancelLogin} sx={{ position: "absolute", top: 8, right: 8 }}>
        <IoCloseOutline />
      </IconButton>

      {isRegistered === false ? (
        <Box component="form" onSubmit={handleSubmit(onSubmitRegistrationForm)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="first_name" control={control} rules={{ required: "First name required" }}
                render={({ field }) => <TextField {...field} label="First Name" fullWidth margin="normal" error={!!errors.first_name} helperText={errors.first_name?.message} />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="last_name" control={control} rules={{ required: "Last name required" }}
                render={({ field }) => <TextField {...field} label="Last Name" fullWidth margin="normal" error={!!errors.last_name} helperText={errors.last_name?.message} />} />
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Controller name="gender" control={control} rules={{ required: "Select gender" }}
              render={({ field }) => <Select {...field} label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>} />
          </FormControl>

          <Controller name="email" control={control} rules={{ required: "Email required" }}
            render={({ field }) => <TextField {...field} label="Email" fullWidth margin="normal" type="email" error={!!errors.email} helperText={errors.email?.message} />} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: "#e76e81" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
      ) : step === 0 ? (
        <Box component="form" onSubmit={handleSubmit(onSubmitPhoneForm)} noValidate>
          <Typography variant="body1" gutterBottom>Enter Mobile Number</Typography>
          <Controller name="phone" control={control} rules={{ required: "Phone number required", minLength: 10, maxLength: 10 }}
            render={({ field }) => <TextField {...field} fullWidth margin="normal" type="tel" error={!!errors.phone} helperText={errors.phone?.message} />} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: "#e76e81" }} disabled={loading}>
            {loading ? "Loading..." : "Send OTP"}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmitOTPForm)} noValidate>
          <Typography variant="h6" gutterBottom textAlign="center">Enter OTP</Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" gutterBottom>
            OTP sent to <strong>{phoneNumber}</strong>
          </Typography>

          <Controller name="otp" control={control} rules={{ required: "Enter OTP" }}
            render={({ field }) => <TextField {...field} label="OTP" fullWidth margin="normal" type="tel" error={!!errors.otp} helperText={errors.otp?.message} />} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontWeight: "bold" }} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Default;
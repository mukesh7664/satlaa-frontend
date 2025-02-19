import { useEffect, useState } from "react";
import { FormControl, Button, Alert, Select, Box, Typography, TextField, Grid, InputLabel, MenuItem, Paper, IconButton, Dialog } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setCookie } from "cookies-next";
import AuthService from "../../../util/services/authservice";
import { setLogin, setIsAuthenticated, setLogout } from "../../../redux/reducers/Login";
import { getCookie } from "cookies-next";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import TagManager from "react-gtm-module";

const Default = ({ onSuccessfulLogin, handleCancelLogin }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setResendTimer(30);
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
        setShowResendButton(false);
        setupTimer();
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
      setLoading(false);
      let userInfo = {
        user_name: first_name,
        user_phone: "+91" + phoneNumber,
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
        source: utmParams?.utm_source ? utmParams.utm_source : "direct",
        campaign: utmParams?.utm_campaign ? utmParams.utm_campaign : "",
        content: utmParams?.utm_content ? utmParams.utm_campaign : "",
        fbclid: utmParams?.fbclid ? utmParams.fbclid : "",
        user_id: response.user.user_id,
        user_phone: "+91" + phoneNumber,
      };
      TagManager.dataLayer({ dataLayer: null });
      TagManager.dataLayer({ dataLayer: gtm_data });
      setIsRegistered(true);
      setStep(1);
    } catch (error) {
      setLoading(false);
      <Alert icon={<FaCheck fontSize="inherit" />} severity="failed">
        Registration failed
      </Alert>
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
      } else {
        <Alert icon={<FaCheck fontSize="inherit" />} severity="failed">
          Invalid or expired OTP
        </Alert>
      }
    });
  };

  const handleChangeNumber = () => {
    setStep(0);
    setShowResendButton(false);
  };

  const numberForm = () => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
      setLoading(true);
      await onSubmitPhoneForm(data);
      setLoading(false);
    };

    return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="body1" fontFamily="Montserrat" gutterBottom>
          Enter Mobile Number
        </Typography>

        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Please input your phone number!",
            minLength: { value: 10, message: "Number must be 10 characters long" },
            maxLength: { value: 10, message: "Number must be 10 characters long" },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              variant="outlined"
              size="large"
              type="tel"
              inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#e76e81", color: "white" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Send OTP"}
        </Button>
      </Box>
    );
  };

  const otpForm = ({ phoneNumber, showResendButton, resendTimer }) => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
      setLoading(true);
      await onSubmitOTPForm(data);
      setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography variant="h6" gutterBottom textAlign="center">
            Enter OTP
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" gutterBottom>
            Please enter the OTP sent to <strong>{phoneNumber}</strong>
          </Typography>

          <Controller
            name="otp"
            control={control}
            rules={{ required: "Please input the OTP!" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="OTP"
                fullWidth
                margin="normal"
                variant="outlined"
                type="tel"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button onClick={handleChangeNumber} variant="text" color="primary">
              Change No.
            </Button>
            {showResendButton ? (
              <Button onClick={handleResendOTP} variant="text" color="primary">
                Resend OTP
              </Button>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Resend in {resendTimer} seconds
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-primary"
            sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Box>
    );
  };

  const registerForm = () => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
      setLoading(true);
      await onSubmitRegistrationForm(data);
      setLoading(false);
    };

    return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="first_name"
              control={control}
              rules={{ required: "Please input your first name" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="large"
                  autoComplete="given-name"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={control}
              rules={{ required: "Please input your last name" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="large"
                  autoComplete="family-name"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>
        </Grid>

        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Gender</InputLabel>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Please select your gender!" }}
            render={({ field }) => (
              <Select {...field} label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="email"
          control={control}
          rules={{ required: "Please enter your email" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              size="large"
              type="email"
              autoComplete="email"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2,background: "#e76e81" }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Box>
    );
  };

  return (
      <Paper
        sx={{
          boxShadow: "none",
          width: "100%",
          p: 4,
          bgcolor: "white",
          mx: "auto",
          position: "relative",
          transition: "all 1s ease"
        }}
      >
        <IconButton
          onClick={handleCancelLogin}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <IoCloseOutline />
        </IconButton>

        {isRegistered === false ? registerForm() : step === 0 ? numberForm() : otpForm({ phoneNumber, showResendButton, resendTimer })}

        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          By continuing, you agree to our
          <Link href="/pages/terms-conditions" sx={{ color: "primary.main", mx: 0.5 }}>
            Terms of Use
          </Link>
          and
          <Link href="/pages/privacy-policy" sx={{ color: "primary.main", mx: 0.5 }}>
            Privacy Policy
          </Link>.
        </Typography>
      </Paper>
  );
};

export default Default;
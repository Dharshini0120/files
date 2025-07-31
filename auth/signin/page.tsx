"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface FormState {
  email: string;
  password: string;
}
interface FormErrors {
  email: string;
  password: string;
}

const App = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" });
const existingEmails = ["test@gmail.com", "admin@example.com"]; // mock existing emails

const validateEmail = (email: string): string => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  if (existingEmails.includes(email)) return "This email is already registered";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

// Validate single field onBlur
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  let fieldError = "";
  if (name === "email") fieldError = validateEmail(value);
  if (name === "password") fieldError = validatePassword(value);
  setErrors((prev) => ({ ...prev, [name]: fieldError }));
};

// Update form values without triggering validation
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

// Final validation on submit
const validateForm = (): boolean => {
  const emailError = validateEmail(form.email);
  const passwordError = validatePassword(form.password);
  setErrors({ email: emailError, password: passwordError });
  return !emailError && !passwordError;
};

const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (validateForm()) {
    console.log("Form submitted:", form);
    // API call or further action here
  }
};
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      className={`${inter.className}`}
      minHeight="100vh"
      display="flex"
      position="relative"
      bgcolor="#fff"
    >
      {/* LEFT BACKGROUND IMAGE (faded) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/login_bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
          zIndex: 0,
        }}
      />

      {/* LEFT SIDE - FORM */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        px={{ xs: 4, md: 16 }}
        py={6}
        position="relative"
        zIndex={1}
      >
        {/* LOGO */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Image
            src="/medical-logo.png"
            alt="Company Logo"
            width={160}
            height={160}
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* FORM SECTION */}
        <Box maxWidth="md" mx="auto" width="100%">
          <Box mb={6} textAlign="center">
            <Typography variant="h5" fontWeight={700} fontSize={28} color="#3D3D3D">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Please enter your details to continue
            </Typography>
          </Box>

          {/* TABS */}
          <Box
            position="relative"
            display="flex"
            width="100%"
            maxWidth={500}
            mb={6}
            mx="auto"
            borderRadius={2}
            bgcolor="#f3f4f6"
            p={1}
          >
            <Box
              position="absolute"
              top={8}
              left={tab === 0 ? 8 : "50%"}
              width="calc(50% - 8px)"
              height="calc(100% - 16px)"
              borderRadius={2}
              bgcolor="#fff"
              boxShadow={1}
              zIndex={1}
              sx={{ transition: "left 0.3s cubic-bezier(.4,1.3,.6,1)" }}
            />
            <Button
              onClick={() => {
                setTab(0);
                router.push("/auth/signin");
              }}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: tab === 0 ? 700 : 500,
                fontSize: "1rem",
                zIndex: 2,
                color: tab === 0 ? "#000" : "#9ca3af",
                textTransform: "none",
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setTab(1);
                router.push("/auth/signup");
              }}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: tab === 1 ? 700 : 500,
                fontSize: "1rem",
                zIndex: 2,
                color: tab === 1 ? "#000" : "#9ca3af",
                textTransform: "none",
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* FORM */}
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={4}
            maxWidth={500}
            width="100%"
            mx="auto"
            onSubmit={handleContinue}
          >
            {/* EMAIL */}
  <TextField
  name="email"
  value={form.email}
  onChange={handleInputChange}
  onBlur={handleBlur}
  label="Email or Phone Number"
  placeholder="Email"
  fullWidth
  error={!!errors.email}
  helperText={errors.email || " "} 
    FormHelperTextProps={{
    sx: { minHeight: "20px" }, // fixes jumping
  }}

              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.95rem",
                  color: "#9ca3af",
                  "&.Mui-focused": { color: "#9ca3af" },
                  transform: "translate(14px, 16px) scale(1)",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -8px) scale(0.85)",
                    backgroundColor: "#fff",
                    px: 0.5,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pr: 1 }}>
                    <EmailIcon fontSize="small" style={{ opacity: 0.7 }} />
                    <Box
                      sx={{
                        height: 28,
                        width: "1px",
                        bgcolor: "#b0b0b0", // darker divider
                        ml: 1,
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "#a8a8a8" }, // darker border
                  "&:hover fieldset": { borderColor: "#808080" }, // darker on hover
                  "&.Mui-focused fieldset": { borderColor: "#4285F4" },
                  fontSize: "1rem",
                  py: 0.5,
                },
              }}
              variant="outlined"
            />

<TextField
  name="password"
  value={form.password}
  onChange={handleInputChange}
  onBlur={handleBlur}
  label="Password"
  placeholder="Password"
  type={showPassword ? "text" : "password"}
  fullWidth
  error={!!errors.password}
   helperText={errors.password || " "} 
    FormHelperTextProps={{
    sx: { minHeight: "20px" }, // fixes jumping
  }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.95rem",
                  color: "#9ca3af",
                  "&.Mui-focused": { color: "#9ca3af" },
                  transform: "translate(14px, 16px) scale(1)",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -8px) scale(0.85)",
                    backgroundColor: "#fff",
                    px: 0.5,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pr: 1 }}>
                    <Lock fontSize="small" style={{ opacity: 0.7 }} />
                    <Box
                      sx={{
                        height: 28,
                        width: "1px",
                        bgcolor: "#b0b0b0",
                        ml: 1,
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "#a8a8a8" }, // darker border
                  "&:hover fieldset": { borderColor: "#808080" },
                  "&.Mui-focused fieldset": { borderColor: "#4285F4" },
                  fontSize: "1rem",
                  py: 0.5,
                },
              }}
              variant="outlined"
            />


            {/* CONTINUE BUTTON */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#4285F4",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                py: 2,
                fontSize: "18px",
                "&:hover": { backgroundColor: "#3367D6" },
              }}
            >
              Continue
            </Button>
          </Box>

          {/* FORGOT PASSWORD */}
          <Box textAlign="center" mt={3}>
            <Typography
              variant="body1"
              sx={{ color: "#6b7280", textDecoration: "underline" }}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Box>

        {/* BOTTOM TEXT */}
        <Box mt={6} px={{ xs: 2, sm: 4, md: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "90%",        // Flexible width
              mx: "auto",             // Centered horizontally
              lineHeight: 1.7,
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" }, // Responsive font size
            }}
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE - FULL IMAGE */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1.1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "0 24px 24px 0",
          overflow: "hidden",
        }}
      >
        <Image
          src="/login_bg.svg"
          alt="Doctor"
          layout="intrinsic"
          width={700}
          height={800}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            borderRadius: "0 24px 24px 0",
          }}
          priority
        />
      </Box>
      {/* RIGHT SIDE - FULL IMAGE  device*/}
      {/* <Box
  sx={{
    display: { xs: "none", lg: "flex" },
    flex: 1.1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#fff",
    borderRadius: "0 24px 24px 0",
    overflow: "hidden",
    minHeight: "100vh", // ensures full vertical coverage
  }}
>
  <Image
    src="/login_bg.svg"
    alt="Doctor"
    layout="responsive"
    width={800}
    height={1000} // increased to stretch further
    style={{
      objectFit: "cover",
      width: "100%",
      height: "100%",
      borderRadius: "0 24px 24px 0",
    }}
    priority
  />
</Box> */}
    </Box>
  );
}

export default App;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const CreatePasswordPage: React.FC = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<{ password?: boolean; confirmPassword?: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const passwordsMatch = form.confirmPassword === form.password || !form.confirmPassword;
  const isPasswordFilled = form.password.length > 0;
  const canSubmit = isPasswordFilled && passwordsMatch && form.confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log("Password set successfully:", form.password);
    // API call to save password
  };

  const renderPasswordField = (
    name: "password" | "confirmPassword",
    label: string,
    show: boolean,
    handleShow: () => void
  ) => {
    const isConfirm = name === "confirmPassword";
    const showError = isConfirm && touched.confirmPassword && !passwordsMatch;

    return (
      <TextField
        name={name}
        value={form[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        label={label}
        placeholder={label}
        type={show ? "text" : "password"}
        fullWidth
        error={showError}
        helperText={showError ? "Passwords do not match" : " "}
        FormHelperTextProps={{
          sx: { minHeight: "20px" }, // avoid jumping
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
              <IconButton onClick={handleShow}>
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: "12px",
            backgroundColor: "#fff",
            "& fieldset": { borderColor: showError ? "#d32f2f" : "#a8a8a8" }, // red border if mismatch
            "&:hover fieldset": { borderColor: showError ? "#d32f2f" : "#808080" },
            "&.Mui-focused fieldset": { borderColor: showError ? "#d32f2f" : "#4285F4" },
            fontSize: "1rem",
            py: 0.5,
          },
        }}
        variant="outlined"
      />
    );
  };

  return (
    <Box
      className={`${inter.className}`}
      minHeight="100vh"
      display="flex"
      position="relative"
      bgcolor="#fff"
    >
      {/* Background Overlay */}
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

      {/* Left Section */}
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
        {/* Logo */}
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

        {/* Form */}
        <Box maxWidth="md" mx="auto" width="100%">
          <Box mb={6} textAlign="center">
            <Typography variant="h5" fontWeight={700} fontSize={28} color="#3D3D3D">
              Create New Password
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Set a secure password to continue
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={3}
            maxWidth={500}
            width="100%"
            mx="auto"
          >
            {renderPasswordField("password", "Password", showPassword, () => setShowPassword(!showPassword))}
            {renderPasswordField(
              "confirmPassword",
              "Confirm Password",
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!canSubmit}
              sx={{
                backgroundColor: canSubmit ? "#4285F4" : "#a0c3f9",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                py: 2,
                fontSize: "18px",
                "&:hover": { backgroundColor: canSubmit ? "#3367D6" : "#a0c3f9" },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>

        {/* Bottom Text */}
        <Box mt={6} px={{ xs: 2, sm: 4, md: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "90%",
              mx: "auto",
              lineHeight: 1.7,
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
            }}
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna
          </Typography>
        </Box>
      </Box>

      {/* Right Image */}
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
    </Box>
  );
};

export default CreatePasswordPage;

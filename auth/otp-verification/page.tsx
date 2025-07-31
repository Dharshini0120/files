"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, Button, Typography, TextField, CircularProgress } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(90);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      // Auto-focus next field if value entered
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").concat(Array(6 - pasteData.length).fill(""));
      setOtp(newOtp);
      setError("");
    }
    e.preventDefault();
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setTimer(90);
    setIsResendEnabled(false);
    setError("");
    console.log("Resend OTP triggered");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setLoading(true);
    setError("");
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1500));
      if (otpCode !== "123456") {
        throw new Error("Invalid OTP");
      }
      console.log("OTP Verified:", otpCode);
      // Navigate to next page
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.join("").length === 6;

  return (
    <Box className={`${inter.className}`} minHeight="100vh" display="flex" position="relative" bgcolor="#fff">
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
      {/* Left Form Section */}
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
          <Image src="/medical-logo.png" alt="Company Logo" width={160} height={160} style={{ objectFit: "contain" }} priority />
        </Box>

        {/* OTP Section */}
        <Box maxWidth="md" mx="auto" width="100%">
          <Box mb={6} textAlign="center">
            <Typography variant="h5" fontWeight={700} fontSize={28} color="#3D3D3D">
              OTP Verification
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Please enter the 6 digit code to continue
            </Typography>
          </Box>

          {/* OTP Fields */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={500}
            width="100%"
            mx="auto"
          >
            <Box display="flex" justifyContent="center" gap={2} className={shake ? "shake" : ""}>
              {otp.map((digit, idx) => (
                <TextField
                  key={idx}
                  id={`otp-${idx}`}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      padding: "12px",
                      width: "48px",
                    },
                    disabled: loading,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#a8a8a8" },
                      "&:hover fieldset": { borderColor: "#808080" },
                      "&.Mui-focused fieldset": { borderColor: "#4285F4" },
                    },
                  }}
                />
              ))}
            </Box>
            {error && (
              <Typography color="error" textAlign="center" fontSize="0.9rem">
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!isOtpComplete || loading}
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
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Continue"}
            </Button>

            <Typography textAlign="center" color="#6b7280" mt={2}>
              Didn’t receive the code?{" "}
              {isResendEnabled ? (
                <Typography
                  component="span"
                  sx={{ color: "#4285F4", fontWeight: 500, cursor: "pointer" }}
                  onClick={handleResend}
                >
                  Resend
                </Typography>
              ) : (
                <span>
                  Resend in{' '}
                  <span style={{ color: '#4285F4', fontWeight: 500 }}>
                    {`${Math.floor(timer / 60)
                      .toString()
                      .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`}
                  </span>
                </span>
              )}
            </Typography>
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
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
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

      <style jsx global>{`
        .shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0% { transform: translateX(0px); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0px); }
        }
      `}</style>
    </Box>
  );
};

export default OTPPage;

'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';

const facilityTypes = ['Academic Hospital', 'Community Hospital', 'Clinic'];
const states = ['Texas', 'California', 'New York'];
const counties = ['Austin', 'Dallas', 'Harris'];
const roles = ['Admin', 'Doctor', 'Nurse'];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  facilityName: string;
  facilityType: string;
  state: string;
  county: string;
  role: string;
}

interface FormErrors {
  [key: string]: string;
}

const SignUpPage: React.FC = () => {
  const [tab, setTab] = useState(1);
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    facilityName: '',
    facilityType: '',
    state: '',
    county: '',
    role: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

const fieldLabels: Record<keyof FormState, string> = {
  fullName: 'Full Name',
  email: 'Email ID',
  phone: 'Phone Number',
  facilityName: 'Facility Name',
  facilityType: 'Facility Type',
  state: 'State',
  county: 'County',
  role: 'Role',
};

const validateField = (name: string, value: string) => {
  const label = fieldLabels[name as keyof FormState] || name;
  if (!value) return `${label} is required`;

  if (name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return `Please enter a valid ${label}`;
  }

  if (name === 'phone') {
    const indianRegex = /^[6-9]\d{9}$/;
    const intlRegex = /^\+?[1-9]\d{6,14}$/;
    if (!indianRegex.test(value) && !intlRegex.test(value)) {
      return `Please enter a valid ${label}`;
    }
  }

  return '';
};




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(form).forEach((key) => {
      newErrors[key] = validateField(key, form[key as keyof FormState]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const isFormValid = () => Object.values(form).every((val) => val && val.trim() !== '');

const checkEmailExists = async (email: string) => {
  // Replace this with your API call
  const existingEmails = ['test@example.com', 'john@doe.com']; 
  return existingEmails.includes(email.toLowerCase());
};

const handleContinue = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    const emailExists = await checkEmailExists(form.email);
    if (emailExists) {
      setErrors((prev) => ({ ...prev, email: 'Email ID already exists' }));
      return;
    }

  }
};


const renderField = (
  name: keyof FormState,
  label: string,
  placeholder: string,
  icon: React.ReactNode,
  options?: string[]
) => {
  const hasValue = !!form[name];
  return (
    <TextField
      select={!!options}
      name={name}
      value={form[name]}
      onChange={(e) =>
        options
          ? handleSelectChange(name, e.target.value)
          : handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
      }
      onBlur={handleBlur}
      label={label}
      placeholder={!options ? placeholder : undefined}
      fullWidth
      SelectProps={{
        displayEmpty: true,
        IconComponent: hasValue ? () => null : undefined, // Hide default arrow if value exists
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pr: 0.5 }}>
            {icon}
            <Box sx={{ height: 24, width: '1px', bgcolor: '#d1d5db',ml:1}} />
          </InputAdornment>
        ),
        endAdornment:
          options && hasValue ? (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => handleSelectChange(name, '')}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        sx: {
          borderRadius: '12px',
          backgroundColor: '#fff',
          '& fieldset': { borderColor: '#a8a8a8' },
          '&:hover fieldset': { borderColor: '#808080' },
          '&.Mui-focused fieldset': { borderColor: '#4285F4' },
          fontSize: '1rem',
          pr: hasValue ? '36px' : '14px', // Reserve space for close icon
        },
      }}
      variant="outlined"
      error={!!errors[name]}
      helperText={errors[name] || ' '}
      FormHelperTextProps={{
        sx: { minHeight: '20px', marginLeft: 0 },
      }}
      sx={{
        '& .MuiOutlinedInput-input': { padding: '14px 10px' },
      }}
    >
      {options &&
        [
          <MenuItem key="placeholder" value="">
            <span style={{ color: '#9ca3af' }}>{placeholder}</span>
          </MenuItem>,
          ...options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          )),
        ]}
    </TextField>
  );
};


  return (
    <Box minHeight="100vh" display="flex" position="relative" bgcolor="#fff">
      {/* Left background faded image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/login_bg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
          zIndex: 0,
        }}
      />

      {/* Left - Form */}
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
          <Image src="/medical-logo.png" alt="Company Logo" width={160} height={160} style={{ objectFit: 'contain' }} priority />
        </Box>

        {/* Header */}
        <Box maxWidth="md" mx="auto" width="100%">
          <Box mb={6} textAlign="center">
            <Typography variant="h5" fontWeight={700} fontSize={28} color="#3D3D3D">
              Create Account
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Please enter your details to continue
            </Typography>
          </Box>

          {/* Tabs */}
          <Box position="relative" display="flex" width="100%" maxWidth={500} mb={6} mx="auto" borderRadius={2} bgcolor="#f3f4f6" p={1}>
            <Box
              position="absolute"
              top={8}
              left={tab === 0 ? 8 : '50%'}
              width="calc(50% - 8px)"
              height="calc(100% - 16px)"
              borderRadius={2}
              bgcolor="#fff"
              boxShadow={1}
              zIndex={1}
              sx={{ transition: 'left 0.3s cubic-bezier(.4,1.3,.6,1)' }}
            />
            <Button
              onClick={() => {
                setTab(0);
                router.push('/auth/signin');
              }}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: tab === 0 ? 700 : 500,
                fontSize: '1rem',
                zIndex: 2,
                color: tab === 0 ? '#000' : '#9ca3af',
                textTransform: 'none',
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setTab(1);
                router.push('/auth/signup');
              }}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: tab === 1 ? 700 : 500,
                fontSize: '1rem',
                zIndex: 2,
                color: tab === 1 ? '#000' : '#9ca3af',
                textTransform: 'none',
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Form Fields */}
          <Box component="form" display="flex" flexDirection="column" gap={3} maxWidth={740} width="100%" mx="auto" onSubmit={handleContinue}>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              {renderField('fullName', 'Full Name', 'Full Name', <PersonIcon fontSize="small" style={{ opacity: 0.7 }} />)}
              {renderField('email', 'Email Address', 'Email', <EmailIcon fontSize="small" style={{ opacity: 0.7 }} />)}
            </Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              {renderField('phone', 'Phone Number', 'Phone Number', <LocalPhoneIcon fontSize="small" style={{ opacity: 0.7 }} />)}
              {renderField('facilityName', 'Facility Name', 'Facility Name', <BusinessIcon fontSize="small" style={{ opacity: 0.7 }} />)}
            </Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              {renderField('facilityType', 'Facility Type', 'Select Facility Type', <ApartmentIcon fontSize="small" style={{ opacity: 0.7 }} />, facilityTypes)}
              {renderField('state', 'State', 'Select State', <LanguageIcon fontSize="small" style={{ opacity: 0.7 }} />, states)}
            </Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              {renderField('county', 'County', 'Select County', <LanguageIcon fontSize="small" style={{ opacity: 0.7 }} />, counties)}
              {renderField('role', 'Role', 'Select Role', <PeopleIcon fontSize="small" style={{ opacity: 0.7 }} />, roles)}
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!isFormValid()}
              sx={{
                backgroundColor: '#4285F4',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                py: 2,
                fontSize: '18px',
                '&:hover': { backgroundColor: '#3367D6' },
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
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: '90%',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
            }}
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
          </Typography>
        </Box>
      </Box>

      {/* Right - Full Image */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1.1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '0 24px 24px 0',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/login_bg.svg"
          alt="Doctor"
          layout="intrinsic"
          width={700}
          height={800}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: '0 24px 24px 0',
          }}
          priority
        />
      </Box>
    </Box>
  );
};

export default SignUpPage;

"use client";
import React, { useState, useEffect } from "react";
import { LoadingProvider, PageLoader } from "@frontend/shared-ui";
import AppHeader from "../../components/layout/AppHeader";
import HomeSection from "../../components/home/HeroSection";
import HomeAssessmentSection from "../../components/home/HomeAssessmentSection";
import HomeCTASection from "../../components/home/HomeCTASection";
import HomePowerfulSection from "../../components/home/HomePowerfulSection";
import HomeTestimonialSection from "../../components/home/HomeTestimonalSection";
import AppFooter from "../../components/layout/AppFooter";

interface Item {
  id?: string;
  name: string;
  description: string;
}

const HomePage = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <PageLoader loading={loading}>
        <AppHeader />
        <HomeSection />
        <HomeAssessmentSection />
        <HomePowerfulSection />
        <HomeTestimonialSection />
        <HomeCTASection />
        <AppFooter />
      </PageLoader>
    </LoadingProvider>
  );
};

export default HomePage;

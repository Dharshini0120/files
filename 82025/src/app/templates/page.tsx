"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TemplateDashboard from "../../components/templates/TemplateDashboard";
import { withPageLoader } from "@frontend/shared-ui";

const TemplatesPage = () => {
  return (
    <DashboardLayout>
      <TemplateDashboard
        title="Templates"
        subtitle="View and manage all templates for City General Hospital"
        onNewTemplate={() => {/* console.log("New Template clicked") */}}
      />
    </DashboardLayout>
  );
};

export default withPageLoader(TemplatesPage);
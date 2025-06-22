"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/DashboardOverview";
import UsersManagement from "@/components/admin/UsersManagement";
import CropsManagement from "@/components/admin/CropsManagement";
import FeaturesManagement from "@/components/admin/FeaturesManagement";
import PredictionsManagement from "@/components/admin/PredictionsManagement";
import AnalyticsManagement from "@/components/admin/AnalyticsManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import ContactsManagement from "@/components/admin/ContactsManagement";
import CropInsightsManagement from "@/components/admin/CropsInsightsManagement";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromUrl = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync URL with tab state
  useEffect(() => {
    if (activeTab !== tabFromUrl) {
      const query = new URLSearchParams({ tab: activeTab });
      router.replace(`/admin?${query.toString()}`, { scroll: false });
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UsersManagement />;
      case "crops":
        return <CropsManagement />;
      case "features":
        return <FeaturesManagement />;
      case "predictions":
        return <PredictionsManagement />;
      case "analytics":
        return <AnalyticsManagement />;
      case "settings":
        return <SettingsManagement />;
      case "blog":
        return <BlogManagement />;
      case "contacts":
        return <ContactsManagement />
      case "cropsinsights":
        return <CropInsightsManagement />
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
        />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

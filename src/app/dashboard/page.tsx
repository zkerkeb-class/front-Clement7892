"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStyles } from "@/styles/pages/dashboardStyles";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirection en fonction du rôle
  useEffect(() => {
    if (!isLoading && user) {
      // Rediriger vers la page spécifique au rôle
      switch (user.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "manager":
          router.push("/dashboard/manager");
          break;
        default:
          router.push("/dashboard/user");
          break;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div style={DashboardStyles.welcomeCard}>
      <h1 style={DashboardStyles.welcomeTitle}>
        Bienvenue,{" "}
        {user?.firstName ||
          (user?.email ? user.email.split("@")[0] : "utilisateur")}
        !
      </h1>
      <p style={DashboardStyles.welcomeText}>
        Vous êtes maintenant connecté au CRM Crew. Redirection en cours...
      </p>
    </div>
  );
};

export default Dashboard;

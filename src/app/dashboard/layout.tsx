"use client";
import React, { ReactNode, useState } from "react";
import NavBar from "@/components/common/NavBar";
import { NavbarProvider } from "@/contexts/NavBarContext";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStyles } from "@/styles/pages/dashboardStyles";
import { CSSProperties } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Composant interne qui utilise le contexte d'authentification
const DashboardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  if (isLoading) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Style du contenu principal
  const contentStyle: CSSProperties = {
    ...DashboardStyles.content,
    ...(hoveredIcon !== null
      ? DashboardStyles.contentWithMenu
      : DashboardStyles.contentFullWidth),
  };

  return (
    <div style={DashboardStyles.container}>
      <NavBar user={user} />
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

// Layout principal qui fournit les contextes
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <NavbarProvider>
      <DashboardContent>{children}</DashboardContent>
    </NavbarProvider>
  );
};

export default DashboardLayout;

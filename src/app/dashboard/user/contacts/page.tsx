"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useContact } from "@/hooks/useContact";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import ContactTable from "@/components/contacts/ContactTable";
import ActionButton from "@/components/common/ActionButton";

const ContactList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

  // Vérification des droits d'accès (user)
  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["user"],
    redirectPath: "/dashboard",
  });

  // Récupération des données du dashboard utilisateur
  const {
    dashboardData,
    loading: isLoadingDashboard,
    error: dashboardError,
  } = useUserDashboard();

  // Récupération des contacts de l'entreprise
  const {
    contacts,
    loading: isLoadingContacts,
    error: contactsError,
  } = useContact({ companyId: dashboardData?.company?._id });

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage des erreurs
  const error = dashboardError || contactsError;
  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  // Si l'utilisateur n'a pas d'entreprise associée
  if (!dashboardData?.company) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Information</h2>
        <p>Vous n'avez pas encore d'entreprise associée à votre compte.</p>
        <ActionButton
          onClick={() => router.push("/dashboard")}
          variant="secondary"
          size="medium"
        >
          Retour au tableau de bord
        </ActionButton>
      </div>
    );
  }

  const company = dashboardData.company;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Mes contacts
          </h1>
          <p style={{ color: "#666" }}>
            Entreprise: <strong>{company.name}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            size="medium"
          >
            Retour au tableau de bord
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/user/contacts/add/${company._id}`)
            }
            variant="primary"
            size="large"
          >
            Ajouter un contact
          </ActionButton>
        </div>
      </div>

      <ContactTable
        contacts={contacts}
        companyId={company._id}
        isLoading={isLoadingContacts}
      />
    </div>
  );
};

export default ContactList;

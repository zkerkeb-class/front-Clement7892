"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useContact } from "@/hooks/useContact";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import ContactTable from "@/components/contacts/ContactTable";
import ActionButton from "@/components/common/ActionButton";

const ManagerContactList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

  // Vérification des droits d'accès (manager)
  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["manager"],
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
      <div
        style={{
          padding: "var(--spacing-normal)",
          color: "var(--color-error-dark)",
        }}
      >
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
      <div style={{ padding: "var(--spacing-normal)" }}>
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
          marginBottom: "var(--spacing-normal)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--font-size-big)",
              marginBottom: "var(--spacing-small)",
            }}
          >
            Gestion des contacts
          </h1>
          <p style={{ color: "var(--color-grey-600)" }}>
            Entreprise: <strong>{company.name}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-small)" }}>
          <ActionButton
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            size="medium"
          >
            Retour au tableau de bord
          </ActionButton>
          <ActionButton
            onClick={() =>
              router.push(`/dashboard/manager/contacts/add/${company._id}`)
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

export default ManagerContactList;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useClient } from "@/hooks/useClient";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import ClientTable from "@/components/clients/ClientTable";
import ActionButton from "@/components/common/ActionButton";

const ManagerClientList: React.FC = () => {
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

  // Récupération des clients de l'entreprise
  const {
    clients,
    isLoading: isLoadingClients,
    error: clientsError,
    updateClientData,
  } = useClient({ companyId: dashboardData?.company?._id });

  // Gestionnaire pour le changement de statut d'un client
  const handleStatusChange = (clientId: string, newStatus: boolean) => {
    updateClientData(clientId, { isActive: newStatus });
  };

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage des erreurs
  const error = dashboardError || clientsError;
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
            Gestion des clients
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
              router.push(`/dashboard/manager/clients/add/${company._id}`)
            }
            variant="primary"
            size="large"
          >
            Ajouter un client
          </ActionButton>
        </div>
      </div>

      <ClientTable
        clients={clients}
        companyId={company._id}
        isLoading={isLoadingClients}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ManagerClientList;

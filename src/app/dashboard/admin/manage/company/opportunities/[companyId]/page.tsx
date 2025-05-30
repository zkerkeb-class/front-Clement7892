"use client";
import React, { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useCompanyOpportunities } from "@/hooks/useCompanyOpportunities";
import ActionButton from "@/components/common/ActionButton";
import OpportunityBoard from "@/components/opportunity/OpportunityBoard";

interface CompanyOpportunitiesProps {
  params: Promise<{
    companyId: string;
  }>;
}

const CompanyOpportunities: React.FC<CompanyOpportunitiesProps> = ({
  params,
}) => {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  const { user, isLoading } = useAuth();

  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: ["admin"],
    redirectPath: "/dashboard",
  });

  const {
    opportunities,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
  } = useCompanyOpportunities({ companyId });

  if (isLoading || !user) {
    return null;
  }

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "50px", marginBottom: "8px" }}>
            Opportunités de l'entreprise
          </h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #ddd",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "kanban" ? "#E76F51" : "var(--color-neutral)",
                color: viewMode === "kanban" ? "white" : "#E76F51",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "list" ? "#E76F51" : "var(--color-neutral)",
                color: viewMode === "kanban" ? "#E76F51" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Liste
            </button>
          </div>
          <ActionButton
            onClick={navigateToClientsList}
            variant="secondary"
            size="medium"
            customTextColor="#E76F51"
            customBorderColor="#E76F51"
          >
            Retour aux clients
          </ActionButton>
        </div>
      </div>

      <OpportunityBoard
        opportunities={opportunities}
        isLoading={isLoadingOpportunities}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
      />
    </div>
  );
};

export default CompanyOpportunities;

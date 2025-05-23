"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Client, getAllClients } from "@/services/client.service";
import ClientTable from "@/components/clients/ClientTable";
import ActionButton from "@/components/common/ActionButton";
import { useClient } from "@/hooks/useClient";

const AdminClientsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification des droits d'accès (admin)
  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["admin"],
    redirectPath: "/dashboard",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
      } catch (err) {
        setError("Erreur lors du chargement des clients");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (hasAccess) {
      fetchClients();
    }
  }, [hasAccess]);

  if (isLoadingAuth || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
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
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Gestion des clients
          </h1>
          <p style={{ color: "#666" }}>Administration de tous les clients</p>
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
            onClick={() => router.push("/dashboard/admin/clients/add")}
            variant="primary"
            size="large"
          >
            Ajouter un client
          </ActionButton>
        </div>
      </div>

      <ClientTable clients={clients} companyId="admin" isLoading={loading} />
    </div>
  );
};

export default AdminClientsPage;

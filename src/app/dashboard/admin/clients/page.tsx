"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Client, getAllClients } from "@/services/client.service";
import { adminStyles as styles } from "@/styles/pages/dashboard/admin/adminStyles";
import ActionButton from "@/components/common/ActionButton";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

export default function AdminClientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchClients();
  }, []);

  const handleEdit = (clientId: string) => {
    router.push(`/dashboard/admin/clients/edit/${clientId}`);
  };

  const handleView = (clientId: string) => {
    router.push(`/dashboard/admin/clients/${clientId}`);
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        // Appel à la fonction de suppression
        // await deleteClient(clientId);
        setClients(clients.filter(client => client._id !== clientId));
      } catch (err) {
        setError("Erreur lors de la suppression du client");
        console.error("Erreur:", err);
      }
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Chargement des clients...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestion des Clients</h1>
        <ActionButton
          onClick={() => router.push("/dashboard/admin/clients/add")}
          variant="primary"
          size="medium"
        >
          <FaPlus /> Nouveau Client
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Secteur</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Ville</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td style={styles.td}>{client.name}</td>
                <td style={styles.td}>{client.sector || "-"}</td>
                <td style={styles.td}>{client.email || "-"}</td>
                <td style={styles.td}>{client.phone || "-"}</td>
                <td style={styles.td}>{client.address?.city || "-"}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <ActionButton
                      onClick={() => handleView(client._id)}
                      variant="primary"
                      size="small"
                    >
                      <FaEye />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleEdit(client._id)}
                      variant="secondary"
                      size="small"
                    >
                      <FaEdit />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDelete(client._id)}
                      variant="danger"
                      size="small"
                    >
                      <FaTrash />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
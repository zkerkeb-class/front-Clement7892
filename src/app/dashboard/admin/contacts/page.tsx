"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Contact, getAllContacts } from "@/services/contact.service";
import { adminStyles as styles } from "@/styles/pages/dashboard/admin/adminStyles";
import ActionButton from "@/components/common/ActionButton";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminContactsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getAllContacts();
        setContacts(data);
      } catch (err) {
        setError("Erreur lors du chargement des contacts");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleEdit = (contactId: string) => {
    router.push(`/dashboard/admin/contacts/edit/${contactId}`);
  };

  const handleDelete = async (contactId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      try {
        // Appel à la fonction de suppression
        // await deleteContact(contactId);
        setContacts(contacts.filter((contact) => contact._id !== contactId));
      } catch (err) {
        setError("Erreur lors de la suppression du contact");
        console.error("Erreur:", err);
      }
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Chargement des contacts...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestion des Contacts</h1>
        <ActionButton
          onClick={() => router.push("/dashboard/admin/contacts/add")}
          variant="primary"
          size="medium"
        >
          <FaPlus /> Nouveau Contact
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Poste</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Entreprise</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td style={styles.td}>
                  {contact.firstName} {contact.lastName}
                </td>
                <td style={styles.td}>{contact.position || "-"}</td>
                <td style={styles.td}>{contact.email || "-"}</td>
                <td style={styles.td}>{contact.phone || "-"}</td>
                <td style={styles.td}>{contact.company}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <ActionButton
                      onClick={() => handleEdit(contact._id)}
                      variant="secondary"
                      size="small"
                    >
                      <FaEdit />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDelete(contact._id)}
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

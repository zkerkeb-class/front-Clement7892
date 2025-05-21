import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleContactStatus from "@/components/contacts/ToggleContactStatus";
import DeleteContactModal from "@/components/contacts/DeleteContactModal";
import { Contact, deleteContact } from "@/services/contact.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useDateFormatterFr } from "@/hooks/useDateFormatter";
import { useContactAssignedUsers } from "@/hooks/useContactAssignedUsers";
import { useContactClients } from "@/hooks/useContactClients";

interface ContactTableProps {
  contacts: Contact[];
  companyId: string;
  isLoading: boolean;
  onStatusChange?: (contactId: string, newStatus: boolean) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const formatDate = useDateFormatterFr();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Utilisation des hooks personnalisés
  const { getAssignedUserName, loading: loadingUsers } =
    useContactAssignedUsers(contacts);
  const { getClientName, loading: loadingClients } =
    useContactClients(contacts);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    if (user?.role === "admin") return "admin";
    if (user?.role === "manager") return "manager";
    return "user";
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      setDeletingId(contactToDelete._id);
      await deleteContact(contactToDelete._id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      alert("Une erreur est survenue lors de la suppression du contact");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const columns: TableColumn<Contact>[] = [
    {
      header: "Nom",
      accessor: (contact) => `${contact.firstName} ${contact.lastName}`,
      align: "left",
    },
    {
      header: "Client",
      accessor: getClientName,
      align: "left",
    },
    {
      header: "Poste",
      accessor: (contact) => contact.position || "Non renseigné",
      align: "left",
    },
    {
      header: "Email",
      accessor: (contact) => contact.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Mobile",
      accessor: (contact) => contact.mobile || "Non renseigné",
      align: "left",
    },
    {
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Statut",
      accessor: (contact) => <StatusBadge isActive={contact.isActive} />,
      align: "center",
    },
    {
      header: "Actions",
      accessor: (contact) => {
        const routePrefix = getRoutePrefix();
        const isAdminOrManager =
          user?.role === "admin" || user?.role === "manager";

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(
                  isAdminOrManager
                    ? `/dashboard/${routePrefix}/manage/company/clients/${companyId}/edit/${contact.client}?step=4`
                    : `/dashboard/user/contacts/edit/${companyId}/${contact._id}`
                )
              }
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            {isAdminOrManager && onStatusChange && (
              <ToggleContactStatus
                contactId={contact._id}
                isActive={contact.isActive}
                onStatusChange={(newStatus) =>
                  onStatusChange(contact._id, newStatus)
                }
              />
            )}
            <ActionButton
              onClick={() => handleDeleteClick(contact)}
              variant="danger"
              size="medium"
              disabled={deletingId === contact._id}
            >
              {deletingId === contact._id ? "Suppression..." : "Supprimer"}
            </ActionButton>
          </div>
        );
      },
      align: "center",
      isAction: true,
    },
  ];

  // Utiliser les styles configurés
  const customTableStyles = {
    ...tableStyleProps,
    variant: "striped" as const,
    headerStyle: "light" as const,
    rounded: true,
    maxWidth: "1200px",
  };

  return (
    <>
      <Table
        data={contacts}
        columns={columns}
        keyField="_id"
        isLoading={isLoading || loadingUsers || loadingClients}
        emptyMessage="Aucun contact trouvé pour cette entreprise"
        styleProps={customTableStyles}
      />
      {showDeleteModal && contactToDelete && (
        <DeleteContactModal
          contactName={`${contactToDelete.firstName} ${contactToDelete.lastName}`}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ContactTable;

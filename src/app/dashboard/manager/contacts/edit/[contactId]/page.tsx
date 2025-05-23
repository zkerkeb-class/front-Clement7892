"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useContactForm } from "@/hooks/useContactForm";
import { contactStyles as styles } from "@/styles/components/forms/ContactFormStyles";
import ActionButton from "@/components/common/ActionButton";
import { useNavigation } from "@/utils/navigateBack";

export default function EditContactPage() {
  const params = useParams();
  const contactId = params.contactId as string;
  const { navigateBack } = useNavigation();

  const { formData, loading, error, success, handleChange, handleSubmit } =
    useContactForm(undefined, contactId);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingMessage}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Modifier le contact</h1>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          Retour
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>
              Prénom <span style={styles.requiredField}>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>
              Nom <span style={styles.requiredField}>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Poste</label>
          <input
            type="text"
            name="position"
            value={formData.position || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>Téléphone fixe</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary || false}
              onChange={handleChange}
              style={styles.checkbox}
            />
            Contact principal
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            style={styles.textarea}
            rows={4}
          />
        </div>

        <div style={styles.buttonContainer}>
          <ActionButton
            onClick={navigateBack}
            variant="secondary"
            size="medium"
          >
            Annuler
          </ActionButton>
          <button type="submit" style={styles.submitButton}>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

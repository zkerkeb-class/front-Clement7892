// /app/dashboard/[role]/manage/company/clients/[companyId]/opportunities/[clientId]/edit/[opportunityId]/page.tsx
"use client";
import React, { use } from "react";
import OpportunityForm from "@/components/forms/opportunity/OpportunityForm";

interface EditOpportunityProps {
  params: Promise<{
    companyId: string;
    clientId: string;
    opportunityId: string;
  }>;
}

const EditOpportunity: React.FC<EditOpportunityProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const { companyId, clientId, opportunityId } = unwrappedParams;

  return (
    <OpportunityForm
      mode="edit"
      companyId={companyId}
      clientId={clientId}
      opportunityId={opportunityId}
    />
  );
};

export default EditOpportunity;

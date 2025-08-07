// Import statements first
import React from 'react';
import PlaceholderSection from './PlaceholderSection';
import { OnboardingProject } from '../../types';

// Export all section components
export { default as Overview } from './Overview';
export { default as Migration } from './Migration';
export { default as EmailAddresses } from './EmailAddresses';
export { default as WorkingHours } from './WorkingHours';
export { default as AgentsGroups } from './AgentsGroups';
export { default as SLA } from './SLA';
export { default as ContactFields } from './ContactFields';

// Placeholder sections - these will be implemented later

interface SectionProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

// SLA and ContactFields are now exported as real components above

export const TicketFields: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "ticket-fields",
    sectionTitle: "Ärendefält",
    sectionDescription: "Skapa anpassade fält för ärenden"
  })
);

export const TicketForms: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "ticket-forms",
    sectionTitle: "Ärendeformulär",
    sectionDescription: "Bygg formulär för ärendeskapande"
  })
);

export const PredefinedForms: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "predefined-forms",
    sectionTitle: "Fördefinierade formulär",
    sectionDescription: "Skapa mallar för vanliga ärendetyper"
  })
);

export const CannedResponses: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "canned-responses",
    sectionTitle: "Fördefinerade svarsmallar",
    sectionDescription: "Organisera svarsmallar i mappar"
  })
);

export const SolutionArticles: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "solution-articles",
    sectionTitle: "Lösningsartiklar",
    sectionDescription: "Bygg kunskapsbas med artiklar"
  })
);

export const Automations: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "automations",
    sectionTitle: "Automatiseringar",
    sectionDescription: "Skapa regler för automatisk ärendehantering"
  })
);

export const CSAT: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "csat",
    sectionTitle: "CSAT (Customer Satisfaction)",
    sectionDescription: "Konfigurera kundnöjdhetsundersökningar"
  })
);

export const PortalSettings: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "portal-settings",
    sectionTitle: "Portalinställningar",
    sectionDescription: "Konfigurera kundportalens inställningar"
  })
);

export const Integrations: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "integrations",
    sectionTitle: "Integrationer",
    sectionDescription: "Konfigurera externa systemintegrationer"
  })
);

export const Reports: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "reports",
    sectionTitle: "Rapporter",
    sectionDescription: "Skapa anpassade rapporter"
  })
);

export const ReviewSubmit: React.FC<SectionProps> = (props) => (
  React.createElement(PlaceholderSection, {
    ...props,
    sectionId: "review-submit",
    sectionTitle: "Granska & Skicka",
    sectionDescription: "Slutlig granskning och inlämning"
  })
);

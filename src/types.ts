// Types for the Scaly Onboarding Application

export interface OnboardingProject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'submitted' | 'completed';
  completedSections: string[];
  
  // Section data
  migrationData: MigrationData;
  emailAddresses: EmailAddress[];
  workingHours: WorkingHours[];
  groups: Group[];
  agents: Agent[];
  slaPolicy: SLAPolicy[];
  contactFields: CustomField[];
  ticketFields: CustomField[];
  ticketForms: TicketForm[];
  predefinedForms: TicketForm[];
  cannedResponses: CannedResponseFolder[];
  solutionArticles: SolutionArticleCategory[];
  automations: AutomationRule[];
  csatConfig: CSATConfig;
  portalSettings: PortalSettings;
  integrations: Integration[];
  reports: CustomReport[];
}

export interface MigrationData {
  antalAr: string;
  arende: string;
  bilagorIArenden: string;
  kontakter: string;
  foretag: string;
  agenter: string;
  grupper: string;
  slaRegler: string;
  losningsartiklar: string;
  rapporter: string;
  anpassningar: string;
}

export interface EmailAddress {
  id: string;
  name: string;
  email: string;
  associatedGroup: string;
}

export interface WorkingHours {
  id: string;
  timezone: string;
  name: string;
  weekdays: string[];
  fromTime: string;
  toTime: string;
  group: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  language: string;
  timezone: string;
  associatedGroups: string[];
  signature: string;
}

export interface SLAPolicy {
  id: string;
  name: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  firstResponseTime: TimeValue;
  resolutionTime: TimeValue;
  escalations: Escalation[];
  reminders: Reminder[];
}

export interface TimeValue {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface Escalation {
  id: string;
  condition: string;
  action: string;
  timeDelay: TimeValue;
}

export interface Reminder {
  id: string;
  type: string;
  timeDelay: TimeValue;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'dropdown' | 'multiselect' | 'checkbox' | 'date' | 'number';
  required: boolean;
  options?: string[];
  dependsOn?: string;
  showWhen?: string;
}

export interface TicketForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  fieldId: string;
  required: boolean;
  order: number;
}

export interface CannedResponseFolder {
  id: string;
  name: string;
  responses: CannedResponse[];
}

export interface CannedResponse {
  id: string;
  name: string;
  content: string;
}

export interface SolutionArticleCategory {
  id: string;
  name: string;
  folders: SolutionArticleFolder[];
}

export interface SolutionArticleFolder {
  id: string;
  name: string;
  articles: SolutionArticle[];
}

export interface SolutionArticle {
  id: string;
  title: string;
  content: string;
  visibility: 'internal' | 'external';
}

export interface AutomationRule {
  id: string;
  name: string;
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

export interface AutomationTrigger {
  id: string;
  type: string;
  value: string;
}

export interface AutomationCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface AutomationAction {
  id: string;
  type: string;
  value: string;
}

export interface CSATConfig {
  surveyQuestion: string;
  thankYouMessage: string;
  sendTrigger: string;
  choices: string[];
}

export interface PortalSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
  enableCaptcha: boolean;
  allowGuestTickets: boolean;
  ticketCreationForGuests: boolean;
  displayKnowledgeBase: boolean;
}

export interface Integration {
  id: string;
  systemName: string;
  purpose: string;
  description: string;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  additionalDescription: string;
}

// Navigation types
export interface NavigationSection {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
}

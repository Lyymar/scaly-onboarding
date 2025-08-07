import React from 'react';
import { OnboardingProject } from '../types';
import { navigationSections } from '../navigationConfig';

// Import section components
import {
  Overview,
  Migration,
  EmailAddresses,
  WorkingHours,
  AgentsGroups,
  SLA,
  ContactFields,
  TicketFields,
  TicketForms,
  PredefinedForms,
  CannedResponses,
  SolutionArticles,
  Automations,
  CSAT,
  PortalSettings,
  Integrations,
  Reports,
  ReviewSubmit,
} from './sections';

interface MainContentProps {
  currentSection: string;
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({
  currentSection,
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const currentSectionData = navigationSections.find(
    section => section.id === currentSection
  );

  if (!currentSectionData) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center">
          <p className="text-red-600">Section not found</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    const commonProps = {
      project,
      onUpdateProject,
      onMarkCompleted,
    };

    switch (currentSection) {
      case 'overview':
        return <Overview {...commonProps} />;
      case 'migration':
        return <Migration {...commonProps} />;
      case 'email-addresses':
        return <EmailAddresses {...commonProps} />;
      case 'working-hours':
        return <WorkingHours {...commonProps} />;
      case 'agents-groups':
        return <AgentsGroups {...commonProps} />;
      case 'sla':
        return <SLA {...commonProps} />;
      case 'contact-fields':
        return <ContactFields {...commonProps} />;
      case 'ticket-fields':
        return <TicketFields {...commonProps} />;
      case 'ticket-forms':
        return <TicketForms {...commonProps} />;
      case 'predefined-forms':
        return <PredefinedForms {...commonProps} />;
      case 'canned-responses':
        return <CannedResponses {...commonProps} />;
      case 'solution-articles':
        return <SolutionArticles {...commonProps} />;
      case 'automations':
        return <Automations {...commonProps} />;
      case 'csat':
        return <CSAT {...commonProps} />;
      case 'portal-settings':
        return <PortalSettings {...commonProps} />;
      case 'integrations':
        return <Integrations {...commonProps} />;
      case 'reports':
        return <Reports {...commonProps} />;
      case 'review-submit':
        return <ReviewSubmit {...commonProps} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Section under construction</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentSectionData.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {currentSectionData.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {project.completedSections.includes(currentSection) && (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              Project ID: {project.id}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        {renderSection()}
      </div>
    </div>
  );
};

export default MainContent;

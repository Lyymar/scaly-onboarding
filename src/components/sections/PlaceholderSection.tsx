import React from 'react';
import { OnboardingProject } from '../../types';

interface PlaceholderSectionProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
  sectionTitle: string;
  sectionDescription: string;
  sectionId: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
  sectionTitle,
  sectionDescription,
  sectionId,
}) => {
  const handleMarkCompleted = () => {
    onMarkCompleted(sectionId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {sectionTitle}
          </h2>
          <p className="text-gray-600 mb-6">
            {sectionDescription}
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Under utveckling</h3>
          <p className="text-gray-600 mb-4">
            Denna sektion är under utveckling och kommer att innehålla funktionalitet för:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• Formulär för konfiguration</li>
            <li>• Dynamiska tabeller för datahantering</li>
            <li>• Validering och felhantering</li>
            <li>• Automatisk sparning av framsteg</li>
          </ul>
        </div>
        
        <button
          onClick={handleMarkCompleted}
          className="btn-primary"
        >
          Markera som slutförd (tillfälligt)
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Denna sektion kommer att implementeras i nästa utvecklingsfas
        </p>
      </div>
    </div>
  );
};

export default PlaceholderSection;

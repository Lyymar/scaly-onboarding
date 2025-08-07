import React from 'react';
import { OnboardingProject } from '../../types';

interface OverviewProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const Overview: React.FC<OverviewProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const handleGetStarted = () => {
    onMarkCompleted('overview');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Välkommen till Scaly Onboarding
        </h2>
        <p className="text-xl opacity-90">
          Detta verktyg hjälper dig att konfigurera din helpdesk och chattsupport miljö
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Strukturerad Process</h3>
          </div>
          <p className="text-gray-600">
            Följ en steg-för-steg guide genom alla konfigurationssektioner. 
            Dina framsteg sparas automatiskt så du kan fortsätta när som helst.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Automatisk Sparning</h3>
          </div>
          <p className="text-gray-600">
            All data sparas automatiskt medan du arbetar. Du kan lämna och 
            återkomma till ditt projekt när som helst.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Vad du kommer att konfigurera</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold">Migration & Grunddata</h4>
                <p className="text-gray-600 text-sm">Specificera befintlig data som ska migreras</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold">E-postadresser & Grupper</h4>
                <p className="text-gray-600 text-sm">Konfigurera supportteamets struktur</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold">Arbetstider & SLA</h4>
                <p className="text-gray-600 text-sm">Definiera supporttider och servicenivåer</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-semibold">Anpassade Fält</h4>
                <p className="text-gray-600 text-sm">Skapa kontakt- och ärendefält</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                5
              </div>
              <div>
                <h4 className="font-semibold">Formulär & Mallar</h4>
                <p className="text-gray-600 text-sm">Bygg ärendeformulär och svarsmallar</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                6
              </div>
              <div>
                <h4 className="font-semibold">Kunskapsbas</h4>
                <p className="text-gray-600 text-sm">Organisera lösningsartiklar</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                7
              </div>
              <div>
                <h4 className="font-semibold">Automatisering</h4>
                <p className="text-gray-600 text-sm">Skapa regler för automatisk hantering</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                8
              </div>
              <div>
                <h4 className="font-semibold">Portal & Integrationer</h4>
                <p className="text-gray-600 text-sm">Konfigurera kundportal och externa system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-amber-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Viktigt att veta</h4>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Du kan navigera mellan sektioner med hjälp av sidomenyn</li>
              <li>• Alla ändringar sparas automatiskt</li>
              <li>• Slutförda sektioner markeras med en grön bock</li>
              <li>• Du kan dela projektlänken med kollegor för samarbete</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleGetStarted}
          className="btn-primary text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Kom igång med konfigurationen
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Projekt-ID: <code className="bg-gray-100 px-2 py-1 rounded">{project.id}</code>
        </p>
      </div>
    </div>
  );
};

export default Overview;

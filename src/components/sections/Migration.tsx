import React, { useState } from 'react';
import { OnboardingProject, MigrationData } from '../../types';

interface MigrationProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const Migration: React.FC<MigrationProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const [migrationData, setMigrationData] = useState<MigrationData>(
    project.migrationData
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof MigrationData, value: string) => {
    const updatedData = { ...migrationData, [field]: value };
    setMigrationData(updatedData);
    
    // Auto-save
    onUpdateProject({ migrationData: updatedData });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProject({ migrationData });
      await onMarkCompleted('migration');
    } catch (error) {
      console.error('Failed to save migration data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const migrationFields = [
    {
      key: 'antalAr' as keyof MigrationData,
      label: 'Antal år',
      description: 'Hur många års data ska migreras?',
      placeholder: 'T.ex. 3 år av ärendehistorik',
    },
    {
      key: 'arende' as keyof MigrationData,
      label: 'Ärenden',
      description: 'Specificera antal, innehåll samt källa för ärenden',
      placeholder: 'T.ex. 5000 ärenden från Zendesk, inkl. kommentarer och bilagor',
    },
    {
      key: 'bilagorIArenden' as keyof MigrationData,
      label: 'Bilagor i ärenden',
      description: 'Information om bilagor som ska migreras',
      placeholder: 'T.ex. PDF-filer, bilder, totalt ca 2GB data',
    },
    {
      key: 'kontakter' as keyof MigrationData,
      label: 'Kontakter',
      description: 'Kundkontakter som ska migreras',
      placeholder: 'T.ex. 1200 kontakter från CRM-system',
    },
    {
      key: 'foretag' as keyof MigrationData,
      label: 'Företag',
      description: 'Företagsinformation som ska migreras',
      placeholder: 'T.ex. 300 företag med kontaktuppgifter',
    },
    {
      key: 'agenter' as keyof MigrationData,
      label: 'Agenter',
      description: 'Supportagenter som ska migreras',
      placeholder: 'T.ex. 15 agenter med roller och behörigheter',
    },
    {
      key: 'grupper' as keyof MigrationData,
      label: 'Grupper',
      description: 'Supportgrupper som ska migreras',
      placeholder: 'T.ex. IT-support, Ekonomi, Försäljning',
    },
    {
      key: 'slaRegler' as keyof MigrationData,
      label: 'SLA-regler',
      description: 'Servicenivåavtal som ska migreras',
      placeholder: 'T.ex. 4 SLA-nivåer med olika svarstider',
    },
    {
      key: 'losningsartiklar' as keyof MigrationData,
      label: 'Lösningsartiklar',
      description: 'Kunskapsbasartiklar som ska migreras',
      placeholder: 'T.ex. 50 artiklar från befintlig kunskapsbas',
    },
    {
      key: 'rapporter' as keyof MigrationData,
      label: 'Rapporter',
      description: 'Anpassade rapporter som ska migreras',
      placeholder: 'T.ex. månadsrapporter, SLA-uppföljning',
    },
    {
      key: 'anpassningar' as keyof MigrationData,
      label: 'Anpassningar',
      description: 'Övriga anpassningar som ska migreras',
      placeholder: 'T.ex. anpassade fält, automatiseringar, integrationer',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instruktioner</h3>
            <p className="text-blue-700 text-sm">
              Under varje kolumn/kategori → specificera antal, innehåll samt källa. 
              Var så detaljerad som möjligt för att säkerställa en smidig migration.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {migrationFields.map((field) => (
          <div key={field.key} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                {field.label}
              </label>
              <p className="text-gray-600 text-sm mb-4">{field.description}</p>
            </div>
            
            <textarea
              value={migrationData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="form-input resize-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Ändringar sparas automatiskt
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sparar...
            </>
          ) : (
            'Markera som slutförd'
          )}
        </button>
      </div>
    </div>
  );
};

export default Migration;

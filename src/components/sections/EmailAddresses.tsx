import React, { useState } from 'react';
import { OnboardingProject, EmailAddress } from '../../types';

interface EmailAddressesProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const EmailAddresses: React.FC<EmailAddressesProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const [emailAddresses, setEmailAddresses] = useState<EmailAddress[]>(
    project.emailAddresses
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState({
    name: '',
    email: '',
    associatedGroup: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddEmail = () => {
    if (!newEmail.name || !newEmail.email) {
      alert('Namn och e-postadress är obligatoriska');
      return;
    }

    if (!isValidEmail(newEmail.email)) {
      alert('Ange en giltig e-postadress');
      return;
    }

    const emailAddress: EmailAddress = {
      id: generateId(),
      ...newEmail,
    };

    const updatedEmails = [...emailAddresses, emailAddress];
    setEmailAddresses(updatedEmails);
    onUpdateProject({ emailAddresses: updatedEmails });

    setNewEmail({ name: '', email: '', associatedGroup: '' });
    setShowAddModal(false);
  };

  const handleDeleteEmail = (id: string) => {
    const updatedEmails = emailAddresses.filter(email => email.id !== id);
    setEmailAddresses(updatedEmails);
    onUpdateProject({ emailAddresses: updatedEmails });
  };

  const handleEditEmail = (id: string, field: keyof EmailAddress, value: string) => {
    const updatedEmails = emailAddresses.map(email =>
      email.id === id ? { ...email, [field]: value } : email
    );
    setEmailAddresses(updatedEmails);
    onUpdateProject({ emailAddresses: updatedEmails });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProject({ emailAddresses });
      await onMarkCompleted('email-addresses');
    } catch (error) {
      console.error('Failed to save email addresses:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get available groups from the project
  const availableGroups = project.groups.map(group => group.name);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instruktioner</h3>
            <p className="text-blue-700 text-sm">
              Lägg till alla e-postadresser som ska användas för support. 
              Varje e-postadress kan kopplas till en specifik grupp för rätt routing av ärenden.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">E-postadresser</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Lägg till e-postadress
          </button>
        </div>

        {emailAddresses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p>Inga e-postadresser har lagts till ännu</p>
            <p className="text-sm">Klicka på "Lägg till e-postadress" för att komma igång</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Namn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-postadress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tillhörande grupp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailAddresses.map((emailAddress) => (
                  <tr key={emailAddress.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={emailAddress.name}
                        onChange={(e) => handleEditEmail(emailAddress.id, 'name', e.target.value)}
                        className="form-input text-sm"
                        placeholder="Namn"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="email"
                        value={emailAddress.email}
                        onChange={(e) => handleEditEmail(emailAddress.id, 'email', e.target.value)}
                        className="form-input text-sm"
                        placeholder="email@example.com"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={emailAddress.associatedGroup}
                        onChange={(e) => handleEditEmail(emailAddress.id, 'associatedGroup', e.target.value)}
                        className="form-input text-sm"
                      >
                        <option value="">Välj grupp</option>
                        {availableGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteEmail(emailAddress.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Email Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lägg till ny e-postadress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Namn *
                  </label>
                  <input
                    type="text"
                    value={newEmail.name}
                    onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                    className="form-input"
                    placeholder="T.ex. Support"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-postadress *
                  </label>
                  <input
                    type="email"
                    value={newEmail.email}
                    onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                    className="form-input"
                    placeholder="support@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tillhörande grupp
                  </label>
                  <select
                    value={newEmail.associatedGroup}
                    onChange={(e) => setNewEmail({ ...newEmail, associatedGroup: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Välj grupp</option>
                    {availableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {availableGroups.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Skapa grupper i sektionen "Agenter & Grupper" först
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleAddEmail}
                  className="btn-primary"
                >
                  Lägg till
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {emailAddresses.length} e-postadress(er) konfigurerade
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || emailAddresses.length === 0}
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

export default EmailAddresses;

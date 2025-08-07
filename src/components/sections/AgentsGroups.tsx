import React, { useState } from 'react';
import { OnboardingProject, Group, Agent } from '../../types';

interface AgentsGroupsProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const AgentsGroups: React.FC<AgentsGroupsProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const [groups, setGroups] = useState<Group[]>(project.groups);
  const [agents, setAgents] = useState<Agent[]>(project.agents);
  const [activeTab, setActiveTab] = useState<'groups' | 'agents'>('groups');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    language: 'sv',
    timezone: 'Europe/Stockholm',
    associatedGroups: [] as string[],
    signature: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddGroup = () => {
    if (!newGroup.name) {
      alert('Gruppnamn är obligatoriskt');
      return;
    }

    const group: Group = {
      id: generateId(),
      ...newGroup,
    };

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    onUpdateProject({ groups: updatedGroups });

    setNewGroup({ name: '', description: '' });
    setShowGroupModal(false);
  };

  const handleDeleteGroup = (id: string) => {
    const updatedGroups = groups.filter(group => group.id !== id);
    setGroups(updatedGroups);
    onUpdateProject({ groups: updatedGroups });
  };

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.email) {
      alert('Namn och e-postadress är obligatoriska');
      return;
    }

    const agent: Agent = {
      id: generateId(),
      ...newAgent,
    };

    const updatedAgents = [...agents, agent];
    setAgents(updatedAgents);
    onUpdateProject({ agents: updatedAgents });

    setNewAgent({
      name: '',
      email: '',
      role: '',
      phone: '',
      language: 'sv',
      timezone: 'Europe/Stockholm',
      associatedGroups: [],
      signature: '',
    });
    setShowAgentModal(false);
  };

  const handleDeleteAgent = (id: string) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    setAgents(updatedAgents);
    onUpdateProject({ agents: updatedAgents });
  };

  const handleGroupToggle = (groupName: string) => {
    const associatedGroups = newAgent.associatedGroups.includes(groupName)
      ? newAgent.associatedGroups.filter(g => g !== groupName)
      : [...newAgent.associatedGroups, groupName];
    
    setNewAgent({ ...newAgent, associatedGroups });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProject({ groups, agents });
      await onMarkCompleted('agents-groups');
    } catch (error) {
      console.error('Failed to save agents and groups:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instruktioner</h3>
            <p className="text-blue-700 text-sm">
              Skapa först grupper för att organisera supportteamet, sedan lägg till agenter 
              och koppla dem till rätt grupper. Detta påverkar ärendefördelning och behörigheter.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'groups'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Grupper ({groups.length})
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'agents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agenter ({agents.length})
            </button>
          </nav>
        </div>

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Supportgrupper</h3>
              <button
                onClick={() => setShowGroupModal(true)}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Lägg till grupp
              </button>
            </div>

            {groups.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Inga grupper har skapats ännu</p>
                <p className="text-sm">Skapa grupper för att organisera supportteamet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gruppnamn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beskrivning
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Åtgärder
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {group.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {group.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteGroup(group.id)}
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
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Supportagenter</h3>
              <button
                onClick={() => setShowAgentModal(true)}
                className="btn-primary"
                disabled={groups.length === 0}
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Lägg till agent
              </button>
            </div>

            {groups.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Skapa grupper först innan du lägger till agenter</p>
              </div>
            ) : agents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p>Inga agenter har lagts till ännu</p>
                <p className="text-sm">Lägg till supportagenter och koppla dem till grupper</p>
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
                        E-post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupper
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Åtgärder
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {agent.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {agent.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {agent.role}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {agent.associatedGroups.join(', ') || 'Ingen grupp'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
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
        )}
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lägg till ny grupp
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gruppnamn *
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="form-input"
                    placeholder="T.ex. IT-Support"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beskrivning
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="form-input"
                    rows={3}
                    placeholder="Beskrivning av gruppens ansvar..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="btn-secondary"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleAddGroup}
                  className="btn-primary"
                >
                  Lägg till
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lägg till ny agent
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Namn *
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="form-input"
                    placeholder="Förnamn Efternamn"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-postadress *
                  </label>
                  <input
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    className="form-input"
                    placeholder="agent@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll/Behörighet
                  </label>
                  <select
                    value={newAgent.role}
                    onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Välj roll</option>
                    <option value="Agent">Agent</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tillhörande grupper
                  </label>
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <label key={group.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAgent.associatedGroups.includes(group.name)}
                          onChange={() => handleGroupToggle(group.name)}
                          className="mr-2"
                        />
                        <span className="text-sm">{group.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAgentModal(false)}
                  className="btn-secondary"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleAddAgent}
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
          {groups.length} grupp(er) och {agents.length} agent(er) konfigurerade
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

export default AgentsGroups;

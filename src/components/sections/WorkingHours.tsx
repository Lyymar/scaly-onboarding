import React, { useState } from 'react';
import { OnboardingProject, WorkingHours } from '../../types';

interface WorkingHoursProps {
  project: OnboardingProject;
  onUpdateProject: (updates: Partial<OnboardingProject>) => Promise<void>;
  onMarkCompleted: (sectionId: string) => Promise<void>;
}

const WorkingHoursComponent: React.FC<WorkingHoursProps> = ({
  project,
  onUpdateProject,
  onMarkCompleted,
}) => {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    project.workingHours
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkingHours, setNewWorkingHours] = useState({
    timezone: 'Europe/Stockholm',
    name: '',
    weekdays: [] as string[],
    fromTime: '09:00',
    toTime: '17:00',
    group: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    'Europe/Stockholm',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
  ];

  const weekdayOptions = [
    'Måndag',
    'Tisdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lördag',
    'Söndag',
  ];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddWorkingHours = () => {
    if (!newWorkingHours.name || newWorkingHours.weekdays.length === 0) {
      alert('Namn och veckodag(ar) är obligatoriska');
      return;
    }

    const workingHoursEntry: WorkingHours = {
      id: generateId(),
      ...newWorkingHours,
    };

    const updatedHours = [...workingHours, workingHoursEntry];
    setWorkingHours(updatedHours);
    onUpdateProject({ workingHours: updatedHours });

    setNewWorkingHours({
      timezone: 'Europe/Stockholm',
      name: '',
      weekdays: [],
      fromTime: '09:00',
      toTime: '17:00',
      group: '',
    });
    setShowAddModal(false);
  };

  const handleDeleteWorkingHours = (id: string) => {
    const updatedHours = workingHours.filter(hours => hours.id !== id);
    setWorkingHours(updatedHours);
    onUpdateProject({ workingHours: updatedHours });
  };

  const handleWeekdayToggle = (weekday: string) => {
    const weekdays = newWorkingHours.weekdays.includes(weekday)
      ? newWorkingHours.weekdays.filter(day => day !== weekday)
      : [...newWorkingHours.weekdays, weekday];
    
    setNewWorkingHours({ ...newWorkingHours, weekdays });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProject({ workingHours });
      await onMarkCompleted('working-hours');
    } catch (error) {
      console.error('Failed to save working hours:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const availableGroups = project.groups.map(group => group.name);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instruktioner</h3>
            <p className="text-blue-700 text-sm">
              Definiera arbetstider för olika supportgrupper. Detta påverkar SLA-beräkningar 
              och automatiska svar utanför arbetstid.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Arbetstider</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Lägg till arbetstid
          </button>
        </div>

        {workingHours.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Inga arbetstider har definierats ännu</p>
            <p className="text-sm">Klicka på "Lägg till arbetstid" för att komma igång</p>
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
                    Tidszon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veckodagar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Åtgärder
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workingHours.map((hours) => (
                  <tr key={hours.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {hours.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hours.timezone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {hours.weekdays.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hours.fromTime} - {hours.toTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hours.group || 'Ingen grupp'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteWorkingHours(hours.id)}
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

      {/* Add Working Hours Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lägg till arbetstid
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Namn *
                  </label>
                  <input
                    type="text"
                    value={newWorkingHours.name}
                    onChange={(e) => setNewWorkingHours({ ...newWorkingHours, name: e.target.value })}
                    className="form-input"
                    placeholder="T.ex. Telefonsupport"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tidszon
                  </label>
                  <select
                    value={newWorkingHours.timezone}
                    onChange={(e) => setNewWorkingHours({ ...newWorkingHours, timezone: e.target.value })}
                    className="form-input"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veckodagar *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekdayOptions.map((weekday) => (
                      <label key={weekday} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newWorkingHours.weekdays.includes(weekday)}
                          onChange={() => handleWeekdayToggle(weekday)}
                          className="mr-2"
                        />
                        <span className="text-sm">{weekday}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Från
                    </label>
                    <input
                      type="time"
                      value={newWorkingHours.fromTime}
                      onChange={(e) => setNewWorkingHours({ ...newWorkingHours, fromTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Till
                    </label>
                    <input
                      type="time"
                      value={newWorkingHours.toTime}
                      onChange={(e) => setNewWorkingHours({ ...newWorkingHours, toTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupp
                  </label>
                  <select
                    value={newWorkingHours.group}
                    onChange={(e) => setNewWorkingHours({ ...newWorkingHours, group: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Välj grupp</option>
                    {availableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
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
                  onClick={handleAddWorkingHours}
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
          {workingHours.length} arbetstid(er) konfigurerade
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

export default WorkingHoursComponent;

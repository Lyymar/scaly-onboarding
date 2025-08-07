import React from 'react';
import { NavigationSection } from '../types';

interface SidebarProps {
  sections: NavigationSection[];
  currentSection: string;
  completedSections: string[];
  onSectionChange: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  currentSection,
  completedSections,
  onSectionChange,
}) => {
  return (
    <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">Scaly Onboarding</h1>
        <p className="text-sm text-gray-600 mt-2">
          Customer Onboarding Configuration
        </p>
      </div>
      
      <nav className="py-4">
        {sections.map((section) => {
          const isActive = currentSection === section.id;
          const isCompleted = completedSections.includes(section.id);
          
          return (
            <div
              key={section.id}
              className={`sidebar-item ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              onClick={() => onSectionChange(section.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 mr-3">
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          isActive
                            ? 'border-white bg-white'
                            : 'border-gray-300 bg-transparent'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{section.title}</div>
                  </div>
                </div>
                {isActive && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-200 mt-auto">
        <div className="text-xs text-gray-500">
          <div className="flex justify-between mb-2">
            <span>Progress:</span>
            <span>
              {completedSections.length} / {sections.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(completedSections.length / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

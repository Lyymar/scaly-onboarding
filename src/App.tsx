import React, { useState, useEffect } from 'react';
import { navigationSections } from './navigationConfig';
import { OnboardingProject } from './types';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { initializeProject, saveProject, loadProject } from './utils/storage';

function App() {
  const [currentSection, setCurrentSection] = useState('overview');
  const [project, setProject] = useState<OnboardingProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize or load existing project
    const initProject = async () => {
      try {
        // Get project ID from URL or create new one
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id') || generateProjectId();
        
        let loadedProject = await loadProject(projectId);
        if (!loadedProject) {
          loadedProject = initializeProject(projectId);
          await saveProject(loadedProject);
        }
        
        setProject(loadedProject);
        setLoading(false);
        
        // Update URL with project ID if not present
        if (!urlParams.get('id')) {
          const newUrl = `${window.location.pathname}?id=${projectId}`;
          window.history.replaceState({}, '', newUrl);
        }
      } catch (error) {
        console.error('Failed to initialize project:', error);
        setLoading(false);
      }
    };

    initProject();
  }, []);

  const generateProjectId = (): string => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const updateProject = async (updates: Partial<OnboardingProject>) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    
    setProject(updatedProject);
    await saveProject(updatedProject);
  };

  const markSectionCompleted = async (sectionId: string) => {
    if (!project) return;
    
    const completedSections = [...project.completedSections];
    if (!completedSections.includes(sectionId)) {
      completedSections.push(sectionId);
      await updateProject({ completedSections });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your onboarding project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load project. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sections={navigationSections}
        currentSection={currentSection}
        completedSections={project.completedSections}
        onSectionChange={setCurrentSection}
      />
      <MainContent
        currentSection={currentSection}
        project={project}
        onUpdateProject={updateProject}
        onMarkCompleted={markSectionCompleted}
      />
    </div>
  );
}

export default App;

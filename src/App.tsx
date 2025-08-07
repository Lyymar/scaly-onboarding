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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrCreateProject = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (projectId) {
          // Try to load existing project
          const existingProject = await loadProject(projectId);
          if (existingProject) {
            setProject(existingProject);
            setLoading(false);
            return;
          }
        }
        
        // Create new project if no ID provided or project not found
        const newProject = await initializeProject(projectId || undefined);
        setProject(newProject);
        
        // Update URL with new project ID if none was provided
        if (!projectId) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('id', newProject.id);
          window.history.replaceState({}, '', newUrl.toString());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load or create project:', error);
        setError('Failed to load project. Please try again.');
        setLoading(false);
      }
    };
    
    loadOrCreateProject();
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

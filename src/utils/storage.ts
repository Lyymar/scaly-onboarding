import { OnboardingProject } from '../types';

// For now, we'll use localStorage for persistence
// Later this will be replaced with Render backend API calls

export const initializeProject = (id: string): OnboardingProject => {
  return {
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    completedSections: [],
    
    // Initialize empty data structures
    migrationData: {
      antalAr: '',
      arende: '',
      bilagorIArenden: '',
      kontakter: '',
      foretag: '',
      agenter: '',
      grupper: '',
      slaRegler: '',
      losningsartiklar: '',
      rapporter: '',
      anpassningar: '',
    },
    emailAddresses: [],
    workingHours: [],
    groups: [],
    agents: [],
    slaPolicy: [],
    contactFields: [],
    ticketFields: [],
    ticketForms: [],
    predefinedForms: [],
    cannedResponses: [],
    solutionArticles: [],
    automations: [],
    csatConfig: {
      surveyQuestion: '',
      thankYouMessage: '',
      sendTrigger: '',
      choices: [],
    },
    portalSettings: {
      defaultLanguage: 'sv',
      supportedLanguages: ['sv'],
      enableCaptcha: false,
      allowGuestTickets: true,
      ticketCreationForGuests: true,
      displayKnowledgeBase: true,
    },
    integrations: [],
    reports: [],
  };
};

export const saveProject = async (project: OnboardingProject): Promise<void> => {
  try {
    // For now, save to localStorage
    // Later this will be replaced with API call to Render backend
    const projectData = {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
    
    localStorage.setItem(`onboarding_project_${project.id}`, JSON.stringify(projectData));
    
    // Also save to a list of all projects for future reference
    const projectsList = getProjectsList();
    if (!projectsList.includes(project.id)) {
      projectsList.push(project.id);
      localStorage.setItem('onboarding_projects_list', JSON.stringify(projectsList));
    }
    
    console.log('Project saved successfully:', project.id);
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

export const loadProject = async (id: string): Promise<OnboardingProject | null> => {
  try {
    // For now, load from localStorage
    // Later this will be replaced with API call to Render backend
    const projectData = localStorage.getItem(`onboarding_project_${id}`);
    
    if (!projectData) {
      return null;
    }
    
    const parsed = JSON.parse(projectData);
    
    // Convert date strings back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
};

export const getProjectsList = (): string[] => {
  try {
    const projectsList = localStorage.getItem('onboarding_projects_list');
    return projectsList ? JSON.parse(projectsList) : [];
  } catch (error) {
    console.error('Failed to get projects list:', error);
    return [];
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    localStorage.removeItem(`onboarding_project_${id}`);
    
    const projectsList = getProjectsList();
    const updatedList = projectsList.filter(projectId => projectId !== id);
    localStorage.setItem('onboarding_projects_list', JSON.stringify(updatedList));
    
    console.log('Project deleted successfully:', id);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

// Utility function to generate a shareable link
export const generateShareableLink = (projectId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}?id=${projectId}`;
};

// Auto-save functionality
export const setupAutoSave = (
  project: OnboardingProject,
  updateCallback: (project: OnboardingProject) => void
) => {
  const autoSaveInterval = setInterval(async () => {
    try {
      await saveProject(project);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 30000); // Auto-save every 30 seconds

  return () => clearInterval(autoSaveInterval);
};

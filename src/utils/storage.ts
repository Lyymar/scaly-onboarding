import { OnboardingProject } from '../types';

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com/api' // Will be updated when deployed
  : 'http://localhost:5001/api';

// API Helper function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const initializeProject = async (id?: string): Promise<OnboardingProject> => {
  try {
    // Create a new project via API
    const project = await apiCall('/projects', {
      method: 'POST',
    });
    
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
  } catch (error) {
    console.error('Failed to initialize project via API, falling back to localStorage:', error);
    
    // Fallback to localStorage if API is not available
    const projectId = id || Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    
    const project: OnboardingProject = {
      id: projectId,
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
    
    // Save to localStorage as fallback
    await saveProjectToLocalStorage(project);
    return project;
  }
};

export const saveProject = async (project: OnboardingProject): Promise<void> => {
  try {
    // Try to save via API first
    const updatedProject = await apiCall(`/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
    
    console.log('Project saved successfully via API:', project.id);
  } catch (error) {
    console.error('Failed to save project via API, falling back to localStorage:', error);
    
    // Fallback to localStorage if API is not available
    await saveProjectToLocalStorage(project);
  }
};

export const loadProject = async (id: string): Promise<OnboardingProject | null> => {
  try {
    // Try to load via API first
    const project = await apiCall(`/projects/${id}`);
    
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load project via API, trying localStorage:', error);
    
    // Fallback to localStorage if API is not available
    return await loadProjectFromLocalStorage(id);
  }
};

export const getProjectsList = async (): Promise<string[]> => {
  try {
    // Try to get projects list via API
    const projects = await apiCall('/projects');
    return projects.map((p: any) => p.id);
  } catch (error) {
    console.error('Failed to get projects list via API, trying localStorage:', error);
    
    // Fallback to localStorage
    return getProjectsListFromLocalStorage();
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    // Try to delete via API first
    await apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Project deleted successfully via API:', id);
  } catch (error) {
    console.error('Failed to delete project via API, trying localStorage:', error);
    
    // Fallback to localStorage
    await deleteProjectFromLocalStorage(id);
  }
};

// LocalStorage fallback functions
const saveProjectToLocalStorage = async (project: OnboardingProject): Promise<void> => {
  try {
    const projectData = {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
    
    localStorage.setItem(`onboarding_project_${project.id}`, JSON.stringify(projectData));
    
    // Also save to a list of all projects for future reference
    const projectsList = getProjectsListFromLocalStorage();
    if (!projectsList.includes(project.id)) {
      projectsList.push(project.id);
      localStorage.setItem('onboarding_projects_list', JSON.stringify(projectsList));
    }
    
    console.log('Project saved to localStorage:', project.id);
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
    throw error;
  }
};

const loadProjectFromLocalStorage = async (id: string): Promise<OnboardingProject | null> => {
  try {
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
    console.error('Failed to load project from localStorage:', error);
    return null;
  }
};

const getProjectsListFromLocalStorage = (): string[] => {
  try {
    const projectsList = localStorage.getItem('onboarding_projects_list');
    return projectsList ? JSON.parse(projectsList) : [];
  } catch (error) {
    console.error('Failed to get projects list from localStorage:', error);
    return [];
  }
};

const deleteProjectFromLocalStorage = async (id: string): Promise<void> => {
  try {
    localStorage.removeItem(`onboarding_project_${id}`);
    
    const projectsList = getProjectsListFromLocalStorage();
    const updatedList = projectsList.filter(projectId => projectId !== id);
    localStorage.setItem('onboarding_projects_list', JSON.stringify(updatedList));
    
    console.log('Project deleted from localStorage:', id);
  } catch (error) {
    console.error('Failed to delete project from localStorage:', error);
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

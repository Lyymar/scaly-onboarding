const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'onboarding.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'draft',
      completed_sections TEXT DEFAULT '[]',
      data TEXT NOT NULL
    )
  `;

  db.run(createProjectsTable, (err) => {
    if (err) {
      console.error('Error creating projects table:', err.message);
    } else {
      console.log('Projects table ready');
    }
  });
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Scaly Onboarding API is running' });
});

// Get all projects (for admin purposes)
app.get('/api/projects', (req, res) => {
  const query = 'SELECT id, created_at, updated_at, status, completed_sections FROM projects ORDER BY updated_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err.message);
      res.status(500).json({ error: 'Failed to fetch projects' });
      return;
    }
    
    const projects = rows.map(row => ({
      ...row,
      completed_sections: JSON.parse(row.completed_sections)
    }));
    
    res.json(projects);
  });
});

// Get a specific project
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM projects WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching project:', err.message);
      res.status(500).json({ error: 'Failed to fetch project' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    
    try {
      const project = {
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        status: row.status,
        completedSections: JSON.parse(row.completed_sections),
        ...JSON.parse(row.data)
      };
      
      res.json(project);
    } catch (parseErr) {
      console.error('Error parsing project data:', parseErr.message);
      res.status(500).json({ error: 'Invalid project data' });
    }
  });
});

// Create a new project
app.post('/api/projects', (req, res) => {
  const projectId = uuidv4();
  const now = new Date().toISOString();
  
  const defaultProject = {
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
  
  const query = `
    INSERT INTO projects (id, created_at, updated_at, status, completed_sections, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    projectId,
    now,
    now,
    'draft',
    JSON.stringify([]),
    JSON.stringify(defaultProject)
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error creating project:', err.message);
      res.status(500).json({ error: 'Failed to create project' });
      return;
    }
    
    const project = {
      id: projectId,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      completedSections: [],
      ...defaultProject
    };
    
    res.status(201).json(project);
  });
});

// Update a project
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const now = new Date().toISOString();
  
  // First, get the current project
  const getQuery = 'SELECT * FROM projects WHERE id = ?';
  
  db.get(getQuery, [id], (err, row) => {
    if (err) {
      console.error('Error fetching project for update:', err.message);
      res.status(500).json({ error: 'Failed to fetch project' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    
    try {
      // Parse current data and merge with updates
      const currentData = JSON.parse(row.data);
      const currentCompletedSections = JSON.parse(row.completed_sections);
      
      // Extract special fields from updates
      const { completedSections, status, ...dataUpdates } = updates;
      
      // Merge data
      const updatedData = { ...currentData, ...dataUpdates };
      const updatedCompletedSections = completedSections || currentCompletedSections;
      const updatedStatus = status || row.status;
      
      // Update the database
      const updateQuery = `
        UPDATE projects 
        SET updated_at = ?, status = ?, completed_sections = ?, data = ?
        WHERE id = ?
      `;
      
      const params = [
        now,
        updatedStatus,
        JSON.stringify(updatedCompletedSections),
        JSON.stringify(updatedData),
        id
      ];
      
      db.run(updateQuery, params, function(err) {
        if (err) {
          console.error('Error updating project:', err.message);
          res.status(500).json({ error: 'Failed to update project' });
          return;
        }
        
        const project = {
          id,
          createdAt: row.created_at,
          updatedAt: now,
          status: updatedStatus,
          completedSections: updatedCompletedSections,
          ...updatedData
        };
        
        res.json(project);
      });
      
    } catch (parseErr) {
      console.error('Error parsing project data for update:', parseErr.message);
      res.status(500).json({ error: 'Invalid project data' });
    }
  });
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM projects WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting project:', err.message);
      res.status(500).json({ error: 'Failed to delete project' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    
    res.json({ message: 'Project deleted successfully' });
  });
});

// Generate shareable link
app.post('/api/projects/:id/share', (req, res) => {
  const { id } = req.params;
  const baseUrl = req.get('origin') || `http://localhost:3000`;
  const shareableLink = `${baseUrl}?id=${id}`;
  
  res.json({ shareableLink });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Scaly Onboarding API server running on port ${PORT}`);
});

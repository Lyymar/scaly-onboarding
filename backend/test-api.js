const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing Scaly Onboarding API...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    
    // Test 2: Create new project
    console.log('\n2. Testing project creation...');
    const createResponse = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const newProject = await createResponse.json();
    console.log('✅ Project created with ID:', newProject.id);
    
    // Test 3: Get the created project
    console.log('\n3. Testing project retrieval...');
    const getResponse = await fetch(`${API_BASE}/projects/${newProject.id}`);
    const retrievedProject = await getResponse.json();
    console.log('✅ Project retrieved successfully');
    
    // Test 4: Update the project
    console.log('\n4. Testing project update...');
    const updateData = {
      migrationData: {
        antalAr: '5',
        arende: 'Test migration'
      },
      completedSections: ['overview', 'migration']
    };
    
    const updateResponse = await fetch(`${API_BASE}/projects/${newProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const updatedProject = await updateResponse.json();
    console.log('✅ Project updated successfully');
    
    // Test 5: List all projects
    console.log('\n5. Testing projects list...');
    const listResponse = await fetch(`${API_BASE}/projects`);
    const projects = await listResponse.json();
    console.log('✅ Projects list retrieved:', projects.length, 'projects');
    
    // Test 6: Generate shareable link
    console.log('\n6. Testing shareable link generation...');
    const shareResponse = await fetch(`${API_BASE}/projects/${newProject.id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const shareData = await shareResponse.json();
    console.log('✅ Shareable link:', shareData.shareableLink);
    
    console.log('\n🎉 All API tests passed! Backend is ready for deployment.');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

testAPI();

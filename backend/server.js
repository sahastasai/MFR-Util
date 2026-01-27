import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readCACData } from './cacReader.js';
import { initializeAD, lookupUserInAD } from './adLookup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Active Directory
const adAvailable = initializeAD();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MFR Backend running' });
});

// CAC Reader endpoint
app.get('/api/cac-data', async (req, res) => {
  try {
    const result = await readCACData();
    
    if (result.success && result.data) {
      // Try to look up additional info in AD
      const adData = await lookupUserInAD(result.data.name, result.data.uid);
      
      if (adData && adData.rank) {
        // Merge AD data with CAC data
        result.data.rank = adData.rank;
        result.data.title = adData.title || result.data.title;
        result.adLookup = true;
      }

      res.json({
        success: true,
        data: result.data,
        adLookup: adData ? true : false
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (err) {
    console.error('Error in /api/cac-data:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message
    });
  }
});

// Test endpoint to verify backend is working
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working correctly'
  });
});

// Debug endpoint to see CAC reader logs
app.get('/api/cac-debug', async (req, res) => {
  try {
    console.log('\n=== CAC Debug Request ===');
    const result = await readCACData();
    console.log('Result:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MFR Backend running on http://localhost:${PORT}`);
  console.log(`CAC Reader available at http://localhost:${PORT}/api/cac-data`);
});

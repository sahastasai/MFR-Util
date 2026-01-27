// src/App.jsx
import { Buffer } from 'buffer';
import process from 'process';
import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { MfrDocument } from './MfrDocument';

window.Buffer = Buffer;
window.process = process;

// Military ranks dropdown options
const RANKS = [
  'BGen', 'Col', 'Lt Col', 'Maj', 'Capt', '1stLt', '2ndLt',
  'MSgt', 'TSgt', 'SSgt', 'SrA', 'A1C', 'Amn', 'Cpl', 'LCpl'
];

// 1. Initial Mock Data
const initialData = {
  unit: "452D AIR MOBILITY WING",
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join(' '),
  recipient: "All Personnel",
  subject: "Operational Launch of MFR Utility",
  authorFirstName: "JASKARAN",
  authorLastName: "SHEKHON",
  authorMiddleInitial: "S",
  authorRank: "Col",
  authorBranch: "USAF",
  authorTitle: "Commander",
  paragraphs: [
    { number: "1.", level: 0, text: "The MFR Utility is now operational on your local machine." },
    { number: "2.", level: 0, text: "This renderer uses a component-based architecture." },
    { number: "a.", level: 1, text: "Vectors are crisp and selectable." },
    { number: "b.", level: 1, text: "Margins are strictly enforced at 1 inch." },
    { number: "3.", level: 0, text: "Scroll down to see the signature block." },
  ]
};

function App() {
  const [mfrData, setMfrData] = useState(initialData);
  const [formData, setFormData] = useState({
    firstName: 'JASKARAN',
    lastName: 'SHEKHON',
    middleInitial: 'S',
    rank: 'Col',
    branch: 'USAF',
    title: '',
    unit: '452D AIR MOBILITY WING'
  });
  const [cacStatus, setCacStatus] = useState('loading');
  const [showForm, setShowForm] = useState(false);

  // Fetch CAC data on component mount
  useEffect(() => {
    const fetchCACData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/cac-data');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Update form with CAC data
          setFormData(prev => ({
            ...prev,
            firstName: result.data.firstName || prev.firstName,
            lastName: result.data.lastName || prev.lastName,
            middleInitial: result.data.middleInitial || prev.middleInitial,
            branch: result.data.branch || prev.branch,
            unit: result.data.affiliation || prev.unit
          }));
          setCacStatus('success');
          updatePDFFromForm(result.data);
        } else {
          setCacStatus('unavailable');
          console.log('CAC not available:', result.message);
        }
      } catch (err) {
        setCacStatus('unavailable');
        console.log('Backend not available. CAC reader disabled.');
      }
    };

    fetchCACData();
  }, []);

  const updatePDFFromForm = (data) => {
    setMfrData(prev => ({
      ...prev,
      authorFirstName: data.firstName || formData.firstName,
      authorLastName: data.lastName || formData.lastName,
      authorMiddleInitial: data.middleInitial || formData.middleInitial,
      authorRank: data.rank || formData.rank,
      authorBranch: data.branch || formData.branch,
      authorTitle: data.title || formData.title,
      unit: data.unit || formData.unit
    }));
  };

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updatePDFFromForm(updated);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '18px' }}>
            Official MFR Preview
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
            {cacStatus === 'success' && '✓ CAC Data Loaded'}
            {cacStatus === 'unavailable' && '⚠ Manual Entry Mode'}
            {cacStatus === 'loading' && '⏳ Reading CAC...'}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'sans-serif'
          }}
        >
          {showForm ? 'Hide' : 'Edit'} Form
        </button>
      </div>

      {showForm && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #ddd',
          overflowY: 'auto',
          maxHeight: '280px',
          fontFamily: 'sans-serif',
          fontSize: '13px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>First Name</div>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Last Name</div>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Middle Initial</div>
              <input 
                type="text" 
                maxLength="1"
                value={formData.middleInitial}
                onChange={(e) => handleFormChange('middleInitial', e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Rank</div>
              <select 
                value={formData.rank}
                onChange={(e) => handleFormChange('rank', e.target.value)}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              >
                <option value="">-- Select Rank --</option>
                {RANKS.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </label>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Branch</div>
              <select 
                value={formData.branch}
                onChange={(e) => handleFormChange('branch', e.target.value)}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              >
                <option value="USAF">USAF</option>
                <option value="USA">USA</option>
                <option value="USN">USN</option>
                <option value="USMC">USMC</option>
                <option value="USCG">USCG</option>
                <option value="DND">DND</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Title</div>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Unit/Organization</div>
              <input 
                type="text" 
                value={formData.unit}
                onChange={(e) => handleFormChange('unit', e.target.value)}
                style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
              />
            </label>
          </div>
        </div>
      )}
      
      {/* The PDF Viewer acts like an iframe showing the PDF */}
      <PDFViewer style={{ width: '100%', flex: 1 }}>
        <MfrDocument data={mfrData} />
      </PDFViewer>
    </div>
  );
}

export default App;
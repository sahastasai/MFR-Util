// src/App.jsx
import { Buffer } from 'buffer';
import process from 'process';
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { MfrDocument } from './MfrDocument';

window.Buffer = Buffer;
window.process = process;

// 1. Mock Data (This would come from your form inputs later)
const mockData = {
  unit: "452D AIR MOBILITY WING",
  date: "26 Jan 2026",
  recipient: "All Personnel",
  subject: "Operational Launch of MFR Utility",
  authorName: "JOHN Y. DOE",
  authorRank: "Col",
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
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        Official MFR Preview
      </h2>
      
      {/* The PDF Viewer acts like an iframe showing the PDF */}
      <PDFViewer style={{ width: '100%', flex: 1 }}>
        <MfrDocument data={mockData} />
      </PDFViewer>
    </div>
  );
}

export default App;
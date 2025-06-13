import React, { useState } from 'react';
import SymptomForm from './components/SymptomForm';
import RiskAssessment from './components/RiskAssessment';
import GeminiAdvice from './components/GeminiAdvice';
import { PatientData, RiskLevel } from './types';

type Page = 'form' | 'assessment' | 'advice';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('form');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');

  const handleFormSubmit = (data: PatientData) => {
    setPatientData(data);
    
    // Risk assessment logic
    const selectedSymptoms = data.symptoms.filter(s => s.selected);
    const symptomCount = selectedSymptoms.length;
    const hasCriticalSymptom = selectedSymptoms.some(s => s.name === 'difficulty breathing');
    
    let risk: RiskLevel;
    if (hasCriticalSymptom || symptomCount >= 4) {
      risk = 'high';
    } else if (symptomCount >= 2) {
      risk = 'moderate';
    } else {
      risk = 'low';
    }
    
    setRiskLevel(risk);
    setCurrentPage('assessment');
  };

  const handleGetAdvice = () => {
    setCurrentPage('advice');
  };

  const handleRestart = () => {
    setPatientData(null);
    setRiskLevel('low');
    setCurrentPage('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            MedAgent Lite
          </h1>
          <p className="text-gray-600 text-lg">
            Medical Triage Assessment Tool
          </p>
        </header>

        <main>
          {currentPage === 'form' && (
            <SymptomForm onSubmit={handleFormSubmit} />
          )}
          
          {currentPage === 'assessment' && patientData && (
            <RiskAssessment
              patientData={patientData}
              riskLevel={riskLevel}
              onGetAdvice={handleGetAdvice}
              onRestart={handleRestart}
            />
          )}
          
          {currentPage === 'advice' && patientData && (
            <GeminiAdvice
              patientData={patientData}
              onRestart={handleRestart}
            />
          )}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>
            ⚠️ This tool is for informational purposes only and does not replace professional medical advice.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
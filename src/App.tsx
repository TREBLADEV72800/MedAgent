import React, { useState } from 'react';
import InitialAssessment from './components/InitialAssessment';
import RiskAssessment from './components/RiskAssessment';
import AIConsultation from './components/AIConsultation';
import { PatientData, RiskLevel } from './types';

type Page = 'assessment' | 'risk' | 'consultation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('assessment');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('LOW');

  const calculateRiskLevel = (data: PatientData): RiskLevel => {
    const selectedSymptoms = data.symptoms.filter(s => s.selected);
    const symptomCount = selectedSymptoms.length;
    const hasShortnessBreath = selectedSymptoms.some(s => s.name === 'shortness_breath');
    
    if (hasShortnessBreath || symptomCount >= 4) {
      return 'HIGH';
    } else if (symptomCount >= 2) {
      return 'MODERATE';
    } else {
      return 'LOW';
    }
  };

  const handleAssessmentSubmit = (data: PatientData) => {
    setPatientData(data);
    const risk = calculateRiskLevel(data);
    setRiskLevel(risk);
    setCurrentPage('risk');
  };

  const handleRiskComplete = () => {
    setCurrentPage('consultation');
  };

  const handleStartOver = () => {
    setPatientData(null);
    setRiskLevel('LOW');
    setCurrentPage('assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            MedAgent
          </h1>
          <p className="text-gray-600 text-lg">
            Symptom Assessment & Medical Guidance
          </p>
        </header>

        <main>
          {currentPage === 'assessment' && (
            <InitialAssessment onSubmit={handleAssessmentSubmit} />
          )}
          
          {currentPage === 'risk' && patientData && (
            <RiskAssessment
              patientData={patientData}
              riskLevel={riskLevel}
              onComplete={handleRiskComplete}
            />
          )}
          
          {currentPage === 'consultation' && patientData && (
            <AIConsultation
              patientData={patientData}
              riskLevel={riskLevel}
              onStartOver={handleStartOver}
            />
          )}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>
            ⚠️ This tool provides general guidance only and does not replace professional medical advice.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
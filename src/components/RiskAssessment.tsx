import React from 'react';
import { PatientData, RiskLevel, RiskInfo } from '../types';

interface RiskAssessmentProps {
  patientData: PatientData;
  riskLevel: RiskLevel;
  onGetAdvice: () => void;
  onRestart: () => void;
}

const RISK_INFO: Record<RiskLevel, RiskInfo> = {
  low: {
    level: 'low',
    color: 'text-green-800',
    bgColor: 'bg-green-100 border-green-200',
    message: 'Monitor your condition and rest. Contact a healthcare provider if symptoms worsen.'
  },
  moderate: {
    level: 'moderate',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100 border-yellow-200',
    message: 'Consider contacting a doctor for further evaluation of your symptoms.'
  },
  high: {
    level: 'high',
    color: 'text-red-800',
    bgColor: 'bg-red-100 border-red-200',
    message: 'Seek immediate medical attention. Contact emergency services if necessary.'
  }
};

export default function RiskAssessment({ 
  patientData, 
  riskLevel, 
  onGetAdvice, 
  onRestart 
}: RiskAssessmentProps) {
  const riskInfo = RISK_INFO[riskLevel];
  const selectedSymptoms = patientData.symptoms.filter(s => s.selected);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Assessment Results
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Patient Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900"><strong>Name:</strong> {patientData.name}</p>
          <p className="text-gray-900"><strong>Age:</strong> {patientData.age} years</p>
          <p className="text-gray-900">
            <strong>Symptoms:</strong> {selectedSymptoms.map(s => s.label).join(', ')}
          </p>
        </div>
      </div>

      <div className={`risk-card border-2 ${riskInfo.bgColor} mb-6`} role="alert">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-4 h-4 rounded-full mr-3 ${
            riskLevel === 'low' ? 'bg-green-500' :
            riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <h3 className={`text-2xl font-bold ${riskInfo.color} uppercase`}>
            {riskLevel} Risk
          </h3>
        </div>
        <p className={`text-lg ${riskInfo.color} leading-relaxed`}>
          {riskInfo.message}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onGetAdvice}
          className="btn-primary w-full text-lg"
          aria-describedby="advice-help"
        >
          Get Additional Medical Advice
        </button>
        <p id="advice-help" className="text-sm text-gray-500 text-center">
          Get personalized advice based on your symptoms and age
        </p>

        <button
          onClick={onRestart}
          className="btn-secondary w-full text-lg"
        >
          Start New Assessment
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> This assessment is for informational purposes only. 
          Always consult with a qualified healthcare professional for medical advice, 
          diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
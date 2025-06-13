import React, { useEffect } from 'react';
import { PatientData, RiskLevel } from '../types';

interface RiskAssessmentProps {
  patientData: PatientData;
  riskLevel: RiskLevel;
  onComplete: () => void;
}

const RISK_CONFIG = {
  LOW: {
    color: 'text-green-800',
    bgColor: 'bg-green-100 border-green-300',
    iconColor: 'bg-green-500',
    advice: 'Monitor your condition and rest. Contact a healthcare provider if symptoms worsen or persist.'
  },
  MODERATE: {
    color: 'text-orange-800',
    bgColor: 'bg-orange-100 border-orange-300',
    iconColor: 'bg-orange-500',
    advice: 'Consider contacting a doctor for further evaluation. Monitor symptoms closely and seek care if they worsen.'
  },
  HIGH: {
    color: 'text-red-800',
    bgColor: 'bg-red-100 border-red-300',
    iconColor: 'bg-red-500',
    advice: 'Seek immediate medical attention. Contact emergency services or visit an emergency room if symptoms are severe.'
  }
};

export default function RiskAssessment({ patientData, riskLevel, onComplete }: RiskAssessmentProps) {
  const config = RISK_CONFIG[riskLevel];
  const selectedSymptoms = patientData.symptoms.filter(s => s.selected);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Risk Assessment Results
      </h2>

      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-900 mb-2">
            <strong>Patient:</strong> {patientData.name}, {patientData.age} years old
          </p>
          <p className="text-gray-900">
            <strong>Symptoms:</strong> {selectedSymptoms.map(s => s.label).join(', ')}
          </p>
        </div>
      </div>

      <div className={`risk-alert border-2 ${config.bgColor} mb-6`} role="alert">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-4 h-4 rounded-full mr-3 ${config.iconColor}`}></div>
          <h3 className={`text-2xl font-bold ${config.color}`}>
            {riskLevel} RISK
          </h3>
        </div>
        <p className={`text-lg ${config.color} leading-relaxed text-center`}>
          {config.advice}
        </p>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-lg font-medium">
            Preparing AI consultation...
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          Automatically advancing to personalized medical guidance
        </p>
      </div>
    </div>
  );
}
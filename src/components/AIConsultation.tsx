import React, { useState, useEffect } from 'react';
import { PatientData, RiskLevel } from '../types';

interface AIConsultationProps {
  patientData: PatientData;
  riskLevel: RiskLevel;
  onStartOver: () => void;
}

const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default function AIConsultation({ patientData, riskLevel, onStartOver }: AIConsultationProps) {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAIAdvice();
  }, []);

  const fetchAIAdvice = async () => {
    try {
      setLoading(true);
      setError('');

      const selectedSymptoms = patientData.symptoms
        .filter(s => s.selected)
        .map(s => s.label);

      const prompt = `A user named ${patientData.name}, aged ${patientData.age}, reports the following symptoms: ${selectedSymptoms.join(', ')}. Provide medically neutral but empathetic guidance suitable for a non-medical audience in under 80 words.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setAdvice(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError('Unable to fetch AI consultation at this time.');
      setAdvice(getFallbackAdvice(riskLevel));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackAdvice = (risk: RiskLevel): string => {
    const fallbackMessages = {
      LOW: 'Based on your symptoms, focus on rest, hydration, and monitoring your condition. Over-the-counter medications may help with comfort. Contact a healthcare provider if symptoms persist or worsen.',
      MODERATE: 'Your symptoms suggest you should consider medical evaluation. Monitor your condition closely, stay hydrated, and don\'t hesitate to contact a healthcare provider for guidance.',
      HIGH: 'Given your symptoms, it\'s important to seek medical attention promptly. If you experience worsening symptoms, difficulty breathing, or severe pain, contact emergency services immediately.'
    };
    return fallbackMessages[risk];
  };

  const selectedSymptoms = patientData.symptoms.filter(s => s.selected);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        AI Medical Consultation
      </h2>

      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900 mb-2">
            <strong>Patient:</strong> {patientData.name}, {patientData.age} years old
          </p>
          <p className="text-gray-900 mb-2">
            <strong>Risk Level:</strong> <span className={`font-semibold ${
              riskLevel === 'LOW' ? 'text-green-600' :
              riskLevel === 'MODERATE' ? 'text-orange-600' : 'text-red-600'
            }`}>{riskLevel}</span>
          </p>
          <p className="text-gray-900">
            <strong>Symptoms:</strong> {selectedSymptoms.map(s => s.label).join(', ')}
          </p>
        </div>
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">
              Generating personalized medical guidance...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  AI Service Temporarily Unavailable
                </h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {advice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-green-800 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Personalized Medical Guidance
            </h4>
            <div className="text-green-800 leading-relaxed">
              {advice}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={onStartOver}
          className="btn-primary w-full text-lg py-3"
        >
          Start Over
        </button>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Medical Disclaimer:</strong> This AI-generated guidance is for informational purposes only 
          and should not replace professional medical consultation. Always seek advice from 
          qualified healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
}
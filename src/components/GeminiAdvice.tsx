import React, { useState, useEffect } from 'react';
import { PatientData } from '../types';

interface GeminiAdviceProps {
  patientData: PatientData;
  onRestart: () => void;
}

const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default function GeminiAdvice({ patientData, onRestart }: GeminiAdviceProps) {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchGeminiAdvice();
  }, []);

  const fetchGeminiAdvice = async () => {
    try {
      setLoading(true);
      setError('');

      const selectedSymptoms = patientData.symptoms
        .filter(s => s.selected)
        .map(s => s.label)
        .join(', ');

      const prompt = `Given these symptoms: ${selectedSymptoms}, and age: ${patientData.age}, provide further advice in plain language for a non-medical user. Keep the response concise, helpful, and include general wellness recommendations. Always remind them to consult healthcare professionals for serious concerns.`;

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
      setError('Unable to fetch additional advice at this time. Please try again later or consult with a healthcare professional directly.');
      setAdvice('Based on your symptoms, here are some general recommendations:\n\n• Stay hydrated and get adequate rest\n• Monitor your symptoms and note any changes\n• Consider over-the-counter medications for symptom relief if appropriate\n• Maintain good hygiene practices\n• Contact a healthcare provider if symptoms persist or worsen\n\nRemember: This is general advice and should not replace professional medical consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Additional Medical Advice
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">For: {patientData.name}</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900">
            <strong>Age:</strong> {patientData.age} years
          </p>
          <p className="text-gray-900">
            <strong>Symptoms:</strong> {patientData.symptoms
              .filter(s => s.selected)
              .map(s => s.label)
              .join(', ')}
          </p>
        </div>
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">
              Getting personalized advice...
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
                  Service Temporarily Unavailable
                </h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-green-800 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Personalized Advice
            </h4>
            <div className="text-green-800 leading-relaxed whitespace-pre-line">
              {advice}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={onRestart}
          className="btn-primary w-full text-lg"
        >
          Start New Assessment
        </button>
        
        {!loading && (
          <button
            onClick={fetchGeminiAdvice}
            className="btn-secondary w-full text-lg"
          >
            Refresh Advice
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This AI-generated advice is for informational purposes only 
          and should not replace professional medical consultation. Always seek advice from 
          qualified healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
}
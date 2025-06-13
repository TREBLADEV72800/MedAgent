import React, { useState } from 'react';
import { PatientData, Symptom } from '../types';

interface SymptomFormProps {
  onSubmit: (data: PatientData) => void;
}

const SYMPTOMS: Omit<Symptom, 'selected'>[] = [
  { name: 'fever', label: 'Fever' },
  { name: 'headache', label: 'Headache' },
  { name: 'fatigue', label: 'Fatigue' },
  { name: 'cough', label: 'Cough' },
  { name: 'chest pain', label: 'Chest Pain' },
  { name: 'nausea', label: 'Nausea' },
  { name: 'sore throat', label: 'Sore Throat' },
  { name: 'difficulty breathing', label: 'Difficulty Breathing' },
];

export default function SymptomForm({ onSubmit }: SymptomFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>(
    SYMPTOMS.map(s => ({ ...s, selected: false }))
  );
  const [error, setError] = useState('');

  const handleSymptomChange = (index: number) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index].selected = !updatedSymptoms[index].selected;
    setSymptoms(updatedSymptoms);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      setError('Please enter a valid age (1-120)');
      return;
    }
    
    const selectedSymptoms = symptoms.filter(s => s.selected);
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to continue');
      return;
    }

    onSubmit({
      name: name.trim(),
      age: parseInt(age),
      symptoms
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Patient Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter your full name"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
            placeholder="Enter your age"
            min="1"
            max="120"
            aria-required="true"
          />
        </div>

        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-4">
              Current Symptoms *
            </legend>
            <div className="space-y-3">
              {symptoms.map((symptom, index) => (
                <label key={symptom.name} className="checkbox-item cursor-pointer">
                  <input
                    type="checkbox"
                    checked={symptom.selected}
                    onChange={() => handleSymptomChange(index)}
                    className="checkbox-input"
                    aria-describedby={`${symptom.name}-desc`}
                  />
                  <span className="text-lg font-medium text-gray-900">
                    {symptom.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full text-xl"
          aria-describedby="continue-help"
        >
          Continue to Assessment
        </button>
        <p id="continue-help" className="text-sm text-gray-500 text-center">
          Click to proceed with your symptom evaluation
        </p>
      </form>
    </div>
  );
}
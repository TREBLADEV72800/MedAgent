import React, { useState } from 'react';
import { PatientData, Symptom } from '../types';
import ErrorModal from './ErrorModal';

interface InitialAssessmentProps {
  onSubmit: (data: PatientData) => void;
}

const SYMPTOMS: Omit<Symptom, 'selected'>[] = [
  { name: 'fever', label: 'Fever' },
  { name: 'headache', label: 'Headache' },
  { name: 'cough', label: 'Cough' },
  { name: 'fatigue', label: 'Fatigue' },
  { name: 'chest_pain', label: 'Chest Pain' },
  { name: 'shortness_breath', label: 'Shortness of Breath' },
  { name: 'nausea', label: 'Nausea' },
  { name: 'sore_throat', label: 'Sore Throat' },
];

export default function InitialAssessment({ onSubmit }: InitialAssessmentProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>(
    SYMPTOMS.map(s => ({ ...s, selected: false }))
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSymptomChange = (index: number) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index].selected = !updatedSymptoms[index].selected;
    setSymptoms(updatedSymptoms);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name');
      setShowErrorModal(true);
      return false;
    }
    
    const ageNum = parseInt(age);
    if (!age || ageNum < 5 || ageNum > 99) {
      setErrorMessage('Please enter a valid age between 5 and 99');
      setShowErrorModal(true);
      return false;
    }
    
    const selectedSymptoms = symptoms.filter(s => s.selected);
    if (selectedSymptoms.length === 0) {
      setErrorMessage('Please select at least one symptom to continue');
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      name: name.trim(),
      age: parseInt(age),
      symptoms
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          MedAgent Symptom Assessment
        </h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your full name"
              required
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
              min="5"
              max="99"
              required
            />
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-4">
                Current Symptoms * (Select all that apply)
              </legend>
              <div className="space-y-3">
                {symptoms.map((symptom, index) => (
                  <label key={symptom.name} className="symptom-checkbox">
                    <input
                      type="checkbox"
                      checked={symptom.selected}
                      onChange={() => handleSymptomChange(index)}
                      className="checkbox-input"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      {symptom.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={handleSubmit}
            className="btn-primary w-full text-xl py-4"
          >
            Evaluate Risk
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
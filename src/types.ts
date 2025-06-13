export interface Symptom {
  name: string;
  label: string;
  selected: boolean;
}

export interface PatientData {
  name: string;
  age: number;
  symptoms: Symptom[];
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
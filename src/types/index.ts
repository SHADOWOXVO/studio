export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  summary?: string;
}

export interface Patient {
  id:string;
  name: string;
  age: number;
  chiefComplaint: string;
  dentalHistory: string;
  medicalHistory: string;
  treatmentPlans: string;
  totalTreatmentCost: number;
  payments: Payment[];
  notes: Note[];
}

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Patient } from '@/types';
import { Header } from '@/components/layout/Header';
import { PatientList } from '@/components/PatientList';
import { PatientProfile } from '@/components/PatientProfile';
import { PatientForm } from '@/components/PatientForm';

const initialPatients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      chiefComplaint: 'Sensitivity in the upper right quadrant.',
      dentalHistory: 'Routine check-ups, one filling in 2021. No allergies.',
      medicalHistory: 'No known medical conditions. Not taking any medication.',
      treatmentPlans: 'X-ray results confirm a small cavity on tooth #3. Scheduled a filling for the next appointment.',
      totalTreatmentCost: 1200,
      payments: [{ id: 'p1', amount: 500, date: '2024-05-10T10:00:00.000Z' }],
      notes: [
        {
          id: 'n1',
          date: '2024-05-10T10:00:00.000Z',
          content: 'Patient reported sensitivity in the upper right quadrant. Examination revealed a potential cavity on tooth #3. X-rays ordered.',
          summary: 'Patient has sensitivity in the upper right; a possible cavity on tooth #3 was found, and X-rays were ordered.'
        },
        {
          id: 'n2',
          date: '2024-05-20T11:00:00.000Z',
          content: 'X-ray results confirm a small cavity on tooth #3. Scheduled a filling for the next appointment. Provided patient with oral hygiene instructions.',
          summary: 'X-ray confirms a cavity on tooth #3. A filling is scheduled, and oral hygiene instructions were given.'
        }
      ],
    },
    {
        id: '2',
        name: 'Jane Doe',
        age: 32,
        chiefComplaint: 'Routine checkup.',
        dentalHistory: 'Braces in teenage years. Regular cleanings.',
        medicalHistory: 'Allergic to penicillin.',
        treatmentPlans: 'Routine cleaning and check-up. No issues found. Recommend to continue current routine.',
        totalTreatmentCost: 350,
        payments: [{ id: 'p2', amount: 350, date: '2024-05-25T14:00:00.000Z' }],
        notes: [
            {
                id: 'n3',
                date: '2024-05-25T14:00:00.000Z',
                content: 'Routine cleaning and check-up. No issues found. Patient has excellent oral hygiene. Recommended to continue current routine. Next check-up in 6 months.',
                summary: 'The patient underwent a routine cleaning and check-up with no issues. They have excellent oral hygiene and were advised to continue their current routine, with a follow-up in 6 months.'
            }
        ]
    }
];


export default function DentalTrackApp() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('dental-track-patients', initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients.length > 0 ? patients[0].id : null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null;

  const handleAddPatientClick = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };
  
  const handleSavePatient = (patientToSave: Patient) => {
    const patientIndex = patients.findIndex(p => p.id === patientToSave.id);
    if(patientIndex > -1) {
        // Update existing patient
        const updatedPatients = [...patients];
        updatedPatients[patientIndex] = patientToSave;
        setPatients(updatedPatients);
    } else {
        // Add new patient
        const newPatients = [...patients, patientToSave];
        setPatients(newPatients);
        setSelectedPatientId(patientToSave.id);
    }
  };
  
  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter(p => p.id !== patientId));
    if (selectedPatientId === patientId) {
        setSelectedPatientId(patients.length > 1 ? patients.filter(p => p.id !== patientId)[0].id : null);
    }
  }

  const handleUpdatePatient = (updatedPatientData: Patient) => {
    handleSavePatient(updatedPatientData);
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          onAddPatient={handleAddPatientClick}
        />
        <div className="flex-1 overflow-y-auto">
          <PatientProfile
            patient={selectedPatient}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onUpdatePatient={handleUpdatePatient}
          />
        </div>
      </main>
      <PatientForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSavePatient}
        patient={editingPatient}
      />
    </div>
  );
}

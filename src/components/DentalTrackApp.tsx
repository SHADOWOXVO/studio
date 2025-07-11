'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Patient } from '@/types';
import { Header } from '@/components/layout/Header';
import { PatientList } from '@/components/PatientList';
import { PatientProfile } from '@/components/PatientProfile';
import { PatientForm } from '@/components/PatientForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, []); // Run only once on mount

  // Update selectedPatientId only when patients list changes
  useEffect(() => {
    if (isClient) {
      if (!selectedPatientId || !patients.some(p => p.id === selectedPatientId)) {
        setSelectedPatientId(patients.length > 0 ? patients[0].id : null);
      }
    }
  }, [patients, isClient]);

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

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(patients, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'dental-track-backup.json');
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      toast({
        title: "Data Exported",
        description: "Your patient data has been downloaded.",
      })
    } catch (error) {
      console.error("Failed to export data", error);
      toast({
        title: "Export Failed",
        description: "Could not export your data. See console for details.",
        variant: "destructive"
      })
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File could not be read");
        }
        const importedPatients = JSON.parse(text);

        // Basic validation
        if (Array.isArray(importedPatients) && (importedPatients.length === 0 || importedPatients[0].id)) {
          setPatients(importedPatients);
          setSelectedPatientId(importedPatients[0]?.id || null);
          toast({
            title: "Data Imported",
            description: "Your patient data has been successfully restored.",
          });
        } else {
          throw new Error("Invalid backup file format.");
        }
      } catch (error) {
        console.error("Failed to import data", error);
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid backup file.",
          variant: "destructive",
        });
      } finally {
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  if (!isClient) {
    return (
      <div className="flex flex-col h-screen">
        <Header onExport={handleExportData} onImport={handleImportClick} />
        <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
          <div className="w-full md:max-w-xs flex-shrink-0 space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
             <Skeleton className="h-full w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onExport={handleExportData} onImport={handleImportClick} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportData}
        accept="application/json"
        className="hidden"
      />
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto md:overflow-y-hidden">
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

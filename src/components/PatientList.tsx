'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import type { Patient } from '@/types';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
  onAddPatient: () => void;
}

export function PatientList({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
}: PatientListProps) {
  return (
    <Card className="w-full md:max-w-xs flex-shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Users /> Patients</span>
          <Button size="sm" onClick={onAddPatient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patients.length > 0 ? (
          <div className="space-y-2">
            {patients.map((patient) => (
              <Button
                key={patient.id}
                variant={selectedPatientId === patient.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onSelectPatient(patient.id)}
              >
                {patient.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>No patients found.</p>
            <p>Click "Add" to create one.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

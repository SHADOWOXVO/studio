'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Calendar, FilePenLine, Info, Lightbulb, Smile, Stethoscope, Trash2 } from 'lucide-react';
import type { Patient } from '@/types';
import { ConditionNotes } from './ConditionNotes';
import { PaymentTracker } from './PaymentTracker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PatientProfileProps {
  patient: Patient | null;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

export function PatientProfile({ patient, onEdit, onDelete, onUpdatePatient }: PatientProfileProps) {
  const { toast } = useToast();
  
  if (!patient) {
    return (
      <Card className="flex-1">
        <CardContent className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
          <Smile className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Welcome to DentalTrack</h2>
          <p className="text-muted-foreground">Select a patient from the list to view their details, or add a new patient to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = () => {
    onDelete(patient.id);
    toast({
        title: "Patient Deleted",
        description: `${patient.name}'s profile has been removed.`,
        variant: "destructive"
    })
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-3xl font-headline">{patient.name}</CardTitle>
          <CardDescription className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-2"><Calendar size={14} /> {patient.age} years old</span>
            <span className="flex items-center gap-2"><AlertCircle size={14} /> {patient.problem}</span>
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(patient)}><FilePenLine className="mr-2 h-4 w-4" /> Edit</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the patient's profile and all associated data.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notes">Condition Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="pt-6 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Stethoscope size={20} /> Dental History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{patient.dentalHistory}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb size={20} /> Possible Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{patient.possibleSolutions}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info size={20} /> Treatment Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Total treatment cost: <span className="font-bold text-foreground">${patient.totalTreatmentCost.toFixed(2)}</span></p>
                </CardContent>
             </Card>
          </TabsContent>
          <TabsContent value="payments" className="pt-6">
            <PaymentTracker patient={patient} onUpdatePatient={onUpdatePatient} />
          </TabsContent>
          <TabsContent value="notes" className="pt-6">
            <ConditionNotes patient={patient} onUpdatePatient={onUpdatePatient} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

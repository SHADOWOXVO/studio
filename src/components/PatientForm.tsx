'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Patient } from '@/types';
import { useToast } from '@/hooks/use-toast';

const patientFormSchema = z.object({
  name: z.string(),
  age: z.coerce.number(),
  chiefComplaint: z.string(),
  dentalHistory: z.string(),
  medicalHistory: z.string(),
  treatmentPlans: z.string(),
  totalTreatmentCost: z.coerce.number(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  patient?: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patient: Patient) => void;
}

export function PatientForm({ patient, open, onOpenChange, onSave }: PatientFormProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? { ...patient }
      : {
          name: '',
          age: 0,
          chiefComplaint: '',
          dentalHistory: '',
          medicalHistory: '',
          treatmentPlans: '',
          totalTreatmentCost: 0,
        },
  });

  React.useEffect(() => {
    if (open) {
      form.reset(
        patient ?? {
          name: '',
          age: 0,
          chiefComplaint: '',
          dentalHistory: '',
          medicalHistory: '',
          treatmentPlans: '',
          totalTreatmentCost: 0,
        }
      );
    }
  }, [patient, open, form]);


  const onSubmit = (data: PatientFormValues) => {
    const newPatientData: Patient = {
      ...(patient || { id: crypto.randomUUID(), payments: [], notes: [] }),
      ...data,
    };
    onSave(newPatientData);
    onOpenChange(false);
    toast({
      title: patient ? 'Patient Updated' : 'Patient Added',
      description: `${data.name}'s profile has been saved.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
          <DialogDescription>
            {patient ? "Update the patient's details." : "Fill in the details for the new patient."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="35" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sharp pain in upper molar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dentalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dental History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Previous fillings, crowns..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Allergies, current medications..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatmentPlans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Plans</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Root canal treatment, filling replacement..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalTreatmentCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Treatment Cost ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

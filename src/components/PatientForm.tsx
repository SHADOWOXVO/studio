'use client';

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
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().int().positive({ message: 'Age must be a positive number.' }),
  contact: z.string().min(5, { message: 'Contact information is required.' }),
  dentalHistory: z.string().min(10, { message: 'Dental history must be at least 10 characters.' }),
  totalTreatmentCost: z.coerce.number().positive({ message: 'Cost must be a positive number.' }),
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
          contact: '',
          dentalHistory: '',
          totalTreatmentCost: 0,
        },
  });

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
      <DialogContent className="sm:max-w-[425px]">
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
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com or phone number" {...field} />
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
                    <Textarea placeholder="e.g., Previous fillings, crowns, allergies..." {...field} />
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

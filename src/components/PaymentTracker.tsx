'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/types';
import { DollarSign, Landmark, Save } from 'lucide-react';

interface PaymentTrackerProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

export function PaymentTracker({ patient, onUpdatePatient }: PaymentTrackerProps) {
  const [newPayment, setNewPayment] = useState('');
  const { toast } = useToast();

  const totalPaid = patient.payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = patient.totalTreatmentCost - totalPaid;

  const handleAddPayment = () => {
    const amount = parseFloat(newPayment);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number for the payment.',
        variant: 'destructive',
      });
      return;
    }

    const updatedPatient: Patient = {
      ...patient,
      payments: [
        ...patient.payments,
        {
          id: crypto.randomUUID(),
          amount: amount,
          date: new Date().toISOString(),
        },
      ],
    };
    onUpdatePatient(updatedPatient);
    setNewPayment('');
    toast({
      title: 'Payment Added',
      description: `Successfully recorded a payment of $${amount.toFixed(2)}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${outstandingBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total cost: ${patient.totalTreatmentCost.toFixed(2)} / Paid: ${totalPaid.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Landmark size={20} /> Add New Payment</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={newPayment}
            onChange={(e) => setNewPayment(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddPayment}><Save className="mr-2" /> Record Payment</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.payments.length > 0 ? (
                patient.payments
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No payments recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

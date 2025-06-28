'use client';

import { useState } from 'react';
import { getSummary } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/types';
import { FileText, Loader2, Save, Sparkles } from 'lucide-react';

interface ConditionNotesProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

export function ConditionNotes({ patient, onUpdatePatient }: ConditionNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const handleGetSummary = async () => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      toast({
        title: 'You are offline',
        description: 'AI summarization requires an internet connection.',
        variant: 'destructive',
      });
      return;
    }

    if (!newNote.trim()) {
      toast({
        title: 'Empty Note',
        description: 'Please write a note before summarizing.',
        variant: 'destructive',
      });
      return;
    }
    setIsSummarizing(true);
    setSummary('');
    const result = await getSummary(newNote);
    if (result.error) {
      toast({
        title: 'Summarization Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.summary) {
      setSummary(result.summary);
      toast({
        title: 'Summary Generated',
        description: 'AI-powered summary is ready.',
      });
    }
    setIsSummarizing(false);
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) {
      toast({
        title: 'Empty Note',
        description: 'Cannot save an empty note.',
        variant: 'destructive',
      });
      return;
    }
    const updatedPatient: Patient = {
      ...patient,
      notes: [
        ...patient.notes,
        {
          id: crypto.randomUUID(),
          content: newNote,
          date: new Date().toISOString(),
          summary: summary,
        },
      ],
    };
    onUpdatePatient(updatedPatient);
    setNewNote('');
    setSummary('');
    toast({
      title: 'Note Saved',
      description: `A new note for ${patient.name} has been saved.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText size={20} /> Add New Condition Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter detailed observations about the patient's condition..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={6}
          />
          {summary && (
            <div className="p-3 bg-secondary rounded-md border">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles size={16} className="text-accent-foreground" /> AI Summary</h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          )}
          <div className="flex justify-between items-center gap-2">
            <Button onClick={handleGetSummary} variant="outline" disabled={isSummarizing}>
              {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2" />
              )}
              Summarize with AI
            </Button>
            <Button onClick={handleSaveNote}><Save className="mr-2" /> Save Note</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.notes.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {patient.notes
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((note) => (
                  <AccordionItem value={note.id} key={note.id}>
                    <AccordionTrigger>{new Date(note.date).toLocaleDateString()}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      {note.summary && (
                         <div className="p-3 bg-secondary/50 rounded-md border border-dashed">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles size={16} className="text-accent-foreground" /> AI Summary</h4>
                            <p className="text-sm text-muted-foreground">{note.summary}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No notes recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

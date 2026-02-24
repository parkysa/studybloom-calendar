import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Trash2, BookOpen, GraduationCap, CalendarX, StickyNote,
  Mail, User, Palette,
} from 'lucide-react';
import { Subject, Grade, Absence, SubjectNote } from '@/types/studybloom';

const SubjectsPage = () => {
  const {
    subjects, addSubject, removeSubject,
    addGrade, removeGrade,
    addAbsence, removeAbsence,
    addSubjectNote, removeSubjectNote,
  } = useStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailSubject, setDetailSubject] = useState<Subject | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#E8A0BF');
  const [newProfessor, setNewProfessor] = useState('');
  const [newProfEmail, setNewProfEmail] = useState('');

  // Grade form
  const [gradeValue, setGradeValue] = useState('');
  const [gradeDesc, setGradeDesc] = useState('');

  // Absence form
  const [absenceDate, setAbsenceDate] = useState('');

  // Note form
  const [noteContent, setNoteContent] = useState('');

  const handleAddSubject = () => {
    if (!newName) return;
    const subject: Subject = {
      id: Date.now().toString(),
      name: newName,
      color: newColor,
      professor: newProfessor,
      professorEmail: newProfEmail,
      grades: [],
      absences: [],
      notes: [],
    };
    addSubject(subject);
    setNewName('');
    setNewColor('#E8A0BF');
    setNewProfessor('');
    setNewProfEmail('');
    setAddDialogOpen(false);
  };

  const handleAddGrade = () => {
    if (!detailSubject || !gradeValue) return;
    const grade: Grade = {
      id: Date.now().toString(),
      value: parseFloat(gradeValue),
      description: gradeDesc,
    };
    addGrade(detailSubject.id, grade);
    setGradeValue('');
    setGradeDesc('');
  };

  const handleAddAbsence = () => {
    if (!detailSubject || !absenceDate) return;
    const absence: Absence = { id: Date.now().toString(), date: absenceDate };
    addAbsence(detailSubject.id, absence);
    setAbsenceDate('');
  };

  const handleAddNote = () => {
    if (!detailSubject || !noteContent) return;
    const note: SubjectNote = {
      id: Date.now().toString(),
      content: noteContent,
      createdAt: new Date().toISOString(),
    };
    addSubjectNote(detailSubject.id, note);
    setNoteContent('');
  };

  // Keep detailSubject in sync with store
  const currentDetail = detailSubject ? subjects.find((s) => s.id === detailSubject.id) : null;

  const getAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    return (grades.reduce((acc, g) => acc + g.value, 0) / grades.length).toFixed(1);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display text-primary">Matérias 📚</h1>
            <p className="text-muted-foreground font-body text-sm">Gerencie suas disciplinas</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="rounded-xl font-body gap-2">
            <Plus size={18} /> Nova Matéria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => setDetailSubject(subject)}
            >
              <div className="h-2" style={{ backgroundColor: subject.color }} />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="font-display text-lg text-foreground">{subject.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(subject.id);
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm font-body text-muted-foreground flex items-center gap-1.5">
                  <User size={14} /> {subject.professor}
                </p>
                <p className="text-sm font-body text-muted-foreground flex items-center gap-1.5">
                  <Mail size={14} /> {subject.professorEmail}
                </p>
                <div className="flex gap-3 mt-3 text-xs font-body">
                  <span className="bg-bloom-blue/20 text-foreground px-2 py-1 rounded-lg">
                    📊 Média: {getAverage(subject.grades)}
                  </span>
                  <span className="bg-bloom-red/20 text-foreground px-2 py-1 rounded-lg">
                    ❌ Faltas: {subject.absences.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Subject Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-primary">Nova Matéria 🌸</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-body font-semibold">Nome</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Cálculo I" className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-sm font-body font-semibold flex items-center gap-1"><Palette size={14} /> Cor</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                  <span className="text-sm font-body text-muted-foreground">{newColor}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-body font-semibold">Professor</label>
                <Input value={newProfessor} onChange={(e) => setNewProfessor(e.target.value)} placeholder="Nome do professor" className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-sm font-body font-semibold">Email do Professor</label>
                <Input value={newProfEmail} onChange={(e) => setNewProfEmail(e.target.value)} placeholder="professor@uni.edu" className="rounded-xl mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSubject} className="rounded-xl font-body">Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Subject Detail Dialog */}
        <Dialog open={!!detailSubject} onOpenChange={(open) => !open && setDetailSubject(null)}>
          <DialogContent className="rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto">
            {currentDetail && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentDetail.color }} />
                    <DialogTitle className="font-display text-primary">{currentDetail.name}</DialogTitle>
                  </div>
                  <p className="text-sm font-body text-muted-foreground">
                    {currentDetail.professor} · {currentDetail.professorEmail}
                  </p>
                </DialogHeader>

                <Tabs defaultValue="grades" className="mt-4">
                  <TabsList className="w-full rounded-xl">
                    <TabsTrigger value="grades" className="rounded-lg font-body flex-1 gap-1">
                      <GraduationCap size={14} /> Notas
                    </TabsTrigger>
                    <TabsTrigger value="absences" className="rounded-lg font-body flex-1 gap-1">
                      <CalendarX size={14} /> Faltas
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-lg font-body flex-1 gap-1">
                      <StickyNote size={14} /> Anotações
                    </TabsTrigger>
                  </TabsList>

                  {/* Grades Tab */}
                  <TabsContent value="grades" className="space-y-4">
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                      <p className="text-sm font-body text-muted-foreground">Média Atual</p>
                      <p className="text-3xl font-display text-primary">{getAverage(currentDetail.grades)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Nota"
                        value={gradeValue}
                        onChange={(e) => setGradeValue(e.target.value)}
                        className="rounded-xl w-24"
                      />
                      <Input
                        placeholder="Descrição (ex: Prova 1)"
                        value={gradeDesc}
                        onChange={(e) => setGradeDesc(e.target.value)}
                        className="rounded-xl flex-1"
                      />
                      <Button onClick={handleAddGrade} size="sm" className="rounded-xl">
                        <Plus size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentDetail.grades.map((g) => (
                        <div key={g.id} className="flex items-center justify-between bg-secondary/50 rounded-xl p-3">
                          <div>
                            <span className="font-body font-bold text-foreground">{g.value}</span>
                            <span className="text-sm font-body text-muted-foreground ml-2">{g.description}</span>
                          </div>
                          <button onClick={() => removeGrade(currentDetail.id, g.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Absences Tab */}
                  <TabsContent value="absences" className="space-y-4">
                    <div className="bg-destructive/10 rounded-xl p-4 text-center">
                      <p className="text-sm font-body text-muted-foreground">Total de Faltas</p>
                      <p className="text-3xl font-display text-destructive">{currentDetail.absences.length}</p>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={absenceDate}
                        onChange={(e) => setAbsenceDate(e.target.value)}
                        className="rounded-xl flex-1"
                      />
                      <Button onClick={handleAddAbsence} size="sm" className="rounded-xl">
                        <Plus size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentDetail.absences.map((a) => (
                        <div key={a.id} className="flex items-center justify-between bg-secondary/50 rounded-xl p-3">
                          <span className="font-body text-foreground">📅 {a.date}</span>
                          <button onClick={() => removeAbsence(currentDetail.id, a.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Escreva uma anotação..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="rounded-xl flex-1 min-h-[60px]"
                      />
                      <Button onClick={handleAddNote} size="sm" className="rounded-xl self-end">
                        <Plus size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentDetail.notes.map((n) => (
                        <div key={n.id} className="bg-bloom-yellow/10 rounded-xl p-3 border border-bloom-yellow/20">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-body text-foreground whitespace-pre-wrap">{n.content}</p>
                            <button onClick={() => removeSubjectNote(currentDetail.id, n.id)} className="text-muted-foreground hover:text-destructive ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-body mt-2">
                            {new Date(n.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default SubjectsPage;

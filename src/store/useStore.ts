import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, Subject, Grade, Absence, SubjectNote } from '@/types/studybloom';

interface StoreState {
  subjects: Subject[];
  activities: Activity[];
  addSubject: (subject: Subject) => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  addGrade: (subjectId: string, grade: Grade) => void;
  removeGrade: (subjectId: string, gradeId: string) => void;
  addAbsence: (subjectId: string, absence: Absence) => void;
  removeAbsence: (subjectId: string, absenceId: string) => void;
  addSubjectNote: (subjectId: string, note: SubjectNote) => void;
  removeSubjectNote: (subjectId: string, noteId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      subjects: [
        {
          id: '1',
          name: 'Matemática',
          color: '#E8A0BF',
          professor: 'Prof. Silva',
          professorEmail: 'silva@uni.edu',
          grades: [{ id: 'g1', value: 8.5, description: 'Prova 1' }],
          absences: [],
          notes: [],
        },
        {
          id: '2',
          name: 'Programação',
          color: '#7EB5E6',
          professor: 'Prof. Santos',
          professorEmail: 'santos@uni.edu',
          grades: [],
          absences: [],
          notes: [],
        },
        {
          id: '3',
          name: 'Física',
          color: '#A8D5BA',
          professor: 'Prof. Oliveira',
          professorEmail: 'oliveira@uni.edu',
          grades: [],
          absences: [],
          notes: [],
        },
      ],
      activities: [
        {
          id: 'a1',
          title: 'Prova de Cálculo',
          date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          type: 'prova',
          status: 'a_fazer',
          subjectId: '1',
        },
        {
          id: 'a2',
          title: 'Trabalho de React',
          date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          type: 'trabalho',
          status: 'em_progresso',
          subjectId: '2',
        },
        {
          id: 'a3',
          title: 'Lista de Exercícios',
          date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
          type: 'lista',
          status: 'feito',
          subjectId: '1',
        },
        {
          id: 'a4',
          title: 'Relatório de Lab',
          date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
          type: 'trabalho',
          status: 'a_fazer',
          subjectId: '3',
        },
      ],

      addSubject: (subject) =>
        set((state) => ({ subjects: [...state.subjects, subject] })),
      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          activities: state.activities.filter((a) => a.subjectId !== id),
        })),
      updateSubject: (id, data) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),
      addActivity: (activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      removeActivity: (id) =>
        set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),
      updateActivity: (id, data) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      addGrade: (subjectId, grade) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId ? { ...s, grades: [...s.grades, grade] } : s
          ),
        })),
      removeGrade: (subjectId, gradeId) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, grades: s.grades.filter((g) => g.id !== gradeId) }
              : s
          ),
        })),
      addAbsence: (subjectId, absence) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId ? { ...s, absences: [...s.absences, absence] } : s
          ),
        })),
      removeAbsence: (subjectId, absenceId) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, absences: s.absences.filter((a) => a.id !== absenceId) }
              : s
          ),
        })),
      addSubjectNote: (subjectId, note) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId ? { ...s, notes: [...s.notes, note] } : s
          ),
        })),
      removeSubjectNote: (subjectId, noteId) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, notes: s.notes.filter((n) => n.id !== noteId) }
              : s
          ),
        })),
    }),
    {
      name: 'studybloom-storage',
    }
  )
);

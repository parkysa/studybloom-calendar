import { create } from 'zustand';
import { Activity, Subject, Grade, Absence, SubjectNote } from '@/types/studybloom';
import { supabase } from '@/lib/supabase';

interface StoreState {
  subjects: Subject[];
  activities: Activity[];
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  updateActivity: (id: string, data: Partial<Activity>) => Promise<void>;
  addGrade: (subjectId: string, grade: Grade) => Promise<void>;
  removeGrade: (subjectId: string, gradeId: string) => Promise<void>;
  addAbsence: (subjectId: string, absence: Absence) => Promise<void>;
  removeAbsence: (subjectId: string, absenceId: string) => Promise<void>;
  addSubjectNote: (subjectId: string, note: SubjectNote) => Promise<void>;
  removeSubjectNote: (subjectId: string, noteId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  subjects: [],
  activities: [],
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false });
      return;
    }

    const [subs, acts] = await Promise.all([
      supabase.from('subjects').select('*').eq('user_id', user.id),
      supabase.from('activities').select('*').eq('user_id', user.id)
    ]);

    set({ 
      subjects: subs.data || [], 
      activities: acts.data || [],
      isLoading: false 
    });
  },

  addSubject: async (subject) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ ...subject, user_id: user.id }])
      .select();
    
    if (!error && data) {
      set((state) => ({ subjects: [...state.subjects, data[0]] }));
    }
  },

  removeSubject: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (!error) {
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        activities: state.activities.filter((a) => a.subjectId !== id),
      }));
    }
  },

  updateSubject: async (id, data) => {
    const { error } = await supabase.from('subjects').update(data).eq('id', id);
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }));
    }
  },

  addActivity: async (activity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activity, user_id: user.id }])
      .select();

    if (!error && data) {
      set((state) => ({ activities: [...state.activities, data[0]] }));
    }
  },

  removeActivity: async (id) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) {
      set((state) => ({ activities: state.activities.filter((a) => a.id !== id) }));
    }
  },

  updateActivity: async (id, data) => {
    const { error } = await supabase.from('activities').update(data).eq('id', id);
    if (!error) {
      set((state) => ({
        activities: state.activities.map((a) => (a.id === id ? { ...a, ...data } : a)),
      }));
    }
  },

  addGrade: async (subjectId, grade) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newGrades = [...(subject.grades || []), grade];
    const { error } = await supabase
      .from('subjects')
      .update({ grades: newGrades })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, grades: newGrades } : s
        ),
      }));
    }
  },

  removeGrade: async (subjectId, gradeId) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newGrades = (subject.grades || []).filter((g) => g.id !== gradeId);
    const { error } = await supabase
      .from('subjects')
      .update({ grades: newGrades })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, grades: newGrades } : s
        ),
      }));
    }
  },

  addAbsence: async (subjectId, absence) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newAbsences = [...(subject.absences || []), absence];
    const { error } = await supabase
      .from('subjects')
      .update({ absences: newAbsences })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, absences: newAbsences } : s
        ),
      }));
    }
  },

  removeAbsence: async (subjectId, absenceId) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newAbsences = (subject.absences || []).filter((a) => a.id !== absenceId);
    const { error } = await supabase
      .from('subjects')
      .update({ absences: newAbsences })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, absences: newAbsences } : s
        ),
      }));
    }
  },

  addSubjectNote: async (subjectId, note) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newNotes = [...(subject.notes || []), note];
    const { error } = await supabase
      .from('subjects')
      .update({ notes: newNotes })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, notes: newNotes } : s
        ),
      }));
    }
  },

  removeSubjectNote: async (subjectId, noteId) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    
    const newNotes = (subject.notes || []).filter((n) => n.id !== noteId);
    const { error } = await supabase
      .from('subjects')
      .update({ notes: newNotes })
      .eq('id', subjectId);
    
    if (!error) {
      set((state) => ({
        subjects: state.subjects.map((s) =>
          s.id === subjectId ? { ...s, notes: newNotes } : s
        ),
      }));
    }
  },
}));

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
}

export const useStore = create<StoreState>((set, get) => ({
  subjects: [],
  activities: [],
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ ...subject, user_id: user?.id }])
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
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activity, user_id: user?.id }])
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
}));
export type ActivityType = 'prova' | 'trabalho' | 'lista' | 'estudo';
export type ActivityStatus = 'a_fazer' | 'em_progresso' | 'feito';

export interface Activity {
  id: string;
  title: string;
  date?: string;
  type: ActivityType;
  status: ActivityStatus;
  subjectId: string;
}

export interface Grade {
  id: string;
  value: number;
  description: string;
}

export interface Absence {
  id: string;
  date: string;
}

export interface SubjectNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  professor: string;
  professorEmail: string;
  grades: Grade[];
  absences: Absence[];
  notes: SubjectNote[];
}

export interface AppState {
  subjects: Subject[];
  activities: Activity[];
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  prova: 'Prova',
  trabalho: 'Trabalho',
  lista: 'Lista',
  estudo: 'Estudo',
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  a_fazer: 'A Fazer',
  em_progresso: 'Em Progresso',
  feito: 'Feito',
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  prova: 'hsl(0, 70%, 60%)',
  trabalho: 'hsl(210, 70%, 60%)',
  lista: 'hsl(150, 50%, 55%)',
  estudo: 'hsl(45, 90%, 65%)',
};

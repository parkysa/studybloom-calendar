import AppLayout from '@/components/AppLayout';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, AlertTriangle, PartyPopper } from 'lucide-react';
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_COLORS } from '@/types/studybloom';

const HomePage = () => {
  const { activities, subjects } = useStore();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const in7days = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];
  const ago7days = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];

  const upcoming = activities.filter(
    (a) => a.date && a.date >= today && a.date <= in7days && a.status !== 'feito'
  );
  const overdue = activities.filter(
    (a) => a.date && a.date < today && a.status !== 'feito'
  );
  const completed = activities.filter(
    (a) => a.status === 'feito' && (!a.date || (a.date >= ago7days && a.date <= today))
  );

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || 'Sem matéria';
  const getSubjectColor = (id: string) => subjects.find((s) => s.id === id)?.color || '#E8A0BF';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display text-primary">Olá! 🌸</h1>
          <p className="text-muted-foreground font-body">Veja o resumo dos seus estudos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Próximas Atividades */}
          <Card className="rounded-2xl border-border shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-bloom-blue/20 to-bloom-purple/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground font-normal">
                <CalendarClock className="text-bloom-blue" size={22} />
                Próximas Atividades
              </CardTitle>
              <p className="text-xs text-muted-foreground font-body">Próximos 7 dias</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body text-center py-4">
                  Nenhuma atividade 🎉
                </p>
              ) : (
                upcoming.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ACTIVITY_TYPE_COLORS[a.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {getSubjectName(a.subjectId)} · {a.date}
                      </p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-1 rounded-full font-body font-semibold text-primary-foreground"
                      style={{ backgroundColor: ACTIVITY_TYPE_COLORS[a.type] }}
                    >
                      {ACTIVITY_TYPE_LABELS[a.type]}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Atenção Atraso */}
          <Card className="rounded-2xl border-border shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-bloom-red/20 to-bloom-orange/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground font-normal">
                <AlertTriangle className="text-bloom-red" size={22} />
                Atenção: Atraso!
              </CardTitle>
              <p className="text-xs text-muted-foreground font-body">Atividades atrasadas</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {overdue.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body text-center py-4">
                  Tudo em dia! 💪
                </p>
              ) : (
                overdue.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ACTIVITY_TYPE_COLORS[a.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {getSubjectName(a.subjectId)} · {a.date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Você Arrasou */}
          <Card className="rounded-2xl border-border shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-bloom-green/20 to-bloom-yellow/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground font-normal">
                <PartyPopper className="text-bloom-green" size={22} />
                Você Arrasou!
              </CardTitle>
              <p className="text-xs text-muted-foreground font-body">Feitas nos últimos 7 dias</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {completed.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body text-center py-4">
                  Complete atividades para vê-las aqui! 📚
                </p>
              ) : (
                completed.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-bloom-green/10 border border-bloom-green/20"
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0 bg-bloom-green" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body truncate line-through opacity-70">{a.title}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {getSubjectName(a.subjectId)}
                      </p>
                    </div>
                    <span className="text-lg">✅</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;

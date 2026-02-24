import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useStore } from '@/store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACTIVITY_TYPE_COLORS } from '@/types/studybloom';

interface Holiday {
  date: string;
  name: string;
  type: string;
}

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const CalendarPage = () => {
  const { activities, subjects } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHolidays(data);
      })
      .catch(() => setHolidays([]));
  }, [year]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter((a) => a.date === dateStr);
  };

  const getHolidayForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find((h) => h.date === dateStr);
  };

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="h-24 md:h-28" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayActivities = getActivitiesForDay(day);
    const holiday = getHolidayForDay(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    cells.push(
      <div
        key={day}
        className={`h-24 md:h-28 rounded-xl border p-1.5 transition-all hover:shadow-md ${
          isToday
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border bg-card'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-body font-bold ${
              isToday ? 'text-primary' : 'text-foreground'
            }`}
          >
            {day}
          </span>
          {holiday && (
            <span className="text-[8px] bg-bloom-yellow/30 text-foreground px-1 rounded font-body truncate max-w-[60px]" title={holiday.name}>
              🎉
            </span>
          )}
        </div>
        <div className="space-y-0.5 overflow-hidden">
          {holiday && (
            <div className="text-[9px] px-1 py-0.5 rounded bg-bloom-yellow/20 text-foreground font-body truncate" title={holiday.name}>
              {holiday.name}
            </div>
          )}
          {dayActivities.slice(0, 2).map((a) => (
            <div
              key={a.id}
              className="text-[9px] px-1 py-0.5 rounded text-primary-foreground font-body truncate"
              style={{ backgroundColor: ACTIVITY_TYPE_COLORS[a.type] }}
              title={a.title}
            >
              {a.title}
            </div>
          ))}
          {dayActivities.length > 2 && (
            <div className="text-[9px] text-muted-foreground font-body">
              +{dayActivities.length - 2} mais
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display text-primary">Calendário 📅</h1>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_TYPE_COLORS.prova }} />
            <span className="text-xs font-body">Provas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_TYPE_COLORS.trabalho }} />
            <span className="text-xs font-body">Trabalhos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_TYPE_COLORS.lista }} />
            <span className="text-xs font-body">Listas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-bloom-yellow" />
            <span className="text-xs font-body">Feriados</span>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4 bg-card rounded-2xl p-4 border border-border shadow-sm">
          <Button variant="ghost" onClick={prevMonth} className="rounded-xl">
            <ChevronLeft size={20} />
          </Button>
          <h2 className="text-xl font-display text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="ghost" onClick={nextMonth} className="rounded-xl">
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-xs font-body font-bold text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{cells}</div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Activity,
  ActivityType,
  ActivityStatus,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_COLORS,
} from '@/types/studybloom';

const ActivitiesPage = () => {
  const { activities, subjects, addActivity, removeActivity, updateActivity } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<ActivityType>('trabalho');
  const [newSubjectId, setNewSubjectId] = useState('');

  const handleAdd = () => {
    if (!newTitle || !newSubjectId) return;
    const activity: Activity = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate || undefined,
      type: newType,
      status: 'a_fazer',
      subjectId: newSubjectId,
    };
    addActivity(activity);
    setNewTitle('');
    setNewDate('');
    setNewType('trabalho');
    setNewSubjectId('');
    setDialogOpen(false);
  };

  const cycleStatus = (id: string, current: ActivityStatus) => {
    const order: ActivityStatus[] = ['a_fazer', 'em_progresso', 'feito'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateActivity(id, { status: next });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newSubjectId = destination.droppableId;
    updateActivity(draggableId, { subjectId: newSubjectId });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display text-primary">Atividades 📋</h1>
            <p className="text-muted-foreground font-body text-sm">Organize suas tarefas por matéria</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="rounded-xl font-body gap-2">
            <Plus size={18} /> Nova Atividade
          </Button>
        </div>

        {/* Trello-style board with drag and drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {subjects.map((subject) => {
              const subjectActivities = activities.filter((a) => a.subjectId === subject.id);
              return (
                <div
                  key={subject.id}
                  className="flex-shrink-0 w-72 bg-card rounded-2xl border border-border shadow-sm"
                >
                  <div
                    className="px-4 py-3 rounded-t-2xl flex items-center gap-2"
                    style={{ backgroundColor: subject.color + '30' }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <h3 className="font-display text-sm text-foreground">{subject.name}</h3>
                    <span className="text-xs text-muted-foreground font-body ml-auto">
                      {subjectActivities.length}
                    </span>
                  </div>

                  <Droppable droppableId={subject.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 space-y-2 max-h-[60vh] overflow-y-auto min-h-[60px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-accent/30' : ''
                        }`}
                      >
                        {subjectActivities.length === 0 && !snapshot.isDraggingOver ? (
                          <p className="text-xs text-muted-foreground font-body text-center py-4">
                            Nenhuma atividade
                          </p>
                        ) : (
                          subjectActivities.map((activity, index) => (
                            <Draggable key={activity.id} draggableId={activity.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-background rounded-xl border border-border p-3 shadow-sm hover:shadow-md transition-shadow ${
                                    snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/30' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div {...provided.dragHandleProps} className="mt-0.5 text-muted-foreground cursor-grab active:cursor-grabbing">
                                      <GripVertical size={14} />
                                    </div>
                                    <p className="text-sm font-body text-foreground flex-1">
                                      {activity.title}
                                    </p>
                                    <button
                                      onClick={() => removeActivity(activity.id)}
                                      className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  {activity.date && (
                                    <p className="text-xs text-muted-foreground font-body mt-1">
                                      📅 {activity.date}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 mt-2">
                                    <span
                                      className="text-[10px] px-2 py-0.5 rounded-full text-primary-foreground font-body"
                                      style={{ backgroundColor: ACTIVITY_TYPE_COLORS[activity.type] }}
                                    >
                                      {ACTIVITY_TYPE_LABELS[activity.type]}
                                    </span>
                                    <button
                                      onClick={() => cycleStatus(activity.id, activity.status)}
                                      className={`text-[10px] px-2 py-0.5 rounded-full font-body border transition-colors cursor-pointer ${
                                        activity.status === 'feito'
                                          ? 'bg-bloom-green/20 text-foreground border-bloom-green/30'
                                          : activity.status === 'em_progresso'
                                          ? 'bg-bloom-yellow/20 text-foreground border-bloom-yellow/30'
                                          : 'bg-secondary text-secondary-foreground border-border'
                                      }`}
                                    >
                                      {ACTIVITY_STATUS_LABELS[activity.status]}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Add Activity Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-primary">Nova Atividade 🌸</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-body font-semibold">Título</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Prova de Cálculo"
                  className="rounded-xl mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-body font-semibold">Data (opcional)</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="rounded-xl mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-body font-semibold">Tipo</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as ActivityType)}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prova">🔴 Prova</SelectItem>
                    <SelectItem value="trabalho">🔵 Trabalho</SelectItem>
                    <SelectItem value="lista">🟢 Lista</SelectItem>
                    <SelectItem value="estudo">🟡 Estudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-body font-semibold">Matéria</label>
                <Select value={newSubjectId} onValueChange={setNewSubjectId}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} className="rounded-xl font-body">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ActivitiesPage;

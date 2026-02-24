import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, ClipboardList, BookOpen, LogOut } from 'lucide-react';
import CatMascot from './CatMascot';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/calendario', label: 'Calendário', icon: Calendar },
  { path: '/atividades', label: 'Atividades', icon: ClipboardList },
  { path: '/materias', label: 'Matérias', icon: BookOpen },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col shadow-lg z-50">
      <div className="p-6 flex flex-col items-center border-b border-border">
        <CatMascot size={80} className="animate-float" />
        <h1 className="text-2xl font-display text-primary mt-2">StudyBloom</h1>
        <p className="text-xs text-muted-foreground font-body">🌸 Organize seus estudos 🌸</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-body font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

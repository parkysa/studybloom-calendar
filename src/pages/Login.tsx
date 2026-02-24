import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CatMascot from '@/components/CatMascot';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bloom-pink-light via-background to-accent p-4">
      {/* Decorative flowers */}
      <div className="fixed top-10 left-10 text-4xl animate-float">🌸</div>
      <div className="fixed top-20 right-20 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🌷</div>
      <div className="fixed bottom-20 left-20 text-3xl animate-float" style={{ animationDelay: '1s' }}>🌺</div>
      <div className="fixed bottom-10 right-10 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>✿</div>

      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border relative overflow-hidden">
          {/* Top decorative wave */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bloom-pink via-bloom-purple to-bloom-pink" />
          
          <div className="flex flex-col items-center mb-8">
            <CatMascot size={100} className="animate-float mb-4" />
            <h1 className="text-3xl font-display text-primary">StudyBloom</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">🌸 Bem-vindo(a) de volta! 🌸</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-body font-semibold text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl border-border bg-secondary/50 focus:ring-primary h-12 font-body"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-body font-semibold text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl border-border bg-secondary/50 focus:ring-primary h-12 font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-primary hover:underline font-body">Esqueceu a senha?</a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-body font-bold text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🌸 Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground font-body">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

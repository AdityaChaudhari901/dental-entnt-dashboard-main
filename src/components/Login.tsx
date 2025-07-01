import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, User } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('dental-center-user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.role}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }

    setLoading(false);
  };

  const handleDemoLogin = (role: 'Admin' | 'Patient') => {
    const demoCredentials =
      role === 'Admin'
        ? { email: 'admin@entnt.in', password: 'admin123' }
        : { email: 'john@entnt.in', password: 'patient123' };

    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 via-white to-medical-100 p-4">
      <Card className="w-full max-w-md rounded-3xl backdrop-blur-xl bg-white/70 shadow-xl border border-medical-200 animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-medical-800 flex items-center justify-center gap-2">
            🦷 Dental Center
          </CardTitle>
          <CardDescription className="text-medical-600 text-sm">
            Login to manage patients, appointments, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-medical-700 flex items-center gap-2">
                <Mail size={16} /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-medical-500 bg-white/90 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-medical-700 flex items-center gap-2">
                <LockKeyhole size={16} /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-medical-500 bg-white/90 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-medical-600 hover:bg-medical-700 transition-all text-white font-semibold tracking-wide shadow-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-xs text-muted-foreground">Or use demo accounts:</p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 border border-gray-300 hover:border-medical-500 hover:bg-medical-50 transition"
                onClick={() => handleDemoLogin('Admin')}
              >
                <User size={14} className="mr-2" /> Admin Demo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 border border-gray-300 hover:border-medical-500 hover:bg-medical-50 transition"
                onClick={() => handleDemoLogin('Patient')}
              >
                <User size={14} className="mr-2" /> Patient Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

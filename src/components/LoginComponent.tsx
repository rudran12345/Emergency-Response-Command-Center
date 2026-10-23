import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundService } from '../services/sound.service';

interface LoginComponentProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username.trim() === 'admin' && password === 'admin123') {
        if (rememberMe) {
          localStorage.setItem('ercc_logged_in_user', 'admin');
        }
        soundService.playDispatch();
        onLoginSuccess('Admin Operator');
      } else {
        setErrorMessage('Invalid username or password. Demo login: admin / admin123');
        soundService.playAlertCritical();
      }
    }, 300);
  };

  const handleInstantDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    soundService.playDispatch();
    if (rememberMe) {
      localStorage.setItem('ercc_logged_in_user', 'admin');
    }
    onLoginSuccess('Admin Operator');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#090d16]">
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Emergency Response Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Monitoring &amp; Response Management System
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-white placeholder-slate-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <span className="text-slate-500 text-[11px]">Frontend Mode</span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Demo Credentials
            </span>
            <span className="text-slate-500">admin / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            1-Click Instant Demo Login &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

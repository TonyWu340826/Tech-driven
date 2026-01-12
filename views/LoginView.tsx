import React, { useState } from 'react';
import { authService } from '../src/services/api';

interface LoginViewProps {
  onLogin: () => void;
  onRegisterClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transform rotate-3">
            <span className="material-symbols-outlined text-white text-4xl">school</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">欢迎回来</h1>
          <p className="text-slate-500 dark:text-slate-400">登录您的 TutorConnect 账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">邮箱</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">mail</span>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="block w-full pl-10 pr-3 py-3.5 border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">密码</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">lock</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-3.5 border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm font-medium text-primary hover:text-blue-600 dark:hover:text-blue-400">
              忘记密码?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-base font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark text-slate-500">或使用以下方式登录</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="font-bold text-xl mr-2">G</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined mr-2 text-[22px] text-slate-900 dark:text-white">apple</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Apple</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          还没有账号?{' '}
          <button onClick={onRegisterClick} className="font-bold text-primary hover:text-blue-500">
            立即注册
          </button>
        </p>
      </div>
    </div>
  );
};
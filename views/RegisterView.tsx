import React, { useState } from 'react';
import { authService } from '../src/services/api';

interface RegisterViewProps {
  onRegister: () => void;
  onLoginClick: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.register(name, email, password);
      onRegister();
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm z-10">
        <div className="mb-8">
          <button onClick={onLoginClick} className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4">
            <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
            返回登录
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">创建账号</h1>
          <p className="text-slate-500 dark:text-slate-400">开启您的学习之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">全名</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">person</span>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="block w-full pl-10 pr-3 py-3.5 border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

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

          <div className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-slate-500 dark:text-slate-400">
                我已阅读并同意 <a href="#" className="font-medium text-primary hover:underline">服务条款</a> 和 <a href="#" className="font-medium text-primary hover:underline">隐私政策</a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 mt-6 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-base font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '注册中...' : '注册账号'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          已有账号?{' '}
          <button onClick={onLoginClick} className="font-bold text-primary hover:text-blue-500">
            直接登录
          </button>
        </p>
      </div>
    </div>
  );
};
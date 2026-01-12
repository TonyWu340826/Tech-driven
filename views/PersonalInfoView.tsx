import React from 'react';

interface PersonalInfoViewProps {
  onBack: () => void;
}

export const PersonalInfoView: React.FC<PersonalInfoViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-10">
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">个人信息</h2>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="relative mb-6">
             <div className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-lg" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_CwpCpswiBc5dIs1yBmCpL29ULXZS57AH4uKwCtVMY01VDJUDpd_UOPVo-H1GsoI04_t2vDCbLoEtJjkKLkaW8vJCb8YcEBvEFlE_t8VSQoHZGc9q2HO0TjhgWhe_mG1h_y8on4Uj6ByTSZtFThOf8h4OvYheDhjzgZop5udUx8TSR9JYQN7NFawGHSY0Ln7JCF_EqlPOOy2jeJNGBZkmTLynGjA8KBlJDd83-oP32tch9yLl5wPRY4GEEPYlAPgx70lvNET3IBvu')"}}></div>
             <button className="absolute bottom-1 right-1 p-2 bg-primary rounded-full text-white border-2 border-background-light dark:border-background-dark shadow-md">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
        </div>

        <form className="w-full space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">姓名</label>
                <input type="text" defaultValue="Alex Johnson" className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4 py-3" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">邮箱</label>
                <input type="email" defaultValue="alex.j@example.com" className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4 py-3" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">电话</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4 py-3" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">年级</label>
                <select className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4 py-3">
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                    <option>University</option>
                </select>
            </div>
        </form>

        <button className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
            保存修改
        </button>
      </div>
    </div>
  );
};
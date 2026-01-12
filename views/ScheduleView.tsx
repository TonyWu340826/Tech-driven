import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';

interface ScheduleViewProps {
  scheduleItems: ScheduleItem[];
  onJoinClass: () => void;
  onContactTutor: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ scheduleItems, onJoinClass, onContactTutor }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'canceled'>('upcoming');
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 24)); // Start at Oct 24, 2023
  const [selectedDay, setSelectedDay] = useState(24);

  const filteredItems = scheduleItems.filter(item => item.status === activeTab);

  // Helper to generate days for the current view
  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate a sliding window of days centered roughly around selectedDay or beginning of month
    // For simplicity in this mock, let's just show a week around the selected date
    let startDay = selectedDay - 2;
    if (startDay < 1) startDay = 1;
    if (startDay + 5 > daysInMonth) startDay = daysInMonth - 5;
    if (startDay < 1) startDay = 1;

    const days = [];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    for (let i = 0; i < 6; i++) {
        const d = startDay + i;
        if (d > daysInMonth) break;
        const dateObj = new Date(year, month, d);
        days.push({
            day: weekDays[dateObj.getDay()],
            date: d.toString(),
            dot: (d % 2 !== 0) // Mocking "has event" dot
        });
    }
    return days;
  };

  const dates = generateDays();

  const handleMonthChange = (delta: number) => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
      setCurrentDate(newDate);
      setSelectedDay(1); // Reset selected day to 1st of new month
  };

  const tabs = [
    { label: '待上课', value: 'upcoming' as const },
    { label: '已结束', value: 'completed' as const },
    { label: '已取消', value: 'canceled' as const },
  ];

  const formatMonth = (date: Date) => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-24">
      <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1">我的课表</h2>
        <div className="flex items-center justify-end">
          <button className="flex items-center justify-center rounded-full h-10 w-10 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-[#232f48] p-1">
          {tabs.map((tab) => {
             const isActive = activeTab === tab.value;
             return (
               <button 
                  key={tab.value} 
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md transition-all ${isActive ? 'bg-white dark:bg-[#111722] shadow-sm text-primary dark:text-white' : 'text-slate-600 dark:text-[#92a4c9]'}`}
               >
                  <span className="truncate text-sm font-medium leading-normal">{tab.label}</span>
               </button>
             );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">{formatMonth(currentDate)}</p>
          <div className="flex gap-2">
            <button 
                onClick={() => handleMonthChange(-1)}
                className="flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button 
                onClick={() => handleMonthChange(1)}
                className="flex items-center justify-center size-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {dates.map(d => {
            const isActive = selectedDay.toString() === d.date;
            return (
              <button 
                key={d.date} 
                onClick={() => setSelectedDay(parseInt(d.date))}
                className={`flex flex-col items-center justify-center min-w-[48px] h-[72px] rounded-xl gap-1 transition-all ${isActive ? 'bg-primary shadow-lg shadow-primary/25 transform scale-105' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-[#192233]'}`}
              >
                <span className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-[#92a4c9]'}`}>{d.day}</span>
                <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-700 dark:text-white'}`}>{d.date}</span>
                {isActive && <span className="size-1 rounded-full bg-white mt-0.5"></span>}
                {d.dot && !isActive && <span className="size-1 rounded-full bg-primary mt-0.5"></span>}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="text-slate-900 dark:text-white tracking-light text-lg font-bold leading-tight px-4 text-left pb-3 pt-4">今日课程</h3>
      
      <div className="flex flex-col px-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="flex flex-col rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-center bg-cover border border-gray-200 dark:border-gray-700" style={{backgroundImage: `url('${item.tutorImage}')`}}></div>
                <div>
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">{item.tutorName}</p>
                  <p className="text-slate-500 dark:text-[#92a4c9] text-xs font-medium">{item.subject}</p>
                </div>
              </div>
              {item.label ? (
                 <span className="inline-flex items-center rounded-md bg-green-500/10 dark:bg-green-500/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {item.label}
                 </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10">
                  {activeTab === 'completed' ? '已结束' : activeTab === 'canceled' ? '已取消' : '待上课'}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-[#111722] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 dark:text-[#92a4c9] text-[20px]">schedule</span>
                <span className="text-sm font-medium text-slate-700 dark:text-white">{item.startTime} - {item.endTime}</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[20px] ${item.type === 'online' ? 'text-primary' : 'text-orange-500'}`}>
                    {item.type === 'online' ? 'videocam' : 'home_pin'}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-white">{item.type === 'online' ? '在线课程' : '上门辅导'}</span>
              </div>
            </div>

            {item.type === 'online' ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoinClass();
                  }} 
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 bg-primary hover:bg-blue-600 text-white gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-[20px]">video_chat</span>
                    进入课堂
                </button>
            ) : (
                <div className="flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactTutor();
                      }}
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-lg h-10 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-white gap-2 text-sm font-bold transition-all active:scale-[0.98]"
                    >
                         <span className="material-symbols-outlined text-[20px]">chat</span>
                         联系老师
                    </button>
                    <button className="flex flex-1 cursor-pointer items-center justify-center rounded-lg h-10 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-white gap-2 text-sm font-bold transition-all active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px] text-orange-500">map</span>
                        查看地图
                    </button>
                </div>
            )}
          </div>
        ))}
        {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                <p className="text-sm">暂无课程</p>
            </div>
        )}
      </div>

      <div className="mt-2 px-4">
        <h4 className="text-slate-500 dark:text-[#92a4c9] text-sm font-semibold mb-3 uppercase tracking-wider pl-1">明天 {currentDate.getMonth() + 1}月{selectedDay + 1}日</h4>
        <div className="flex items-center justify-between rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800 opacity-70">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">JD</div>
                <div>
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">John Doe</p>
                    <p className="text-slate-500 dark:text-[#92a4c9] text-xs font-medium">10:00 - 11:00 • Calculus</p>
                </div>
            </div>
            <div className="flex items-center justify-center size-8 rounded-full bg-background-light dark:bg-[#111722] text-slate-400">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
        </div>
      </div>
    </div>
  );
};
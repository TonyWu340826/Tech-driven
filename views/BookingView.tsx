import React, { useState } from 'react';
import { Tutor } from '../types';

interface BookingViewProps {
  tutor: Tutor;
  onBack: () => void;
  onConfirm: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ tutor, onBack, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('10');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [sessionType, setSessionType] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        // Navigate after showing success message
        setTimeout(() => {
            onConfirm();
        }, 1500);
    }, 1000);
  };

  if (showSuccess) {
      return (
          <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-6xl text-green-600 dark:text-green-400 scale-100 animate-[bounce_0.5s_ease-in-out]">check</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">预约成功!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
                  您已成功预约 {tutor.name} 的课程。<br/>具体信息已发送至您的日历。
              </p>
          </div>
      );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">确认预约</h2>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 shrink-0 relative" style={{backgroundImage: `url('${tutor.image}')`}}>
            <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-card-dark"></div>
          </div>
          <div className="flex flex-col justify-center flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold leading-normal">{tutor.name}</h3>
                <p className="text-primary text-sm font-medium">{tutor.title}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md">
                <span className="material-symbols-outlined text-yellow-500 text-[16px] filled">star</span>
                <span className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">{tutor.rating}</span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-1">擅长微积分与代数</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">授课方式</h3>
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-200 dark:bg-card-dark p-1">
          <label className="flex cursor-pointer h-full flex-1 items-center justify-center rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-gray-500 dark:text-gray-400 transition-all duration-200">
            <input className="hidden peer" name="session_type" type="radio" value="online" checked={sessionType === 'online'} onChange={() => setSessionType('online')}/>
            <span className="material-symbols-outlined mr-2 text-[20px]">videocam</span>
            <span className="text-sm font-semibold">在线授课</span>
          </label>
          <label className="flex cursor-pointer h-full flex-1 items-center justify-center rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-gray-500 dark:text-gray-400 transition-all duration-200">
            <input className="hidden peer" name="session_type" type="radio" value="home" checked={sessionType === 'home'} onChange={() => setSessionType('home')}/>
            <span className="material-symbols-outlined mr-2 text-[20px]">home</span>
            <span className="text-sm font-semibold">线下上门</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">选择日期</h3>
          <button className="text-primary text-sm font-medium hover:underline">2023年10月</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-2">
            {[
                { day: '周一', date: '09', disabled: true },
                { day: '周二', date: '10', disabled: false },
                { day: '周三', date: '11', disabled: false },
                { day: '周四', date: '12', disabled: false },
                { day: '周五', date: '13', disabled: false },
                { day: '周六', date: '14', disabled: false },
            ].map(item => (
                 <button 
                    key={item.date}
                    disabled={item.disabled}
                    onClick={() => setSelectedDate(item.date)}
                    className={`flex flex-col items-center justify-center min-w-[64px] h-[80px] rounded-2xl transition-all
                        ${item.disabled ? 'bg-gray-100 dark:bg-card-dark text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed border border-transparent' : 
                          selectedDate === item.date 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 border border-primary transform scale-105' 
                            : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white hover:border-primary/50'
                        }`}
                 >
                    <span className={`text-xs font-medium mb-1 ${selectedDate === item.date ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'}`}>{item.day}</span>
                    <span className="text-xl font-bold">{item.date}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="mb-6 px-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">可选时间</h3>
        <div className="grid grid-cols-3 gap-3">
            {[
                { time: '09:00 AM', disabled: true },
                { time: '10:00 AM', disabled: false },
                { time: '11:00 AM', disabled: false, special: true },
                { time: '02:00 PM', disabled: false },
                { time: '03:30 PM', disabled: false },
                { time: '05:00 PM', disabled: false },
            ].map((slot, idx) => (
                <button 
                    key={idx}
                    disabled={slot.disabled}
                    onClick={() => !slot.disabled && setSelectedTime(slot.time)}
                    className={`relative py-3 px-2 rounded-xl text-sm font-medium transition-colors
                        ${slot.disabled ? 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-400 line-through decoration-gray-400 decoration-2 cursor-not-allowed' :
                          selectedTime === slot.time
                            ? 'border-2 border-primary bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark hover:border-primary/50 text-slate-900 dark:text-white'
                        }`}
                >
                    {slot.time}
                    {slot.special && <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">极速</div>}
                </button>
            ))}
        </div>
      </div>

      <div className="mb-6 px-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">上门地址</h3>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <input className="w-full bg-white dark:bg-card-dark text-slate-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400" placeholder="请输入详细地址" type="text" defaultValue="枫叶街123号, 4B室" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">老师将提前5分钟到达</p>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-bold mb-4">订单明细</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">时薪</span>
              <span className="font-medium">$40.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">时长</span>
              <span className="font-medium">1 小时</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">服务费 (5%)</span>
              <span className="font-medium">$2.00</span>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">总计</span>
              <span className="font-bold text-xl text-primary">$42.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <button className="flex w-full items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-card-dark/50 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-card-dark transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
               <span className="material-symbols-outlined text-[16px]">ios</span> Pay
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">苹果支付</span>
          </div>
          <span className="text-primary text-sm font-medium">修改</span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between max-w-lg mx-auto gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">待支付总额</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">$42.00</span>
          </div>
          <button 
            onClick={handleConfirm} 
            disabled={isProcessing}
            className={`flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    <span>确认预约</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Tutor } from '../types';
import { bookingService } from '../src/services/api';

interface BookingViewProps {
  tutor: Tutor;
  onBack: () => void;
  onConfirm: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ tutor, onBack, onConfirm }) => {
  const today = new Date();
  const initY = today.getFullYear();
  const initM = String(today.getMonth() + 1).padStart(2, '0');
  const initD = String(today.getDate()).padStart(2, '0');
  const [selectedDate, setSelectedDate] = useState(`${initY}-${initM}-${initD}`);
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [sessionType, setSessionType] = useState('home');
  const [address, setAddress] = useState('枫叶街123号, 4B室');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      // 构建预约数据
      // selectedDate 现在已经是 YYYY-MM-DD 格式
      const startDateTime = new Date(`${selectedDate} ${selectedTime}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1); // 默认1小时课程

      // 转换为 MySQL DATETIME 格式 (YYYY-MM-DD HH:MM:SS)
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const bookingData = {
        tutor_id: parseInt(tutor.id),
        subject: tutor.subject || '数学',
        start_time: formatDateTime(startDateTime),
        end_time: formatDateTime(endDateTime),
        type: sessionType === 'online' ? 'online' : 'in-person',
        address: sessionType === 'home' ? address : null,
        amount: sessionType === 'home' ? tutor.price + 50 : tutor.price,
        notes: `预约${tutor.name}老师的${tutor.subject}课程`
      };

      await bookingService.create(bookingData);

      setIsProcessing(false);
      setShowSuccess(true);

      // Navigate after showing success message
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (error: any) {
      setIsProcessing(false);
      alert(error.response?.data?.message || '预约失败，请重试');
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-6xl text-blue-600 dark:text-blue-400 scale-100 animate-[bounce_0.5s_ease-in-out]">pending_actions</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">预约已提交</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
          您的预约申请已发送给 {tutor.name}。<br />后台审核通过后，您将在“我的课表”中看到。
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
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 shrink-0 relative bg-slate-200"
            style={{ backgroundImage: tutor.image ? `url('${tutor.image}')` : `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.name}&backgroundColor=${tutor.gender === 'female' ? 'ffdfbf' : 'c0aede'}')` }}>
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
          <button
            onClick={() => setSessionType('online')}
            className={`flex flex-1 items-center justify-center h-full rounded-lg transition-all duration-200 ${sessionType === 'online' ? 'bg-white dark:bg-background-dark shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">videocam</span>
            <span className="text-sm font-semibold">在线授课</span>
          </button>
          <button
            onClick={() => setSessionType('home')}
            className={`flex flex-1 items-center justify-center h-full rounded-lg transition-all duration-200 ${sessionType === 'home' ? 'bg-white dark:bg-background-dark shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">home</span>
            <span className="text-sm font-semibold">线下上门</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">选择日期</h3>
          <button className="text-primary text-sm font-medium hover:underline">
            {new Date(selectedDate).getFullYear()}年{new Date(selectedDate).getMonth() + 1}月
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-2">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const dayLabel = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
              const dateLabel = String(d.getDate()).padStart(2, '0');
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const fullDate = `${year}-${month}-${dateLabel}`; // YYYY-MM-DD
              const isSelected = selectedDate === fullDate;

              return (
                <button
                  key={fullDate}
                  onClick={() => setSelectedDate(fullDate)}
                  className={`flex flex-col items-center justify-center min-w-[64px] h-[80px] rounded-2xl border transition-all
                  ${isSelected ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 transform scale-105' : 'bg-white dark:bg-card-dark border-gray-100 dark:border-gray-800 text-slate-600 dark:text-gray-300'}`}
                >
                  <span className={`text-[11px] font-medium uppercase mb-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{i === 0 ? '今天' : dayLabel}</span>
                  <span className="text-lg font-bold">{dateLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6 px-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">选择时间</h3>
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
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-primary'}`}
            >
              {slot.time}
              {slot.special && selectedTime !== slot.time && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-primary"></span>}
            </button>
          ))}
        </div>
      </div>

      {sessionType === 'home' && (
        <div className="mb-6 px-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">上门地址</h3>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <input
              className="w-full bg-white dark:bg-card-dark text-slate-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
              placeholder="请输入详细地址"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 px-1">老师将提前5分钟到达</p>
        </div>
      )}

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
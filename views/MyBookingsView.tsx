/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 我的预约页面 - 显示用户的所有预约记录
 */

import React, { useState, useEffect } from 'react';
import { bookingService } from '../src/services/api';

interface Booking {
    id: number;
    tutorId: number;
    tutorName: string;
    tutorImage: string;
    tutorGender: string;
    tutorTitle: string;
    subject: string;
    status: 'pending' | 'approved' | 'completed' | 'canceled';
    paymentStatus: 'unpaid' | 'paid';
    amount: number;
    startTime: string;
    endTime: string;
    type: 'online' | 'in-person';
    address?: string;
    notes?: string;
    createdAt: string;
}

interface MyBookingsViewProps {
    onBack: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onBack }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed' | 'canceled'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('确定要取消这个预约吗？')) return;

        try {
            await bookingService.cancel(id);
            alert('预约已取消');
            fetchBookings();
        } catch (error: any) {
            alert(error.response?.data?.message || '取消失败');
        }
    };

    const handlePay = async (id: number, amount: number) => {
        if (!confirm(`确定要支付 ¥${amount} 吗？将从钱包余额中扣除。`)) return;

        try {
            const result = await bookingService.pay(id);
            alert(`支付成功！剩余余额：¥${result.newBalance}`);
            fetchBookings();
        } catch (error: any) {
            alert(error.response?.data?.message || '支付失败');
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: '预约中',
            approved: '已通过',
            completed: '已完成',
            canceled: '已取消'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            pending: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            completed: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
            canceled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        };
        return colorMap[status] || '';
    };

    const filteredBookings = activeTab === 'all'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold flex-1 text-center pr-10">我的预约</h2>
            </div>

            {/* Tabs */}
            <div className="px-4 py-3">
                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-[#232f48] p-1 overflow-x-auto no-scrollbar">
                    {[
                        { label: '全部', value: 'all' as const },
                        { label: '预约中', value: 'pending' as const },
                        { label: '已通过', value: 'approved' as const },
                        { label: '已完成', value: 'completed' as const },
                        { label: '已取消', value: 'canceled' as const },
                    ].map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md transition-all whitespace-nowrap px-3 ${isActive ? 'bg-white dark:bg-[#111722] shadow-sm text-primary dark:text-white' : 'text-slate-600 dark:text-[#92a4c9]'}`}
                            >
                                <span className="truncate text-sm font-medium leading-normal">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bookings List */}
            <div className="px-4 flex flex-col gap-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                        <p className="text-sm">暂无预约记录</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                            {/* Tutor Info */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={booking.tutorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.tutorName}&backgroundColor=${booking.tutorGender === 'female' ? 'ffdfbf' : 'c0aede'}`}
                                        alt={booking.tutorName}
                                        className="w-12 h-12 rounded-full object-cover bg-slate-200"
                                    />
                                    <div>
                                        <p className="font-bold text-base">{booking.tutorName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{booking.tutorTitle}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                                    {getStatusText(booking.status)}
                                </span>
                            </div>

                            {/* Booking Details */}
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">subject</span>
                                    <span className="text-slate-700 dark:text-slate-300">{booking.subject}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">schedule</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        {formatDateTime(booking.startTime)} - {new Date(booking.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">
                                        {booking.type === 'online' ? 'videocam' : 'home_pin'}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        {booking.type === 'online' ? '在线授课' : `上门辅导 - ${booking.address || '地址未填写'}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">payments</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        ¥{booking.amount} {booking.paymentStatus === 'paid' ? '(已支付)' : '(未支付)'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {booking.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className="flex-1 py-2 px-4 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        取消预约
                                    </button>
                                )}
                                {booking.status === 'approved' && booking.paymentStatus === 'unpaid' && (
                                    <button
                                        onClick={() => handlePay(booking.id, booking.amount)}
                                        className="flex-1 py-2 px-4 rounded-lg bg-primary text-white font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm"
                                    >
                                        立即支付 ¥{booking.amount}
                                    </button>
                                )}
                                {booking.status === 'approved' && booking.paymentStatus === 'paid' && (
                                    <div className="flex-1 py-2 px-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium text-sm text-center">
                                        已支付，等待上课
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 已上课时列表页面
 */

import React, { useState, useEffect } from 'react';
import { bookingService } from '../src/services/api';

interface CompletedClass {
    id: number;
    tutorId: number;
    tutorName: string;
    tutorImage: string;
    tutorGender: string;
    tutorTitle: string;
    subject: string;
    amount: number;
    startTime: string;
    endTime: string;
    type: 'online' | 'in-person';
    address?: string;
    rating?: number;
    review?: string;
}

interface CompletedClassesViewProps {
    onBack: () => void;
}

export const CompletedClassesView: React.FC<CompletedClassesViewProps> = ({ onBack }) => {
    const [classes, setClasses] = useState<CompletedClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompletedClasses();
    }, []);

    const fetchCompletedClasses = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getMyBookings();
            // 只显示已完成的课程
            const completed = data.filter((booking: any) => booking.status === 'completed');
            setClasses(completed);
        } catch (error) {
            console.error('Failed to fetch completed classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        return hours.toFixed(1);
    };

    const handleReview = (classItem: CompletedClass) => {
        // TODO: 打开评价弹窗
        alert(`评价功能开发中\n课程ID: ${classItem.id}\n老师: ${classItem.tutorName}`);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold flex-1 text-center pr-10">已上课时</h2>
            </div>

            {/* Stats */}
            <div className="px-4 py-4">
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90 mb-1">累计上课</p>
                            <p className="text-3xl font-bold">{classes.length}</p>
                            <p className="text-xs opacity-75 mt-1">节课程</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-90 mb-1">累计时长</p>
                            <p className="text-3xl font-bold">
                                {classes.reduce((total, c) => total + parseFloat(calculateDuration(c.startTime, c.endTime)), 0).toFixed(1)}
                            </p>
                            <p className="text-xs opacity-75 mt-1">小时</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Classes List */}
            <div className="px-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">school</span>
                        <p className="text-sm">暂无已完成的课程</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {classes.map(classItem => (
                            <div key={classItem.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                                {/* Tutor Info */}
                                <div className="flex items-start gap-3 mb-3">
                                    <img
                                        src={classItem.tutorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${classItem.tutorName}&backgroundColor=${classItem.tutorGender === 'female' ? 'ffdfbf' : 'c0aede'}`}
                                        alt={classItem.tutorName}
                                        className="w-12 h-12 rounded-full object-cover bg-slate-200"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-base">{classItem.tutorName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{classItem.tutorTitle}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                        已完成
                                    </span>
                                </div>

                                {/* Class Details */}
                                <div className="space-y-2 mb-3 bg-background-light dark:bg-background-dark rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">subject</span>
                                        <span className="text-slate-700 dark:text-slate-300">{classItem.subject}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">schedule</span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {formatDateTime(classItem.startTime)} - {new Date(classItem.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                            <span className="ml-2 text-xs text-slate-500">({calculateDuration(classItem.startTime, classItem.endTime)}小时)</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">
                                            {classItem.type === 'online' ? 'videocam' : 'home_pin'}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {classItem.type === 'online' ? '在线授课' : `上门辅导 - ${classItem.address || '地址未填写'}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">payments</span>
                                        <span className="text-slate-700 dark:text-slate-300">¥{classItem.amount}</span>
                                    </div>
                                </div>

                                {/* Review Section */}
                                {classItem.rating ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className={`material-symbols-outlined text-sm ${star <= (classItem.rating || 0) ? 'text-yellow-500 filled' : 'text-gray-300'}`}>
                                                    star
                                                </span>
                                            ))}
                                            <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">已评价</span>
                                        </div>
                                        {classItem.review && (
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{classItem.review}</p>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleReview(classItem)}
                                        className="w-full py-2 px-4 rounded-lg border border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
                                    >
                                        评价课程
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

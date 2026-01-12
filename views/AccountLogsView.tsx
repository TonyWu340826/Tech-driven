/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 账户流水页面
 */

import React, { useState, useEffect } from 'react';
import { userService } from '../src/services/api';

interface AccountLog {
    id: number;
    changeAmount: number;
    beforeBalance: number;
    afterBalance: number;
    bizType: string;
    bizId: string;
    remark: string;
    createdAt: string;
}

interface AccountLogsViewProps {
    onBack: () => void;
}

export const AccountLogsView: React.FC<AccountLogsViewProps> = ({ onBack }) => {
    const [logs, setLogs] = useState<AccountLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await userService.getAccountLogs();
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch account logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBizTypeName = (bizType: string) => {
        const typeMap: Record<string, string> = {
            'BOOKING_PAYMENT': '课程支付',
            'RECHARGE': '充值',
            'REFUND': '退款',
            'WITHDRAW': '提现'
        };
        return typeMap[bizType] || bizType;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold flex-1 text-center pr-10">账户流水</h2>
            </div>

            {/* Logs List */}
            <div className="px-4 py-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
                        <p className="text-sm">暂无流水记录</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.map(log => (
                            <div key={log.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <p className="font-bold text-base mb-1">{getBizTypeName(log.bizType)}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{log.remark}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${log.changeAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {log.changeAmount >= 0 ? '+' : ''}¥{Math.abs(log.changeAmount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span>余额: ¥{log.afterBalance.toFixed(2)}</span>
                                    <span>{formatDateTime(log.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

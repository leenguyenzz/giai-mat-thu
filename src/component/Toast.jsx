import React, { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose, duration = 3000 }) {
    // Tự động đóng toast sau khoảng thời gian thiết lập (mặc định 3 giây)
    useEffect(() => {
        if (!message) return;
        
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    // Nếu không có tin nhắn, không render gì cả
    if (!message) return null;

    // Cấu hình màu sắc & icon theo từng loại type
    const toastConfig = {
        success: {
            bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            iconBg: 'bg-emerald-100 text-emerald-600',
            icon: '✓'
        },
        error: {
            bgColor: 'bg-rose-50 border-rose-200 text-rose-800',
            iconBg: 'bg-rose-100 text-rose-600',
            icon: '✕'
        },
        warning: {
            bgColor: 'bg-amber-50 border-amber-200 text-amber-800',
            iconBg: 'bg-amber-100 text-amber-600',
            icon: '⚠️'
        }
    };

    const currentConfig = toastConfig[type] || toastConfig.error;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 sm:w-full animate-[fadeIn_0.2s_ease-out] select-none">
            <div className={`border p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-xs ${currentConfig.bgColor}`}>
                {/* Icon trạng thái */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-base shadow-2xs ${currentConfig.iconBg}`}>
                    {currentConfig.icon}
                </div>
                
                {/* Nội dung thông báo */}
                <div className="flex-1 text-xs font-bold leading-snug tracking-wide">
                    {message}
                </div>
                
                {/* Nút đóng chủ động */}
                <button 
                    onClick={onClose}
                    className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity text-sm font-black cursor-pointer"
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
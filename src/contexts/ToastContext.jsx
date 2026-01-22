import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getStyle = (type) => {
        switch (type) {
            case 'success': return { borderColor: 'var(--success-500)', color: 'var(--success-500)' };
            case 'error': return { borderColor: 'var(--error-500)', color: 'var(--error-500)' };
            case 'warning': return { borderColor: 'var(--warning-500)', color: 'var(--warning-500)' };
            default: return { borderColor: 'var(--primary-500)', color: 'var(--primary-500)' };
        }
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="toast"
                    style={{ borderLeftColor: getStyle(toast.type).borderColor }}
                >
                    <span style={{ color: getStyle(toast.type).color }}>
                        {getIcon(toast.type)}
                    </span>
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="btn btn-ghost btn-icon"
                        style={{ padding: '4px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

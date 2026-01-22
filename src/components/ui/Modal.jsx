import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: '400px' },
        md: { maxWidth: '500px' },
        lg: { maxWidth: '700px' },
        xl: { maxWidth: '900px' },
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                style={sizeStyles[size]}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export function Tabs({ tabs, activeTab, onChange }) {
    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.icon && <tab.icon size={18} style={{ marginRight: '0.5rem' }} />}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="empty-state">
            {Icon && <Icon className="empty-state-icon" size={80} />}
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {action}
        </div>
    );
}

export function Loader({ size = 'md', className = '' }) {
    const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';
    return <div className={`spinner ${sizeClass} ${className}`} />;
}

export function Divider({ className = '' }) {
    return <div className={`divider ${className}`} />;
}

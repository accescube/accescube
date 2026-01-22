import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className={Icon ? 'input-icon' : ''}>
                {Icon && <Icon className="icon" size={20} />}
                <input
                    ref={ref}
                    className={`input ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

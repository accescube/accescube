import { forwardRef } from 'react';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';

    return (
        <button
            ref={ref}
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <div className="spinner-sm" />}
            {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

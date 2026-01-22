import { Star, CheckCircle } from 'lucide-react';

export function Badge({ children, variant = 'primary', className = '' }) {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
}

export function VerifiedBadge({ size = 16 }) {
    return (
        <CheckCircle
            size={size}
            fill="var(--success-500)"
            color="white"
            className="inline-block"
        />
    );
}

export function Rating({ value, count, showCount = true, size = 'md' }) {
    const starSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

    return (
        <div className="rating" style={{ fontSize: size === 'sm' ? 'var(--font-size-xs)' : 'var(--font-size-sm)' }}>
            <Star size={starSize} fill="var(--warning-400)" color="var(--warning-400)" />
            <span className="font-semibold">{value}</span>
            {showCount && count !== undefined && (
                <span className="text-tertiary">({count})</span>
            )}
        </div>
    );
}

export function Avatar({
    src,
    name,
    size = 'md',
    showStatus = false,
    status = 'online',
    className = ''
}) {
    const sizeClass = `avatar-${size}`;
    const initials = name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className={`avatar ${sizeClass} ${className}`} style={{ position: 'relative' }}>
            {src ? (
                <img src={src} alt={name} />
            ) : (
                <span>{initials || '?'}</span>
            )}
            {showStatus && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: size === 'sm' ? 8 : 12,
                        height: size === 'sm' ? 8 : 12,
                        borderRadius: '50%',
                        background: status === 'online' ? 'var(--success-500)' : 'var(--neutral-400)',
                        border: '2px solid var(--bg-elevated)',
                    }}
                />
            )}
        </div>
    );
}

export function SkillBadge({ children }) {
    return (
        <span
            className="badge badge-neutral"
            style={{
                textTransform: 'none',
                letterSpacing: 'normal',
                fontWeight: 500,
            }}
        >
            {children}
        </span>
    );
}

import { Heart, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CubeCard({
    type, // 'agent' | 'space' | 'employer'
    data,
    onFavorite,
    isFavorite = false,
}) {
    const getLink = () => {
        switch (type) {
            case 'agent': return `/discover/agents/${data.id}`;
            case 'space': return `/discover/spaces/${data.id}`;
            case 'employer': return `/discover/companies/${data.id}`;
            default: return '#';
        }
    };

    const getSubtitle = () => {
        switch (type) {
            case 'agent': return data.title;
            case 'space': return data.type.charAt(0).toUpperCase() + data.type.slice(1);
            case 'employer': return data.industry;
            default: return '';
        }
    };

    const getPrice = () => {
        if (type === 'agent') {
            return `$${data.hourlyRate}/hr`;
        }
        if (type === 'space') {
            if (data.pricing.hourly) return `$${data.pricing.hourly}/hr`;
            if (data.pricing.daily) return `$${data.pricing.daily}/day`;
            if (data.pricing.monthly) return `$${data.pricing.monthly}/mo`;
        }
        return null;
    };

    const getBadge = () => {
        if (data.verified) return { text: 'Verified', class: 'badge-success' };
        if (data.featured) return { text: 'Featured', class: 'badge-primary' };
        if (data.discount) return { text: `${data.discount.percent}% Off`, class: 'badge-warning' };
        return null;
    };

    const badge = getBadge();

    return (
        <Link to={getLink()} className="cube-card card-interactive">
            <div className="cube-card-image">
                <div className="flex items-center justify-center h-full text-5xl" style={{ background: 'var(--gradient-card)' }}>
                    {type === 'agent' && '👤'}
                    {type === 'space' && '🏢'}
                    {type === 'employer' && '🏛️'}
                </div>

                {badge && (
                    <div className="cube-card-badge">
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </div>
                )}

                <button
                    className="cube-card-favorite"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavorite?.(type, data.id);
                    }}
                >
                    <Heart
                        size={18}
                        fill={isFavorite ? 'currentColor' : 'none'}
                        color={isFavorite ? 'var(--error-500)' : 'currentColor'}
                    />
                </button>
            </div>

            <div className="cube-card-content">
                <h3 className="cube-card-title truncate">{data.name}</h3>
                <p className="cube-card-subtitle">{getSubtitle()}</p>

                <div className="flex items-center gap-2 text-sm text-secondary mb-3">
                    <MapPin size={14} />
                    <span className="truncate">{data.location}</span>
                </div>

                <div className="cube-card-meta">
                    <div className="cube-card-rating">
                        <Star size={14} fill="var(--warning-400)" color="var(--warning-400)" />
                        <span>{data.rating}</span>
                        <span className="text-tertiary">({data.reviews})</span>
                    </div>

                    {getPrice() && (
                        <div className="cube-card-price">
                            {getPrice()}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export function StatCard({ label, value, change, changeType = 'neutral', icon: Icon }) {
    return (
        <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
                <span className="stat-label">{label}</span>
                {Icon && <Icon size={20} className="text-tertiary" />}
            </div>
            <div className="stat-value">{value}</div>
            {change !== undefined && (
                <div className={`stat-change ${changeType === 'positive' ? 'positive' : changeType === 'negative' ? 'negative' : ''}`}>
                    {changeType === 'positive' && '↑'}
                    {changeType === 'negative' && '↓'}
                    {change}
                </div>
            )}
        </div>
    );
}

export function Card({ children, className = '', interactive = false, ...props }) {
    return (
        <div
            className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

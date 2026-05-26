import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { CubeCard } from '../../components/ui/Card';
import { BottomNav, TopHeader } from '../../components/layout/Navigation';
import {
    Search,
    MapPin,
    Filter,
    Users,
    Building2,
    Briefcase,
    Sun,
    Moon,
    SlidersHorizontal,
    X
} from 'lucide-react';

function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { agents, spaces, employers, toggleFavorite, isFavorite } = useData();
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    // Initialize from URL param if available
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'agents');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        priceRange: '',
    });

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && (tab === 'agents' || tab === 'spaces' || tab === 'companies')) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (id) => {
        setActiveTab(id);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', id);
        setSearchParams(newParams);
    };

    const tabs = [
        { id: 'agents', label: 'Agents', icon: Users },
        { id: 'spaces', label: 'Spaces', icon: Building2 },
        { id: 'companies', label: 'Companies', icon: Briefcase },
    ];

    const getFilteredData = () => {
        const query = searchQuery.toLowerCase();

        switch (activeTab) {
            case 'agents':
                return agents.filter(a =>
                    !query ||
                    a.name.toLowerCase().includes(query) ||
                    a.title.toLowerCase().includes(query) ||
                    a.skills.some(s => s.toLowerCase().includes(query))
                );
            case 'spaces':
                return spaces.filter(s =>
                    !query ||
                    s.name.toLowerCase().includes(query) ||
                    s.type.toLowerCase().includes(query) ||
                    s.location.toLowerCase().includes(query)
                );
            case 'companies':
                return employers.filter(e =>
                    !query ||
                    e.name.toLowerCase().includes(query) ||
                    e.industry.toLowerCase().includes(query)
                );
            default:
                return [];
        }
    };

    const filteredData = getFilteredData();

    return (
        <div className="min-h-screen bg-primary pb-20 md:pb-0">
            <TopHeader title="Discover" />

            {/* Results */}
            <main className="container py-6">
                {/* Search & Tabs Controls moved from Header */}
                <div className="mb-6 card p-6">
                    {/* Search */}
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                            <input
                                type="text"
                                className="input pl-9"
                                style={{ borderRadius: 'var(--radius-full)' }}
                                placeholder={`Search ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                            style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-2.5)', minWidth: '42px', height: '42px' }}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mb-4 p-4 rounded-xl bg-secondary border border-light animate-fade-in text-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Quick Filters</h3>
                                <button
                                    className="text-xs text-primary-500 font-medium hover:text-primary-600"
                                    onClick={() => setFilters({ location: '', category: '', priceRange: '' })}
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                                    <input
                                        type="text"
                                        className="input pl-8 pr-3 py-2 text-xs"
                                        placeholder="Any location"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="select text-xs"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="developer">Developers</option>
                                        <option value="designer">Designers</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="accountant">Accountants</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        className="select text-xs"
                                        value={filters.priceRange}
                                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                                    >
                                        <option value="">Any Price</option>
                                        <option value="0-50">$0 - $50/hr</option>
                                        <option value="50-100">$50 - $100/hr</option>
                                        <option value="100+">$100+/hr</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex w-full border-t border-light pt-4 mt-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 py-3 text-center text-xs md:text-sm font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
                                    activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-secondary hover:text-primary'
                                }`}
                            >
                                <tab.icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <p className="text-secondary">
                        <span className="font-semibold text-primary">{filteredData.length}</span> {activeTab} found
                    </p>
                    <select className="select" style={{ width: 'auto' }}>
                        <option>Most Relevant</option>
                        <option>Highest Rated</option>
                        <option>Lowest Price</option>
                        <option>Highest Price</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((item) => (
                        <CubeCard
                            key={item.id}
                            type={activeTab === 'companies' ? 'employer' : activeTab.slice(0, -1)}
                            data={item}
                            onFavorite={toggleFavorite}
                            isFavorite={isFavorite(activeTab.slice(0, -1), item.id)}
                        />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="empty-state py-16">
                        <Search className="empty-state-icon" />
                        <h3 className="empty-state-title">No results found</h3>
                        <p className="empty-state-description">
                            Try adjusting your search or filters to find what you're looking for
                        </p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}

export default Discover;

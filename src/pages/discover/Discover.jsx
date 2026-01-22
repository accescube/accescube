import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CubeCard } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Modal';
import { BottomNav } from '../../components/layout/Navigation';
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
    const { agents, spaces, employers, toggleFavorite, isFavorite } = useData();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('agents');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        priceRange: '',
    });

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
            {/* Header */}
            <header className="sticky top-0 glass z-40">
                <div className="container py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/cube.svg" alt="Accescube" style={{ width: 32, height: 32 }} />
                            <span className="text-lg font-bold gradient-text">Accescube</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={toggleTheme}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                            <input
                                type="text"
                                className="input w-full pl-10"
                                placeholder={`Search ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} btn-icon`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 rounded-xl bg-elevated border border-light animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                <button
                                    className="text-sm text-primary-500"
                                    onClick={() => setFilters({ location: '', category: '', priceRange: '' })}
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="input-group">
                                    <label className="input-label">Location</label>
                                    <div className="input-icon">
                                        <MapPin className="icon" size={18} />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Any location"
                                            value={filters.location}
                                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Category</label>
                                    <select
                                        className="input"
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
                                <div className="input-group">
                                    <label className="input-label">Price Range</label>
                                    <select
                                        className="input"
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
                    <div className="mt-4">
                        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    </div>
                </div>
            </header>

            {/* Results */}
            <main className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-secondary">
                        <span className="font-semibold text-primary">{filteredData.length}</span> {activeTab} found
                    </p>
                    <select className="input" style={{ width: 'auto' }}>
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

import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge, SkillBadge, VerifiedBadge, Avatar } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Modal, Tabs } from '../../components/ui/Modal';
import {
    Edit,
    Plus,
    Trash2,
    MapPin,
    Star,
    DollarSign,
    Save,
    X
} from 'lucide-react';

function AgentMyCube() {
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddService, setShowAddService] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        title: user?.title || 'Full Stack Developer',
        bio: user?.bio || 'Experienced developer with expertise in React, Node.js, and cloud services.',
        location: user?.location || 'San Francisco, CA',
        hourlyRate: user?.hourlyRate || 85,
        skills: user?.skills || ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    });

    const [services, setServices] = useState([
        { id: 1, name: 'Web Development', description: 'Full-stack web application development', price: 85, unit: 'hour' },
        { id: 2, name: 'API Development', description: 'RESTful API design and implementation', price: 95, unit: 'hour' },
        { id: 3, name: 'Consulting', description: 'Technical consulting and architecture review', price: 150, unit: 'hour' },
    ]);

    const [newService, setNewService] = useState({ name: '', description: '', price: '', unit: 'hour' });

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'services', label: 'Services' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'settings', label: 'Settings' },
    ];

    const handleAddService = () => {
        if (newService.name && newService.price) {
            setServices([...services, { ...newService, id: Date.now(), price: parseFloat(newService.price) }]);
            setNewService({ name: '', description: '', price: '', unit: 'hour' });
            setShowAddService(false);
        }
    };

    const handleDeleteService = (id) => {
        setServices(services.filter(s => s.id !== id));
    };

    return (
        <AppLayout title="My Cube">
            {/* Cube Header */}
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative">
                        <Avatar name={user?.name} size="2xl" />
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                            <Edit size={14} />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold">{formData.name}</h1>
                            {user?.verified && <VerifiedBadge size={20} />}
                        </div>
                        <p className="text-lg text-secondary mb-3">{formData.title}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-4">
                            <span className="flex items-center gap-1">
                                <MapPin size={16} />
                                {formData.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign size={16} />
                                ${formData.hourlyRate}/hour
                            </span>
                            <span className="flex items-center gap-1">
                                <Star size={16} fill="var(--warning-400)" color="var(--warning-400)" />
                                4.9 (127 reviews)
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, i) => (
                                <SkillBadge key={i}>{skill}</SkillBadge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Badge variant="success">Published</Badge>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Profile Information</h2>
                        <Button
                            variant={isEditing ? 'primary' : 'secondary'}
                            size="sm"
                            icon={isEditing ? Save : Edit}
                            onClick={() => {
                                if (isEditing) {
                                    updateProfile(formData);
                                    toast.success('Profile updated successfully!');
                                    setIsEditing(false);
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                        >
                            {isEditing ? 'Save Changes' : 'Edit'}
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Professional Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Hourly Rate ($)"
                            type="number"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                            disabled={!isEditing}
                        />
                        <div className="input-group">
                            <label className="input-label">Skills (comma separated)</label>
                            <input
                                className="input"
                                value={formData.skills.join(', ')}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="md:col-span-2 input-group">
                            <label className="input-label">Bio</label>
                            <textarea
                                className="input"
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'services' && (
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Services</h2>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Plus}
                            onClick={() => setShowAddService(true)}
                        >
                            Add Service
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {services.map((service) => (
                            <div key={service.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                                <div className="flex-1">
                                    <h3 className="font-medium">{service.name}</h3>
                                    <p className="text-sm text-secondary">{service.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-primary-500">
                                        ${service.price}/{service.unit}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-ghost btn-icon">
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon text-error-500"
                                        onClick={() => handleDeleteService(service.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'portfolio' && (
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Portfolio</h2>
                        <Button variant="primary" size="sm" icon={Plus}>
                            Add Project
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="rounded-xl border border-light overflow-hidden">
                                <div className="h-40 bg-gradient-card flex items-center justify-center text-4xl">
                                    📁
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium mb-1">Project {item}</h3>
                                    <p className="text-sm text-secondary">A brief description of the project</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'settings' && (
                <Card>
                    <h2 className="text-lg font-semibold mb-6">Cube Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                            <div>
                                <h3 className="font-medium">Cube Visibility</h3>
                                <p className="text-sm text-secondary">Control who can see your cube</p>
                            </div>
                            <select className="input" style={{ width: 'auto' }}>
                                <option>Public</option>
                                <option>Members Only</option>
                                <option>Hidden</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                            <div>
                                <h3 className="font-medium">Accepting New Projects</h3>
                                <p className="text-sm text-secondary">Toggle availability for new leads</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                        </div>
                    </div>
                </Card>
            )}

            {/* Add Service Modal */}
            <Modal
                isOpen={showAddService}
                onClose={() => setShowAddService(false)}
                title="Add New Service"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowAddService(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddService}>Add Service</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Service Name"
                        placeholder="e.g. Web Development"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                    <Input
                        label="Description"
                        placeholder="Brief description of the service"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price ($)"
                            type="number"
                            placeholder="85"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        />
                        <div className="input-group">
                            <label className="input-label">Per</label>
                            <select
                                className="input"
                                value={newService.unit}
                                onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
                            >
                                <option value="hour">Hour</option>
                                <option value="project">Project</option>
                                <option value="day">Day</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

export default AgentMyCube;

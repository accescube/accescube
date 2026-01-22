import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
    Plus,
    Edit,
    Trash2,
    MapPin,
    DollarSign,
    Users,
    Star,
    Image as ImageIcon
} from 'lucide-react';

function MyCubes() {
    const { user } = useAuth();
    const { spaces, addSpace, updateSpace, deleteSpace } = useData();
    const { toast } = useToast();

    // In a real app we'd filter by ownerId, but for now we'll just show all or slice
    // Since we don't have ownerId on spaces in the mock data, let's assume all spaces are editable for the 'space' user
    const mySpaces = spaces;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSpace, setCurrentSpace] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'desk',
        description: '',
        location: '',
        address: '',
        capacity: 1,
        priceHourly: '',
        priceDaily: '',
        priceMonthly: '',
    });

    const openAddModal = () => {
        setFormData({
            name: '',
            type: 'desk',
            description: '',
            location: '',
            address: '',
            capacity: 1,
            priceHourly: '',
            priceDaily: '',
            priceMonthly: '',
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (space) => {
        setFormData({
            name: space.name,
            type: space.type,
            description: space.description,
            location: space.location,
            address: space.address,
            capacity: space.capacity,
            priceHourly: space.pricing.hourly || '',
            priceDaily: space.pricing.daily || '',
            priceMonthly: space.pricing.monthly || '',
        });
        setCurrentSpace(space);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            deleteSpace(id);
            toast.success('Space deleted successfully');
        }
    };

    const handleSubmit = () => {
        const spaceData = {
            name: formData.name,
            type: formData.type,
            description: formData.description,
            location: formData.location,
            address: formData.address,
            capacity: parseInt(formData.capacity),
            pricing: {
                ...(formData.priceHourly && { hourly: parseInt(formData.priceHourly) }),
                ...(formData.priceDaily && { daily: parseInt(formData.priceDaily) }),
                ...(formData.priceMonthly && { monthly: parseInt(formData.priceMonthly) }),
            },
            // Default values for new spaces
            rating: isEditing ? currentSpace.rating : 0,
            reviews: isEditing ? currentSpace.reviews : 0,
            images: [],
            amenities: ['WiFi', 'Coffee'], // Default amenities
            available: true,
            featured: false,
        };

        if (isEditing) {
            updateSpace(currentSpace.id, spaceData);
            toast.success('Space updated successfully');
        } else {
            addSpace(spaceData);
            toast.success('New space created successfully');
        }
        setIsModalOpen(false);
    };

    return (
        <AppLayout title="My Spaces">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Manage Listings</h1>
                    <p className="text-secondary">Add and edit your cubes for rent.</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={openAddModal}>
                    Add New Space
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySpaces.map((space) => (
                    <Card key={space.id} className="flex flex-col h-full group">
                        <div className="relative h-40 bg-gradient-card rounded-xl mb-4 flex items-center justify-center -mx-2 -mt-2">
                            <div className="text-6xl">🏢</div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="btn-icon bg-white/90 hover:bg-white"
                                    onClick={() => openEditModal(space)}
                                >
                                    <Edit size={16} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="btn-icon bg-white/90 hover:bg-white text-error-500"
                                    onClick={() => handleDelete(space.id, space.name)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                            <Badge className="absolute bottom-2 left-2 capitalize" variant="secondary">
                                {space.type}
                            </Badge>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg leading-tight">{space.name}</h3>
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <Star size={14} className="text-warning-500 fill-warning-500" />
                                    {space.rating} <span className="text-secondary font-normal">({space.reviews})</span>
                                </div>
                            </div>

                            <p className="text-sm text-secondary flex items-start gap-1 mb-3">
                                <MapPin size={14} className="mt-0.5 shrink-0" />
                                {space.address}, {space.location}
                            </p>

                            <p className="text-sm text-secondary line-clamp-2 mb-4">
                                {space.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {space.pricing.hourly && (
                                    <Badge variant="outline" className="text-xs">
                                        ${space.pricing.hourly}/hr
                                    </Badge>
                                )}
                                {space.pricing.daily && (
                                    <Badge variant="outline" className="text-xs">
                                        ${space.pricing.daily}/day
                                    </Badge>
                                )}
                                {space.pricing.monthly && (
                                    <Badge variant="outline" className="text-xs">
                                        ${space.pricing.monthly}/mo
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-light pt-4 flex items-center justify-between text-sm text-secondary">
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                Capacity: {space.capacity}
                            </div>
                            <div className={`flex items-center gap-1 ${space.available ? 'text-success-600' : 'text-error-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${space.available ? 'bg-success-500' : 'bg-error-500'}`} />
                                {space.available ? 'Available' : 'Booked'}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Space' : 'Add New Space'}
                className="max-w-2xl"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {isEditing ? 'Save Changes' : 'Create Space'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Space Name"
                        placeholder="e.g. Downtown Hot Desk"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <label className="input-label">Space Type</label>
                            <select
                                className="input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="desk">Hot Desk</option>
                                <option value="cabin">Private Cabin</option>
                                <option value="office">Office Suite</option>
                                <option value="meeting">Meeting Room</option>
                            </select>
                        </div>
                        <Input
                            label="Capacity (People)"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Input
                            label="Price / Hour ($)"
                            type="number"
                            placeholder="Optional"
                            value={formData.priceHourly}
                            onChange={(e) => setFormData({ ...formData, priceHourly: e.target.value })}
                        />
                        <Input
                            label="Price / Day ($)"
                            type="number"
                            placeholder="Optional"
                            value={formData.priceDaily}
                            onChange={(e) => setFormData({ ...formData, priceDaily: e.target.value })}
                        />
                        <Input
                            label="Price / Month ($)"
                            type="number"
                            placeholder="Optional"
                            value={formData.priceMonthly}
                            onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Location (City)"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <Input
                        label="Full Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            className="input"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

export default MyCubes;

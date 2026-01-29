import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
    Plus,
    Trash2,
    Building2,
    Search,
    MapPin,
    DollarSign,
    Calendar
} from 'lucide-react';

function MySpaces() {
    const { user } = useAuth();
    const {
        employerSpaces,
        spaces,
        getEmployerSpaces,
        rentSpace,
        updateEmployerSpace,
        cancelSpaceRental
    } = useData();
    const { toast } = useToast();

    const [showRentModal, setShowRentModal] = useState(false);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [newAccessName, setNewAccessName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Get spaces rented by current employer
    const mySpaces = getEmployerSpaces(user?.id || '3');

    // Available spaces (not already rented by this user)
    const availableSpaces = spaces.filter(s =>
        !mySpaces.some(ms => ms.spaceId === s.id) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleRent = (space) => {
        const cost = space.pricing.monthly || space.pricing.daily * 30 || space.pricing.hourly * 160;

        rentSpace(user?.id || '3', {
            spaceId: space.id,
            name: space.name,
            location: space.location,
            type: space.type,
            cost: cost,
            term: 'monthly'
        });
        toast.success(`Rented ${space.name} successfully!`);
        setShowRentModal(false);
    };

    const handleCancel = (id, name) => {
        if (window.confirm(`Are you sure you want to cancel your rental for ${name}?`)) {
            cancelSpaceRental(id);
            toast.info(`Rental for ${name} cancelled.`);
        }
    };

    const handleOpenAccess = (rental) => {
        setSelectedRental(rental);
        setShowAccessModal(true);
    };

    const handleAddAccess = async () => {
        if (!newAccessName.trim()) return;

        const currentAccess = selectedRental.access || [];
        const updatedAccess = [...currentAccess, {
            id: Date.now().toString(),
            name: newAccessName,
            joinedAt: new Date().toISOString()
        }];

        try {
            await updateEmployerSpace(selectedRental.id, { access: updatedAccess });
            // Update the local state of selected rental to reflect changes immediately
            setSelectedRental({ ...selectedRental, access: updatedAccess });
            setNewAccessName('');
            toast.success(`Access granted to ${newAccessName}`);
        } catch (error) {
            toast.error('Failed to update access');
        }
    };

    const handleRemoveAccess = async (accessId, name) => {
        const updatedAccess = selectedRental.access.filter(a => a.id !== accessId);

        try {
            await updateEmployerSpace(selectedRental.id, { access: updatedAccess });
            setSelectedRental({ ...selectedRental, access: updatedAccess });
            toast.info(`Access removed for ${name}`);
        } catch (error) {
            toast.error('Failed to update access');
        }
    };

    return (
        <AppLayout title="My Spaces">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Office Spaces</h1>
                    <p className="text-secondary">Manage your rented offices and desks.</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowRentModal(true)}>
                    Rent Space
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySpaces.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-secondary">
                        <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No spaces rented yet.</p>
                        <Button variant="ghost" className="mt-2 text-primary-600" onClick={() => setShowRentModal(true)}>
                            Browse Available Spaces
                        </Button>
                    </div>
                ) : (
                    mySpaces.map((rental) => (
                        <Card key={rental.id} className="relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-error-500 hover:text-error-600 btn-icon"
                                    onClick={() => handleCancel(rental.id, rental.name)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-card flex items-center justify-center text-2xl shrink-0">
                                    🏢
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{rental.name}</h3>
                                    <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                                        <MapPin size={12} />
                                        {rental.location}
                                    </p>
                                    <Badge variant="primary" className="mt-2 capitalize">{rental.type}</Badge>
                                </div>
                            </div>

                            <div className="border-t border-light pt-4 mt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Cost</span>
                                    <span className="font-semibold">${rental.cost}/{rental.term}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-secondary">Rented Since</span>
                                    <span className="font-medium">{new Date(rental.rentedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-secondary">Active Access</span>
                                    <span className="font-medium">{(rental.access || []).length} persons</span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => handleOpenAccess(rental)}
                                >
                                    Manage Access
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Rent Space Modal */}
            <Modal
                isOpen={showRentModal}
                onClose={() => setShowRentModal(false)}
                title="Rent New Space"
                className="max-w-2xl"
                footer={
                    <Button variant="secondary" onClick={() => setShowRentModal(false)}>Cancel</Button>
                }
            >
                <div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <Input
                            className="pl-10"
                            placeholder="Search spaces by name, type, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                        {availableSpaces.map((space) => (
                            <div key={space.id} className="flex items-start gap-4 p-4 rounded-xl border border-light hover:border-primary-200 transition-colors">
                                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-3xl shrink-0">
                                    🏢
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold">{space.name}</h4>
                                    <p className="text-sm text-secondary truncate">{space.description}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <Badge variant="secondary" size="sm" className="capitalize">
                                            {space.type}
                                        </Badge>
                                        <span className="text-xs text-secondary flex items-center gap-1">
                                            <MapPin size={10} /> {space.location}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-bold text-primary-600">
                                        ${space.pricing.monthly || space.pricing.daily * 30}/mo
                                    </div>
                                    <Button size="sm" variant="primary" className="mt-2" onClick={() => handleRent(space)}>
                                        Rent Now
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {availableSpaces.length === 0 && (
                            <p className="text-center text-secondary py-4">No spaces found matching your search.</p>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Manage Access Modal */}
            <Modal
                isOpen={showAccessModal}
                onClose={() => setShowAccessModal(false)}
                title={`Manage Access: ${selectedRental?.name}`}
                className="max-w-md"
            >
                <div>
                    <div className="mb-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-600">
                            <Plus size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold">Grant New Access</h4>
                            <div className="mt-2 flex gap-2">
                                <Input
                                    className="flex-1"
                                    placeholder="Employee name..."
                                    value={newAccessName}
                                    onChange={(e) => setNewAccessName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddAccess()}
                                />
                                <Button variant="primary" size="sm" onClick={handleAddAccess}>Add</Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-tertiary uppercase tracking-wider">People with Access</h4>
                        {(!selectedRental?.access || selectedRental.access.length === 0) ? (
                            <div className="text-center py-6 text-secondary bg-secondary/50 rounded-xl border border-dashed border-light">
                                <p className="text-sm">No specific access granted yet.</p>
                                <p className="text-[10px] mt-1">Add employees to allow them to use this space.</p>
                            </div>
                        ) : (
                            selectedRental.access.map((person) => (
                                <div key={person.id} className="flex items-center justify-between p-3 rounded-xl border border-light hover:bg-secondary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={person.name} size="sm" />
                                        <div>
                                            <p className="text-sm font-medium">{person.name}</p>
                                            <p className="text-[10px] text-tertiary">Access since {new Date(person.joinedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-tertiary hover:text-error-500 p-1 h-auto"
                                        onClick={() => handleRemoveAccess(person.id, person.name)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

export default MySpaces;

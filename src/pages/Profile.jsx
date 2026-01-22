import { useState } from 'react';
import { AppLayout } from '../components/layout/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/ui/Card';
import { Avatar, Badge, VerifiedBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, Save, Shield } from 'lucide-react';

function Profile() {
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company: user?.company || '', // For employers
        website: user?.website || '', // For employers
    });

    const handleSave = () => {
        updateProfile(formData);
        toast.success('Profile settings updated successfully!');
        setIsEditing(false);
    };

    return (
        <AppLayout title="Profile & Settings">
            <div className="max-w-2xl mx-auto">
                <Card className="mb-6">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="relative mb-4">
                            <Avatar name={user?.name} size="2xl" />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 transition-colors">
                                    <User size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold">{formData.name}</h2>
                            {user?.verified && <VerifiedBadge size={24} />}
                        </div>
                        <Badge variant="secondary" className="mb-4 capitalize">{user?.role}</Badge>
                    </div>

                    <div className="border-t border-light p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield size={20} className="text-primary-500" />
                                Account Information
                            </h3>
                            <Button
                                variant={isEditing ? 'primary' : 'secondary'}
                                icon={isEditing ? Save : User}
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name / Company Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                icon={User}
                            />

                            <Input
                                label="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled
                                icon={Mail}
                                helperText="Contact support to change email"
                            />

                            {user?.role === 'employer' && (
                                <>
                                    <Input
                                        label="Website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="https://example.com"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </Card>

                {user?.role === 'agent' && (
                    <Card className="mb-6 p-6">
                        <h3 className="text-lg font-semibold mb-2">Professional Profile</h3>
                        <p className="text-secondary mb-4">Manage your public profile, skills, and portfolio on your Cube.</p>
                        <Button variant="secondary" onClick={() => window.location.href = '/agent/cube'}>
                            Go to My Cube
                        </Button>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

export default Profile;

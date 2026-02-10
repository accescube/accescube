import { useState } from 'react';
import { AppLayout } from '../components/layout/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/ui/Card';
import { Avatar, Badge, VerifiedBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, Save, Shield } from 'lucide-react';

import { useData } from '../contexts/DataContext';

function Profile() {
    const { user, updateProfile } = useAuth();
    const { agents, updateAgent, employers, updateEmployer } = useData();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company: user?.company || '', // For employers
        website: user?.website || '', // For employers
        role: user?.role || '', // For users without roles
    });

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('Name is required');
            return;
        }

        if (!user?.role && !formData.role) {
            toast.error('Please select your account type');
            return;
        }

        try {
            // 1. Update Auth/User Profile
            await updateProfile(formData);

            // 2. Sync with Marketplace
            if (formData.role === 'agent') {
                const agentListing = agents.find(a => a.userId === user.id);
                if (agentListing) {
                    await updateAgent(agentListing.id, {
                        name: formData.name,
                        updatedAt: new Date().toISOString()
                    });
                }
            } else if (formData.role === 'employer') {
                const employerListing = employers.find(e => e.userId === user.id);
                if (employerListing) {
                    await updateEmployer(employerListing.id, {
                        name: formData.name,
                        website: formData.website,
                        updatedAt: new Date().toISOString()
                    });
                }
            }

            toast.success('Profile settings updated successfully!');
            setIsEditing(false);

            // If they just set their role, they might need a refresh to update the dashboard
            if (!user?.role && formData.role) {
                setTimeout(() => window.location.href = '/dashboard', 1500);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <AppLayout title="Profile & Settings">
            <div className="max-w-2xl mx-auto">
                {!user?.role && (
                    <div className="mb-6 p-4 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-600 animate-fade-in text-sm text-center">
                        <p className="font-bold mb-1">Account Setup Incomplete</p>
                        <p>Please select your account type and update your name to proceed.</p>
                    </div>
                )}

                <Card className="mb-6">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="relative mb-4">
                            <Avatar name={user?.name || formData.name} size="2xl" />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 transition-colors">
                                    <User size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold">{formData.name || 'New Member'}</h2>
                            {user?.verified && <VerifiedBadge size={24} />}
                        </div>
                        {user?.role ? (
                            <Badge variant="secondary" className="mb-4 capitalize">{user.role}</Badge>
                        ) : (
                            <Badge variant="warning" className="mb-4">Role Not Set</Badge>
                        )}
                    </div>

                    <div className="border-t border-light p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield size={20} className="text-primary-500" />
                                Account Information
                            </h3>
                            <Button
                                variant={isEditing || !user?.role ? 'primary' : 'secondary'}
                                icon={(isEditing || !user?.role) ? Save : User}
                                onClick={() => (isEditing || !user?.role) ? handleSave() : setIsEditing(true)}
                            >
                                {(isEditing || !user?.role) ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name / Company Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing && user?.role}
                                icon={User}
                                placeholder="Enter your name"
                                required
                            />

                            <Input
                                label="Email Address"
                                value={formData.email}
                                disabled
                                icon={Mail}
                                helperText="Contact support to change email"
                            />

                            {!user?.role && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-tertiary uppercase tracking-wider">Account Type *</label>
                                    <select
                                        className="input w-full"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Role...</option>
                                        <option value="agent">Agent (I want to work)</option>
                                        <option value="employer">Employer (I want to hire)</option>
                                        <option value="space">Space Provider (I have space)</option>
                                    </select>
                                </div>
                            )}

                            {formData.role === 'employer' && (
                                <>
                                    <Input
                                        label="Website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        disabled={!isEditing && user?.role}
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
        </AppLayout >
    );
}

export default Profile;

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
    Search,
    Filter,
    Check,
    X,
    Trash2,
    Eye,
    MessageSquare,
    DollarSign,
    Calendar,
    Briefcase
} from 'lucide-react';

function AgentLeads() {
    const { user } = useAuth();
    const { leads, acceptLead, rejectLead, deleteLead } = useData();
    const { toast } = useToast();

    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filter leads
    const filteredLeads = leads.filter(lead => {
        const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
        const matchesSearch = lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.project.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleAccept = (e, id) => {
        e.stopPropagation();
        acceptLead(id);
        toast.success('Lead accepted successfully!');
        if (selectedLead?.id === id) setShowModal(false);
    };

    const handleReject = (e, id) => {
        e.stopPropagation();
        rejectLead(id);
        toast.info('Lead declined.');
        if (selectedLead?.id === id) setShowModal(false);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this lead?')) {
            deleteLead(id);
            toast.success('Lead deleted.');
            if (selectedLead?.id === id) setShowModal(false);
        }
    };

    const openDetails = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AppLayout title="My Leads">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Project Leads</h1>
                    <p className="text-secondary">Manage your incoming project requests and opportunities.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <input
                            type="text"
                            className="input pl-10 w-full md:w-64"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="input w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredLeads.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase size={32} className="text-tertiary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                        <p className="text-secondary max-w-md mx-auto">
                            {searchQuery || filterStatus !== 'all'
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "You don't have any leads yet. Optimize your profile to attract more clients!"}
                        </p>
                    </Card>
                ) : (
                    filteredLeads.map((lead) => (
                        <Card key={lead.id} className="hover:border-primary-200 transition-colors cursor-pointer" onClick={() => openDetails(lead)}>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <Avatar name={lead.company} size="md" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold truncate">{lead.company}</h3>
                                        <Badge
                                            variant={
                                                lead.status === 'new' ? 'primary' :
                                                    lead.status === 'accepted' ? 'success' :
                                                        lead.status === 'rejected' ? 'error' : 'warning'
                                            }
                                        >
                                            {lead.status}
                                        </Badge>
                                        <span className="text-xs text-tertiary ml-auto md:ml-2">
                                            {formatTime(lead.createdAt)}
                                        </span>
                                    </div>
                                    <p className="font-medium text-sm mb-1">{lead.project}</p>
                                    <p className="text-xm text-secondary truncate">{lead.message}</p>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:pl-4 md:border-l border-light">
                                    <div className="font-bold text-lg text-primary-600">
                                        ${lead.budget.toLocaleString()}
                                    </div>

                                    <div className="flex gap-2 ml-auto md:ml-0">
                                        {lead.status === 'new' ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-error-600 hover:text-error-700 hover:bg-error-50"
                                                    onClick={(e) => handleReject(e, lead.id)}
                                                    title="Decline"
                                                >
                                                    <X size={18} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-success-600 hover:text-success-700 hover:bg-success-50"
                                                    onClick={(e) => handleAccept(e, lead.id)}
                                                    title="Accept"
                                                >
                                                    <Check size={18} />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-neutral-400 hover:text-error-600"
                                                onClick={(e) => handleDelete(e, lead.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Lead Details Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Lead Details"
                footer={
                    selectedLead?.status === 'new' ? (
                        <>
                            <Button variant="ghost" className="text-error-600" onClick={(e) => handleReject(e, selectedLead.id)}>
                                Decline
                            </Button>
                            <Button variant="primary" onClick={(e) => handleAccept(e, selectedLead.id)}>
                                Accept Project
                            </Button>
                        </>
                    ) : (
                        <div className="flex justify-between w-full">
                            <Button variant="ghost" className="text-error-600" onClick={(e) => handleDelete(e, selectedLead.id)}>
                                Delete
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </div>
                    )
                }
            >
                {selectedLead && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                            <Avatar name={selectedLead.company} size="lg" />
                            <div>
                                <h3 className="font-bold text-lg">{selectedLead.company}</h3>
                                <div className="flex items-center gap-2 text-sm text-secondary">
                                    <Calendar size={14} />
                                    Received {formatTime(selectedLead.createdAt)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1 block">Project</label>
                            <h4 className="text-xl font-semibold mb-2">{selectedLead.project}</h4>
                            <div className="flex items-center gap-2 text-primary-600 font-bold text-xl mb-4">
                                <DollarSign size={20} />
                                {selectedLead.budget.toLocaleString()}
                            </div>

                            <label className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2 block">Message</label>
                            <div className="p-4 bg-secondary rounded-lg text-sm leading-relaxed">
                                {selectedLead.message}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    selectedLead.status === 'new' ? 'primary' :
                                        selectedLead.status === 'accepted' ? 'success' :
                                            selectedLead.status === 'rejected' ? 'error' : 'warning'
                                }
                            >
                                Status: {selectedLead.status.toUpperCase()}
                            </Badge>
                        </div>

                        {selectedLead.status === 'accepted' && (
                            <div className="p-4 border border-success-200 bg-success-50 rounded-lg flex items-start gap-3">
                                <div className="mt-1 text-success-600"><Check size={20} /></div>
                                <div>
                                    <h4 className="font-semibold text-success-800">Project Active</h4>
                                    <p className="text-sm text-success-700">You have accepted this project. You can now communicate with the client.</p>
                                    <Button size="sm" variant="primary" className="mt-2 bg-success-600 hover:bg-success-700 border-none">
                                        <MessageSquare size={16} className="mr-2" />
                                        Message Client
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}

export default AgentLeads;

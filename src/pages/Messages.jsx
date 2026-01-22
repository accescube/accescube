import { useState } from 'react';
import { AppLayout } from '../components/layout/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Avatar, Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
    Send,
    Search,
    MoreVertical,
    Check,
    CheckCheck,
    Trash2,
    Star
} from 'lucide-react';

function Messages() {
    const { user } = useAuth();
    const { messages, sendMessage, markMessageRead, markAllMessagesRead, getUnreadCount } = useData();
    const { toast } = useToast();
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Group messages by sender/recipient
    const conversations = messages.reduce((acc, msg) => {
        const key = msg.from === 'You' ? msg.to : msg.from;
        if (!acc[key]) {
            acc[key] = { contact: key, messages: [], unread: 0 };
        }
        acc[key].messages.push(msg);
        if (!msg.read && msg.from !== 'You') {
            acc[key].unread++;
        }
        return acc;
    }, {});

    const conversationList = Object.values(conversations).sort((a, b) => {
        const aLatest = new Date(a.messages[a.messages.length - 1]?.createdAt || 0);
        const bLatest = new Date(b.messages[b.messages.length - 1]?.createdAt || 0);
        return bLatest - aLatest;
    });

    const filteredConversations = conversationList.filter(c =>
        c.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        sendMessage(selectedContact, newMessage.trim());
        setNewMessage('');
        toast.success('Message sent!');
    };

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
        // Mark messages as read
        const conversation = conversations[contact];
        if (conversation) {
            conversation.messages.forEach(msg => {
                if (!msg.read && msg.from !== 'You') {
                    markMessageRead(msg.id);
                }
            });
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString();
    };

    return (
        <AppLayout title="Messages">
            <div className="card h-[calc(100vh-12rem)] flex overflow-hidden">
                {/* Conversation List */}
                <div className={`w-full md:w-80 border-r border-light flex flex-col ${selectedContact ? 'hidden md:flex' : ''}`}>
                    <div className="p-4 border-b border-light">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Messages</h2>
                            <Badge variant={getUnreadCount() > 0 ? 'primary' : 'neutral'}>
                                {getUnreadCount()} unread
                            </Badge>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                            <input
                                type="text"
                                className="input w-full pl-10"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((conv) => (
                            <button
                                key={conv.contact}
                                className={`w-full p-4 flex items-center gap-3 hover:bg-secondary transition text-left ${selectedContact === conv.contact ? 'bg-secondary' : ''
                                    }`}
                                onClick={() => handleSelectContact(conv.contact)}
                            >
                                <Avatar name={conv.contact} size="md" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium truncate">{conv.contact}</span>
                                        <span className="text-xs text-tertiary">
                                            {formatTime(conv.messages[conv.messages.length - 1]?.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary truncate">
                                        {conv.messages[conv.messages.length - 1]?.content}
                                    </p>
                                </div>
                                {conv.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                                        {conv.unread}
                                    </span>
                                )}
                            </button>
                        ))}

                        {filteredConversations.length === 0 && (
                            <div className="p-8 text-center text-secondary">
                                <p>No conversations yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : ''}`}>
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-light flex items-center gap-3">
                                <button
                                    className="md:hidden btn btn-ghost btn-icon"
                                    onClick={() => setSelectedContact(null)}
                                >
                                    ←
                                </button>
                                <Avatar name={selectedContact} size="md" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{selectedContact}</h3>
                                    <span className="text-sm text-success-500">Online</span>
                                </div>
                                <button className="btn btn-ghost btn-icon">
                                    <Star size={18} />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {conversations[selectedContact]?.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.from === 'You'
                                                    ? 'bg-primary-500 text-white rounded-br-none'
                                                    : 'bg-secondary rounded-bl-none'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <div className={`text-xs mt-1 flex items-center gap-1 ${msg.from === 'You' ? 'text-white/70 justify-end' : 'text-tertiary'
                                                }`}>
                                                <span>{formatTime(msg.createdAt)}</span>
                                                {msg.from === 'You' && (
                                                    msg.read ? <CheckCheck size={14} /> : <Check size={14} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-light">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input flex-1"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button type="submit" variant="primary" icon={Send} disabled={!newMessage.trim()}>
                                        Send
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-secondary">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                                <p>Choose a contact to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default Messages;


import { db } from './src/lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const sampleAgents = [
    {
        name: 'Alex Rivera',
        title: 'Full Stack Developer',
        bio: 'Passionate developer with 5+ years of experience in React and Node.js.',
        location: 'New York, NY',
        hourlyRate: 85,
        rating: 4.9,
        reviews: 124,
        skills: ['React', 'Node.js', 'Firebase', 'TypeScript'],
        avatar: null,
        category: 'developer',
        verified: true
    },
    {
        name: 'Sarah Chen',
        title: 'UI/UX Designer',
        bio: 'Creating beautiful and functional user experiences for mobile and web.',
        location: 'San Francisco, CA',
        hourlyRate: 75,
        rating: 4.8,
        reviews: 89,
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        avatar: null,
        category: 'designer',
        verified: true
    },
    {
        name: 'Marcus Thorne',
        title: 'Digital Marketing Expert',
        bio: 'Helping brands grow through data-driven marketing strategies.',
        location: 'London, UK',
        hourlyRate: 65,
        rating: 4.7,
        reviews: 56,
        skills: ['SEO', 'SEM', 'Content Strategy', 'Analytics'],
        avatar: null,
        category: 'marketing',
        verified: false
    }
];

async function seed() {
    try {
        console.log('Seeding agents...');
        for (const agent of sampleAgents) {
            await addDoc(collection(db, 'agents'), {
                ...agent,
                createdAt: new Date().toISOString()
            });
            console.log(`Added ${agent.name}`);
        }
        console.log('Seeding complete!');
    } catch (e) {
        console.error('Error seeding:', e);
    }
}

seed();

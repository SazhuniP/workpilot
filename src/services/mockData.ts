import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function seedMockData(userId: string) {
  try {
    // 1. Create a few projects
    const p1 = await addDoc(collection(db, 'projects'), {
      name: 'WorkPilot UI',
      description: 'Designing and developing the premium UI/UX for the WorkPilot platform.',
      ownerId: userId,
      members: [userId],
      status: 'active',
      progress: 65,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const p2 = await addDoc(collection(db, 'projects'), {
      name: 'Core Backend',
      description: 'Building the fundamental REST APIs and database schema.',
      ownerId: userId,
      members: [userId],
      status: 'active',
      progress: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 2. Add tasks to p1
    const tasks = [
      { title: 'Redesign Sidebar', status: 'todo', priority: 'medium' },
      { title: 'Glassmorphism Effects', status: 'in-progress', priority: 'high' },
      { title: 'Setup Recharts', status: 'completed', priority: 'low' },
      { title: 'Project Grid Layout', status: 'todo', priority: 'medium' }
    ];

    for (const t of tasks) {
      await addDoc(collection(db, `projects/${p1.id}/tasks`), {
        projectId: p1.id,
        title: t.title,
        description: `This is a sample description for ${t.title}.`,
        status: t.status,
        priority: t.priority,
        creatorId: userId,
        assigneeId: userId,
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

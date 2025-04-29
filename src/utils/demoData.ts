import { v4 as uuidv4 } from 'uuid';
import { Group } from '../types/models';

export function createDemoGroup(): Group {
  // Create participant IDs
  const michaelId = uuidv4();
  const andrewId = uuidv4();
  const jamesId = uuidv4();

  // Create transaction IDs
  const lunchTransactionId = uuidv4();
  const activityTransactionId = uuidv4();

  // Get current date and time
  const now = new Date();
  const dateTimeString = `${now.toISOString().split('T')[0]}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Create an earlier time for the first transaction
  const earlier = new Date(now);
  earlier.setHours(earlier.getHours() - 3); // 3 hours earlier
  const earlierDateTimeString = `${earlier.toISOString().split('T')[0]}T${String(earlier.getHours()).padStart(2, '0')}:${String(earlier.getMinutes()).padStart(2, '0')}`;

  return {
    id: uuidv4(),
    name: 'Demo Trip',
    people: [
      { id: michaelId, name: 'Michael' },
      { id: andrewId, name: 'Andrew' },
      { id: jamesId, name: 'James' },
    ],
    transactions: [
      {
        id: lunchTransactionId,
        description: 'Lunch',
        amount: 120,
        date: earlierDateTimeString,
        paidById: michaelId,
        participants: [michaelId, andrewId],
        location: 'The Grounds of Alexandria, Sydney',
      },
      {
        id: activityTransactionId,
        description: 'Activity',
        amount: 180,
        date: dateTimeString,
        paidById: jamesId,
        participants: [michaelId, andrewId, jamesId],
        location: 'Sydney Opera House, Bennelong Point',
      },
    ],
  };
}

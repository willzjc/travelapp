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

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

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
        date: today,
        paidById: michaelId,
        participants: [michaelId, andrewId],
        location: 'The Grounds of Alexandria, Sydney',
      },
      {
        id: activityTransactionId,
        description: 'Activity',
        amount: 180,
        date: today,
        paidById: jamesId,
        participants: [michaelId, andrewId, jamesId],
        location: 'Sydney Opera House, Bennelong Point',
      },
    ],
  };
}

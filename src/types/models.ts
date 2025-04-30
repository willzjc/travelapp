/**
 * Represents an individual participant in the expense-splitting app.
 * Each person has a unique ID and name.
 */
export interface Person {
  id: string;
  name: string;
  // New field that can link to a Google user ID
  googleUserId?: string;
}

/**
 * Represents a financial transaction or expense within a group.
 * Tracks who paid, the amount, participants involved, and other details.
 */
export interface Transaction {
  id: string; // Unique identifier for the transaction
  description: string; // Description of what the expense was for
  amount: number; // Total amount of the expense
  date: string; // When the transaction occurred
  paidById: string; // ID of the person who paid
  participants: string[]; // IDs of all people who should share this expense
  location?: string; // Optional field for where the expense occurred
  createdBy?: string; // Google user ID of the person who created the transaction
  createdAt?: string; // When the transaction was created
}

/**
 * Represents a trip or group of people sharing expenses.
 * Contains the group members and all transactions within the group.
 */
export interface Group {
  id: string;
  name: string; // Name of the trip or group
  people: Person[]; // All members of this group
  transactions: Transaction[]; // All expenses recorded for this group
  createdBy?: string; // Google user ID of the person who created the group
  createdAt?: string; // When the group was created
}

/**
 * Represents a calculated debt between two people after reconciling expenses.
 * Shows who owes money to whom and how much.
 */
export interface Debt {
  fromPersonId: string; // Person who owes money
  toPersonId: string; // Person who is owed money
  amount: number; // Amount to be paid
}

/**
 * Represents user data from Google authentication
 */
export interface GoogleUser {
  id: string; // Google's user ID
  name: string;
  email: string;
  picture?: string; // URL to profile picture
}

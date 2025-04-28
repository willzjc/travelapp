export interface Person {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  paidById: string;
  participants: string[];
  location?: string; // Add optional location field
}

export interface Group {
  id: string;
  name: string;
  people: Person[];
  transactions: Transaction[];
}

export interface Debt {
  fromPersonId: string;
  toPersonId: string;
  amount: number;
}

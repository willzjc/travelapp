import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Group, Transaction, Debt } from '../types/models';
import { createDemoGroup } from '../utils/demoData';
import { useAuth } from './AuthContext';

interface AppContextType {
  groups: Group[];
  addGroup: (name: string) => string;
  addPerson: (groupId: string, name: string) => void;
  addTransaction: (groupId: string, transaction: Omit<Transaction, 'id'>) => void;
  getGroupById: (groupId: string) => Group | undefined;
  getTransactionById: (groupId: string, transactionId: string) => Transaction | undefined;
  editTransaction: (
    groupId: string,
    transactionId: string,
    transaction: Omit<Transaction, 'id'>
  ) => void;
  deleteTransaction: (groupId: string, transactionId: string) => void;
  deleteGroup: (groupId: string) => void;
  calculateDebts: (groupId: string) => Debt[];
  mapLocation: string;
  isMapOpen: boolean;
  openMap: (location: string) => void;
  closeMap: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>(() => {
    // Check if there are existing groups in localStorage
    const savedGroups = localStorage.getItem('groups');

    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);

        // Check if the first group has transactions with location data
        // If not, create fresh demo data instead
        const hasLocationData =
          parsedGroups.length > 0 &&
          parsedGroups[0].transactions?.some((t: Transaction) => t.location);

        if (hasLocationData) {
          return parsedGroups;
        }
      } catch (e) {
        console.error('Error parsing saved groups:', e);
      }
    }

    // If no valid groups exist or they don't have location data, create a fresh demo group
    return [createDemoGroup()];
  });

  // Map side pane state
  const [mapLocation, setMapLocation] = useState<string>('');
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const openMap = (location: string) => {
    setMapLocation(location);
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
  };

  // Save groups to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const addGroup = (name: string) => {
    const id = uuidv4();
    const now = new Date().toISOString();

    setGroups([
      ...groups,
      {
        id,
        name,
        people: [],
        transactions: [],
        createdBy: user?.uid,
        createdAt: now,
      },
    ]);

    return id;
  };

  const getGroupById = (groupId: string) => {
    return groups.find((group) => group.id === groupId);
  };

  const addPerson = (groupId: string, name: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            people: [...group.people, { id: uuidv4(), name }],
          };
        }
        return group;
      })
    );
  };

  const addTransaction = (groupId: string, transaction: Omit<Transaction, 'id'>) => {
    const now = new Date().toISOString();

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            transactions: [
              ...group.transactions,
              {
                id: uuidv4(),
                ...transaction,
                createdBy: user?.uid,
                createdAt: now,
              },
            ],
          };
        }
        return group;
      })
    );
  };

  const getTransactionById = (groupId: string, transactionId: string) => {
    const group = getGroupById(groupId);
    if (!group) return undefined;
    return group.transactions.find((transaction) => transaction.id === transactionId);
  };

  const editTransaction = (
    groupId: string,
    transactionId: string,
    updatedTransaction: Omit<Transaction, 'id'>
  ) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            transactions: group.transactions.map((transaction) => {
              if (transaction.id === transactionId) {
                return {
                  ...transaction,
                  ...updatedTransaction,
                };
              }
              return transaction;
            }),
          };
        }
        return group;
      })
    );
  };

  const deleteTransaction = (groupId: string, transactionId: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            transactions: group.transactions.filter(
              (transaction) => transaction.id !== transactionId
            ),
          };
        }
        return group;
      })
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  const calculateDebts = (groupId: string): Debt[] => {
    const group = getGroupById(groupId);
    if (!group) return [];

    // Store direct debts between individuals (who owes whom and how much)
    const directDebts: Record<string, Record<string, number>> = {};

    // Initialize directDebts structure
    group.people.forEach((person) => {
      directDebts[person.id] = {};
      group.people.forEach((otherPerson) => {
        if (person.id !== otherPerson.id) {
          directDebts[person.id][otherPerson.id] = 0;
        }
      });
    });

    // Calculate direct debts from each transaction
    group.transactions.forEach((transaction) => {
      const paidById = transaction.paidById;
      const amountPerPerson = transaction.amount / transaction.participants.length;

      transaction.participants.forEach((participantId) => {
        if (participantId !== paidById) {
          // The participant owes money to the payer
          directDebts[participantId][paidById] += amountPerPerson;
        }
      });
    });

    // Simplify debts (if A owes B $5 and B owes A $3, then A only owes B $2)
    group.people.forEach((personA) => {
      group.people.forEach((personB) => {
        if (personA.id === personB.id) return;

        const aOwesB = directDebts[personA.id][personB.id];
        const bOwesA = directDebts[personB.id][personA.id];

        if (aOwesB > 0 && bOwesA > 0) {
          if (aOwesB > bOwesA) {
            directDebts[personA.id][personB.id] = aOwesB - bOwesA;
            directDebts[personB.id][personA.id] = 0;
          } else {
            directDebts[personB.id][personA.id] = bOwesA - aOwesB;
            directDebts[personA.id][personB.id] = 0;
          }
        }
      });
    });

    // Convert to Debt[] format
    const debts: Debt[] = [];
    Object.entries(directDebts).forEach(([fromPersonId, toPersonDebts]) => {
      Object.entries(toPersonDebts).forEach(([toPersonId, amount]) => {
        if (amount > 0) {
          debts.push({
            fromPersonId,
            toPersonId,
            amount: parseFloat(amount.toFixed(2)),
          });
        }
      });
    });

    return debts;
  };

  const value = {
    groups,
    addGroup,
    addPerson,
    addTransaction,
    getGroupById,
    getTransactionById,
    editTransaction,
    deleteTransaction,
    deleteGroup,
    calculateDebts,
    mapLocation,
    isMapOpen,
    openMap,
    closeMap,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

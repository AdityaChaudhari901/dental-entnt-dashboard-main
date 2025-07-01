
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  address: string;
  healthInfo: string;
  emergencyContact: string;
  createdAt: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  nextDate?: string;
  files: FileAttachment[];
  createdAt: string;
}

interface AppState {
  users: User[];
  patients: Patient[];
  incidents: Incident[];
  currentUser: User | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: string }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: Incident }
  | { type: 'DELETE_INCIDENT'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

const initialState: AppState = {
  users: [
    { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
    { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' },
    { id: '3', role: 'Patient', email: 'jane@entnt.in', password: 'patient123', patientId: 'p2' },
  ],
  patients: [
    {
      id: 'p1',
      name: 'John Doe',
      dob: '1990-05-10',
      contact: '1234567890',
      email: 'john@entnt.in',
      address: '123 Main St, City, State 12345',
      healthInfo: 'No known allergies. Regular checkups.',
      emergencyContact: 'Jane Doe - 0987654321',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'p2',
      name: 'Jane Smith',
      dob: '1985-08-22',
      contact: '0987654321',
      email: 'jane@entnt.in',
      address: '456 Oak Ave, City, State 12345',
      healthInfo: 'Diabetic. Requires special care.',
      emergencyContact: 'John Smith - 1234567890',
      createdAt: '2024-02-10T14:30:00Z'
    },
  ],
  incidents: [
    {
      id: 'i1',
      patientId: 'p1',
      title: 'Toothache Treatment',
      description: 'Upper molar pain requiring root canal',
      comments: 'Patient sensitive to cold. Local anesthesia applied.',
      appointmentDate: '2025-01-15T10:00:00',
      cost: 280,
      treatment: 'Root canal therapy with temporary filling',
      status: 'Completed',
      nextDate: '2025-02-15T10:00:00',
      files: [],
      createdAt: '2024-12-20T09:00:00Z'
    },
    {
      id: 'i2',
      patientId: 'p1',
      title: 'Dental Cleaning',
      description: 'Routine dental cleaning and examination',
      comments: 'Regular maintenance. Good oral hygiene.',
      appointmentDate: '2025-02-01T14:00:00',
      status: 'Scheduled',
      files: [],
      createdAt: '2024-12-25T11:00:00Z'
    },
    {
      id: 'i3',
      patientId: 'p2',
      title: 'Cavity Filling',
      description: 'Small cavity in lower left molar',
      comments: 'Minor cavity. Composite filling recommended.',
      appointmentDate: '2025-01-20T16:00:00',
      cost: 150,
      treatment: 'Composite filling',
      status: 'Completed',
      files: [],
      createdAt: '2024-12-18T13:00:00Z'
    },
  ],
  currentUser: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(p => p.id !== action.payload),
        incidents: state.incidents.filter(i => i.patientId !== action.payload)
      };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [...state.incidents, action.payload] };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i => i.id === action.payload.id ? action.payload : i)
      };
    case 'DELETE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.filter(i => i.id !== action.payload)
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('dental-center-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('dental-center-data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import { create } from 'zustand';

export interface SampleMediaOption {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export const SAMPLE_MEDIA_TYPES: SampleMediaOption[] = [
  { id: 'media-1', name: 'Asbestos PCM Cassette', category: 'Asbestos Air', icon: 'beaker-outline' },
  { id: 'media-2', name: 'Asbestos TEM Cassette', category: 'Asbestos Air', icon: 'layers-outline' },
  { id: 'media-3', name: 'Endotoxin free cassette', category: 'Biological', icon: 'shield-outline' },
  { id: 'media-4', name: 'Polycarbonate Air Filter Cassette', category: 'Air Filter', icon: 'filter-outline' },
  { id: 'media-5', name: 'PTFE Filter Cassette', category: 'Air Filter', icon: 'disc-outline' },
  { id: 'media-6', name: 'Spore Trap: Cassette', category: 'Mold Air', icon: 'bug-outline' },
  { id: 'media-7', name: 'Spore Trap: Slide', category: 'Mold Surface', icon: 'square-outline' },
  { id: 'media-8', name: 'Via-cell cassette', category: 'Microbial', icon: 'cube-outline' },
  { id: 'media-9', name: 'Asbestos Bulk Sample', category: 'Bulk Solid', icon: 'construct-outline' },
  { id: 'media-10', name: 'Dust Wipe Sample', category: 'Surface Wipe', icon: 'color-palette-outline' },
];

export interface SampleItem {
  id: string;
  sampleId: string;
  sampleType: string; // From SAMPLE_MEDIA_TYPES
  analysis1: boolean;
  analysis2: boolean;
  description: string;
  property: string;
  measurement: string;
  measurementUnit: string;
  notes?: string;
  photoUri?: string;
}

export interface ChainOfCustodyReport {
  id: string;
  description: string;
  poNumber: string;
  zipcode: string;
  samplingDate: string;
  samplingTime: string;
  
  // Contact Info
  accountName: string;
  contactName: string;
  address: string;
  phone: string;
  sampledBy: string;

  // Weather Info
  weatherClear: boolean;
  weatherFog: string;
  weatherRain: string;
  weatherSnow: string;
  weatherWind: string;

  // Special Instructions & Submission
  specialInstructions: string;
  courierSignature?: string;
  inspectorSignature?: string;
  resamplingNotification: string;
  agreedToTerms: boolean;
  isTemplate: boolean;

  // Samples
  samples: SampleItem[];
  status: 'Draft' | 'Submitted' | 'Completed';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountName: string;
  phone: string;
  address: string;
  role: 'Admin' | 'Employee';
}

interface AppState {
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  user: UserProfile | null;
  pendingEmail: string | null;
  reports: ChainOfCustodyReport[];
  currentReport: ChainOfCustodyReport;

  // Actions
  login: (email: string) => void;
  verify2FA: (otpCode: string) => boolean;
  logout: () => void;
  updateCurrentReport: (data: Partial<ChainOfCustodyReport>) => void;
  addSample: (sample: SampleItem) => void;
  updateSample: (sampleId: string, updated: Partial<SampleItem>) => void;
  removeSample: (sampleId: string) => void;
  saveCurrentReportAsDraft: () => void;
  submitCurrentReport: () => void;
  deleteReport: (reportId: string) => void;
}

const defaultReport: ChainOfCustodyReport = {
  id: 'COC-1001',
  description: 'Residential Mold & Asbestos Survey',
  poNumber: 'PO-99482',
  zipcode: '75208',
  samplingDate: '01/27/2026',
  samplingTime: '09:49 AM',
  accountName: 'Alpha Environmental - DFW/47674',
  contactName: 'Ali Saleh',
  address: '539 W Commerce St, #4070 Dallas, TX 75208',
  phone: '214-994-9874',
  sampledBy: 'Ali Saleh',
  weatherClear: true,
  weatherFog: 'None',
  weatherRain: 'None',
  weatherSnow: 'None',
  weatherWind: 'None',
  specialInstructions: 'Analyze asbestos samples via PLM visual estimation. Send rush 24h reports.',
  resamplingNotification: 'None',
  agreedToTerms: true,
  isTemplate: false,
  status: 'Submitted',
  createdAt: '01/27/2026',
  samples: [
    {
      id: 'S-13',
      sampleId: '13',
      sampleType: 'Asbestos PCM Cassette',
      analysis1: true,
      analysis2: false,
      description: 'Master Bedroom Drywall',
      property: 'None',
      measurement: '0',
      measurementUnit: 'N/A',
      notes: 'Near window frame',
    },
    {
      id: 'S-14',
      sampleId: '14',
      sampleType: 'Spore Trap: Cassette',
      analysis1: true,
      analysis2: false,
      description: 'Kitchen Ceiling Tile',
      property: 'None',
      measurement: '75',
      measurementUnit: 'Liters',
      notes: 'Water stain observed',
    },
  ],
};

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: true,
  is2FAVerified: true,
  user: {
    id: 'usr-1',
    name: 'Ali Saleh',
    email: 'ali@alphaenvironmental.com',
    accountName: 'Alpha Environmental - DFW/47674',
    phone: '214-994-9874',
    address: '539 W Commerce St, #4070 Dallas, TX 75208',
    role: 'Admin',
  },
  pendingEmail: null,
  reports: [defaultReport],
  currentReport: defaultReport,

  login: (email: string) => {
    set({
      pendingEmail: email,
      isAuthenticated: true,
      is2FAVerified: false,
    });
  },

  verify2FA: (otpCode: string) => {
    if (otpCode.length === 6) {
      set({ is2FAVerified: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      is2FAVerified: false,
    });
  },

  updateCurrentReport: (data) => {
    set((state) => ({
      currentReport: { ...state.currentReport, ...data },
    }));
  },

  addSample: (sample) => {
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        samples: [...state.currentReport.samples, sample],
      },
    }));
  },

  updateSample: (sampleId, updated) => {
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        samples: state.currentReport.samples.map((s) =>
          s.id === sampleId ? { ...s, ...updated } : s
        ),
      },
    }));
  },

  removeSample: (sampleId) => {
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        samples: state.currentReport.samples.filter((s) => s.id !== sampleId),
      },
    }));
  },

  saveCurrentReportAsDraft: () => {
    const current = get().currentReport;
    const reportToSave: ChainOfCustodyReport = {
      ...current,
      status: 'Draft',
    };
    set((state) => ({
      reports: [reportToSave, ...state.reports.filter((r) => r.id !== reportToSave.id)],
    }));
  },

  submitCurrentReport: () => {
    const current = get().currentReport;
    const reportToSubmit: ChainOfCustodyReport = {
      ...current,
      status: 'Submitted',
    };
    set((state) => ({
      reports: [reportToSubmit, ...state.reports.filter((r) => r.id !== reportToSubmit.id)],
      currentReport: reportToSubmit,
    }));
  },

  deleteReport: (reportId) => {
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== reportId),
    }));
  },
}));

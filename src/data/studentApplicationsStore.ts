import { useState, useEffect } from 'react';
import { 
  OnCampusApplication, 
  OffCampusApplication, 
  CollegeSelectedStudentRecord,
  RecruitedStudentRecord
} from '../types';

export type { 
  OnCampusApplication, 
  OffCampusApplication, 
  CollegeSelectedStudentRecord,
  RecruitedStudentRecord 
};




class StudentApplicationsStore {
  private onCampusApps: OnCampusApplication[] = [];
  private offCampusApps: OffCampusApplication[] = [];
  private collegeSelected: CollegeSelectedStudentRecord[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedOnCampus = localStorage.getItem('sb_on_campus_apps');
      if (storedOnCampus) {
        this.onCampusApps = JSON.parse(storedOnCampus);
      }
      const storedOffCampus = localStorage.getItem('sb_off_campus_apps');
      if (storedOffCampus) {
        this.offCampusApps = JSON.parse(storedOffCampus);
      }
      const storedSelected = localStorage.getItem('sb_college_selected');
      if (storedSelected) {
        this.collegeSelected = JSON.parse(storedSelected);
      }
    } catch {
      // Ignore local storage error in sandboxed environment
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('sb_on_campus_apps', JSON.stringify(this.onCampusApps));
      localStorage.setItem('sb_off_campus_apps', JSON.stringify(this.offCampusApps));
      localStorage.setItem('sb_college_selected', JSON.stringify(this.collegeSelected));
    } catch {
      // Ignore local storage error
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in application store listener', err);
      }
    });
  }

  // Get On-Campus applications
  public getOnCampusApplications(filters?: {
    companyName?: string;
    collegeName?: string;
    status?: string;
  }): OnCampusApplication[] {
    let list = [...this.onCampusApps];
    if (filters?.companyName && filters.companyName !== 'All') {
      list = list.filter(a => a.companyName.toLowerCase().includes(filters.companyName!.toLowerCase()));
    }
    if (filters?.collegeName && filters.collegeName !== 'All') {
      list = list.filter(a => a.collegeName.toLowerCase().includes(filters.collegeName!.toLowerCase()));
    }
    if (filters?.status && filters.status !== 'All') {
      list = list.filter(a => a.status === filters.status);
    }
    return list;
  }

  // Get Off-Campus applications
  public getOffCampusApplications(filters?: {
    status?: string;
  }): OffCampusApplication[] {
    let list = [...this.offCampusApps];
    if (filters?.status && filters.status !== 'All') {
      list = list.filter(a => a.status === filters.status);
    }
    return list;
  }

  // Update candidate status by company (Shortlist / Select / Reject)
  public updateCandidateStatus(
    applicationId: string, 
    newStatus: OnCampusApplication['status'],
    packageOffered?: string,
    offeredRole?: string
  ) {
    this.onCampusApps = this.onCampusApps.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          packageOffered: packageOffered || app.packageOffered || '₹20.0 LPA',
          offeredRole: offeredRole || app.offeredRole || app.jobTitle,
          selectionYear: newStatus === 'selected' ? '2026' : app.selectionYear
        };
      }
      return app;
    });

    this.notify();
  }

  // Update candidate status by Roll Number, Student Name, or Application ID
  public updateCandidateStatusByRollOrName(
    rollOrNameOrId: string,
    newStatus: OnCampusApplication['status'],
    packageOffered?: string,
    offeredRole?: string
  ) {
    const target = rollOrNameOrId.trim().toLowerCase();
    this.onCampusApps = this.onCampusApps.map(app => {
      if (
        app.id.toLowerCase() === target ||
        app.rollNumber.toLowerCase() === target ||
        app.studentName.toLowerCase() === target ||
        app.studentName.toLowerCase().includes(target)
      ) {
        return {
          ...app,
          status: newStatus,
          packageOffered: packageOffered || app.packageOffered || '₹20.0 LPA',
          offeredRole: offeredRole || app.offeredRole || app.jobTitle,
          selectionYear: newStatus === 'selected' ? '2026' : app.selectionYear
        };
      }
      return app;
    });

    this.notify();
  }

  // Company transmits finalized batch to College TPO
  public transmitResultsToTpo(companyName?: string, collegeName?: string): {
    transmittedCount: number;
    selectedAdded: number;
  } {
    let count = 0;
    let selectedAdded = 0;

    this.onCampusApps = this.onCampusApps.map(app => {
      const matchCompany = !companyName || app.companyName.toLowerCase().includes(companyName.toLowerCase());
      const matchCollege = !collegeName || app.collegeName.toLowerCase().includes(collegeName.toLowerCase());

      if (matchCompany && matchCollege) {
        count++;

        // If candidate is selected, add to official College Selected list
        if (app.status === 'selected' && !app.isTransmittedToTpo) {
          selectedAdded++;
          const exists = this.collegeSelected.some(s => s.rollNumber === app.rollNumber && s.companyName === app.companyName);
          if (!exists) {
            this.collegeSelected.unshift({
              id: `sel-${Date.now()}-${app.id}`,
              studentName: app.studentName,
              rollNumber: app.rollNumber,
              collegeName: app.collegeName,
              branch: app.branch,
              companyName: app.companyName,
              companyLogo: app.companyLogo,
              role: app.offeredRole || app.jobTitle,
              packageOffered: app.packageOffered || '₹22.0 LPA',
              selectionYear: app.selectionYear || '2026',
              hiringType: 'Direct On-Campus Hire',
              selectionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              verifiedSkills: app.skillsLearned.map(s => s.name),
              isDirectCompanyTransmission: true
            });
          }
        }

        return { ...app, isTransmittedToTpo: true };
      }
      return app;
    });

    this.notify();
    return { transmittedCount: count, selectedAdded };
  }

  // Update Off-Campus candidate status
  public updateOffCampusCandidateStatus(
    applicationId: string,
    newStatus: OffCampusApplication['status']
  ) {
    this.offCampusApps = this.offCampusApps.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus
        };
      }
      return app;
    });
    this.notify();
  }

  // Direct candidate selection transmission to College TPO
  public addSelectedStudentDirectly(details: {
    studentId?: string;
    studentName: string;
    rollNumber: string;
    companyName: string;
    role: string;
    packageOffered: string;
    offerType: string;
    placementYear: string;
    branch: string;
    cgpa?: string;
    postingLocation?: string;
    joiningDate?: string;
    avatar?: string;
  }) {
    const existingIndex = this.collegeSelected.findIndex(
      s => s.rollNumber === details.rollNumber && s.companyName.toLowerCase() === details.companyName.toLowerCase()
    );

    const record: CollegeSelectedStudentRecord = {
      id: `sel-direct-${Date.now()}`,
      studentName: details.studentName,
      rollNumber: details.rollNumber,
      collegeName: 'Institute of Technology, Jodhpur',
      branch: details.branch,
      cgpa: details.cgpa || '8.9',
      avatar: details.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      companyName: details.companyName,
      companyLogo: details.companyName.substring(0, 2).toUpperCase(),
      role: details.role,
      packageOffered: details.packageOffered,
      selectionYear: details.placementYear || '2026',
      hiringType: details.offerType === 'Intern + PPO' ? 'PPO via Internship' : 'Direct On-Campus Hire',
      selectionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      verifiedSkills: ['Full Stack Development', 'System Design', 'Algorithmic Problem Solving'],
      postingLocation: details.postingLocation || 'Bengaluru, Karnataka (Hybrid)',
      joiningDate: details.joiningDate || 'July 2026',
      isDirectCompanyTransmission: true
    };

    if (existingIndex >= 0) {
      this.collegeSelected[existingIndex] = record;
    } else {
      this.collegeSelected.unshift(record);
    }

    // Also update onCampus status if matching roll or ID
    const matchingApp = this.onCampusApps.find(
      a => (details.studentId && a.id === details.studentId) || a.rollNumber === details.rollNumber || a.studentName.toLowerCase() === details.studentName.toLowerCase()
    );
    if (matchingApp) {
      matchingApp.status = 'selected';
      matchingApp.packageOffered = details.packageOffered;
      matchingApp.offeredRole = details.role;
      matchingApp.postingLocation = details.postingLocation || 'Bengaluru, Karnataka (Hybrid)';
      matchingApp.joiningDate = details.joiningDate || 'July 2026';
      matchingApp.isTransmittedToTpo = true;
    }

    this.notify();
  }

  // Get Selected Students for College TPO
  public getSelectedStudents(filters?: {
    year?: string;
    companyName?: string;
    branch?: string;
  }): CollegeSelectedStudentRecord[] {
    let list = [...this.collegeSelected];
    if (filters?.year && filters.year !== 'All') {
      list = list.filter(s => s.selectionYear === filters.year);
    }
    if (filters?.companyName && filters.companyName !== 'All') {
      list = list.filter(s => s.companyName.toLowerCase().includes(filters.companyName!.toLowerCase()));
    }
    if (filters?.branch && filters.branch !== 'All') {
      list = list.filter(s => s.branch.toLowerCase().includes(filters.branch!.toLowerCase()));
    }
    return list;
  }
}

export const studentApplicationsStore = new StudentApplicationsStore();

// React Custom Hooks for reactive state across TPO and Company views
export function useOnCampusApplications() {
  const [apps, setApps] = useState(() => studentApplicationsStore.getOnCampusApplications());
  useEffect(() => {
    return studentApplicationsStore.subscribe(() => {
      setApps(studentApplicationsStore.getOnCampusApplications());
    });
  }, []);
  return apps;
}

export function useOffCampusApplications() {
  const [apps, setApps] = useState(() => studentApplicationsStore.getOffCampusApplications());
  useEffect(() => {
    return studentApplicationsStore.subscribe(() => {
      setApps(studentApplicationsStore.getOffCampusApplications());
    });
  }, []);
  return apps;
}

export function useCollegeSelectedStudents() {
  const [selected, setSelected] = useState(() => studentApplicationsStore.getSelectedStudents());
  useEffect(() => {
    return studentApplicationsStore.subscribe(() => {
      setSelected(studentApplicationsStore.getSelectedStudents());
    });
  }, []);
  return selected;
}

export function updateOnCampusCandidateStatus(
  applicationId: string, 
  newStatus: OnCampusApplication['status'],
  packageOffered?: string,
  offeredRole?: string
) {
  studentApplicationsStore.updateCandidateStatus(applicationId, newStatus, packageOffered, offeredRole);
}

export function updateOffCampusCandidateStatus(
  applicationId: string, 
  newStatus: OffCampusApplication['status']
) {
  studentApplicationsStore.updateOffCampusCandidateStatus(applicationId, newStatus);
}

export function transmitCandidateSelectionToTpo(details: {
  studentId?: string;
  studentName: string;
  rollNumber: string;
  companyName: string;
  role: string;
  packageOffered: string;
  offerType: string;
  placementYear: string;
  branch: string;
  cgpa?: string;
  postingLocation?: string;
  joiningDate?: string;
  avatar?: string;
}) {
  studentApplicationsStore.addSelectedStudentDirectly(details);
}

export function updateCandidateStatusByRollOrName(
  rollOrNameOrId: string,
  newStatus: OnCampusApplication['status'],
  packageOffered?: string,
  offeredRole?: string
) {
  studentApplicationsStore.updateCandidateStatusByRollOrName(rollOrNameOrId, newStatus, packageOffered, offeredRole);
}


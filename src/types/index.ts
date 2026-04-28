import { ProblemType, Severity, TaskStatus } from "@prisma/client";

export interface ReportFormData {
  problemType: ProblemType;
  location: string;
  description: string;
  severity: Severity;
  contactInfo?: string;
}

export interface VolunteerProfileFormData {
  skills: string[];
  preferredLocation: string;
}

export interface MicroTaskFormData {
  title: string;
  description: string;
  location: string;
  reportId: string;
}
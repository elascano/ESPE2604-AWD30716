export type ProcessStepStatus = 'completed' | 'pending' | 'blocked' | 'in-progress';

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: ProcessStepStatus;
  completedAt?: string;
  module: string;
}

export type UrgencyLevel = 'low' | 'medium' | 'high';

interface TriageInput {
  totalScore: number;
  hasEmergencyFlag: boolean; 
}

export class PerformTriage {
  public execute(input: TriageInput): UrgencyLevel {

    if (input.hasEmergencyFlag) {
      return 'high';
    }

    if (input.totalScore >= 10) {
      return 'high';
    }
    
    if (input.totalScore >= 5) {
      return 'medium';
    }

    return 'low';
  }
}
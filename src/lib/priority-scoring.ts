import { ProblemType, Severity } from "@prisma/client";

export function calculatePriorityScore(
  problemType: ProblemType,
  sameLocationCount: number,
  severity: Severity
): number {
  // Base scores by problem type
  const baseScores = {
    [ProblemType.MEDICAL]: 5,
    [ProblemType.FOOD]: 4,
    [ProblemType.EDUCATION]: 3,
    [ProblemType.SHELTER]: 3,
    [ProblemType.SANITATION]: 2,
    [ProblemType.OTHER]: 1,
  };

  const baseScore = baseScores[problemType];
  const locationBonus = sameLocationCount;
  const severityBonus = severity === Severity.HIGH ? 1 : 0;

  return baseScore + locationBonus + severityBonus;
}

export function getPriorityLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

export function getPriorityColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
  }
}
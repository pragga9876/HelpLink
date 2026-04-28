interface PriorityBadgeProps {
  score: number;
}

export function PriorityBadge({ score }: PriorityBadgeProps) {
  let color = "";
  let label = "";
  
  if (score >= 7) {
    color = "bg-red-100 text-red-800";
    label = "Critical Priority";
  } else if (score >= 4) {
    color = "bg-orange-100 text-orange-800";
    label = "High Priority";
  } else {
    color = "bg-green-100 text-green-800";
    label = "Normal Priority";
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {label} (Score: {score})
    </span>
  );
}
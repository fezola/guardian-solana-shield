
import { Clock } from "lucide-react";

interface UpdatedTimestampProps {
  date: string; // ISO date string
}

const UpdatedTimestamp = ({ date }: UpdatedTimestampProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center text-xs text-muted-foreground mt-2">
      <Clock className="h-3.5 w-3.5 mr-1" />
      Last updated: {formatDate(date)}
    </div>
  );
};

export default UpdatedTimestamp;

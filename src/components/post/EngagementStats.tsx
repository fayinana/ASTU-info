
import { ThumbsUp, MessageSquare } from "lucide-react";

interface EngagementStatsProps {
  likesCount: number;
  commentsCount: number;
}

export const EngagementStats = ({
  likesCount,
  commentsCount,
}: EngagementStatsProps) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground space-x-3">
      {likesCount > 0 && (
        <div className="flex items-center">
          <ThumbsUp className="h-3.5 w-3.5 mr-1 text-primary fill-current" />
          <span>{likesCount}</span>
        </div>
      )}
      
      {commentsCount > 0 && (
        <div className="flex items-center">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          <span>{commentsCount} comments</span>
        </div>
      )}
    </div>
  );
};

export default EngagementStats;

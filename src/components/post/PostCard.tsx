import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "../user/Avatar";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "./LikeButton";
import { EngagementStats } from "./EngagementStats";
import { POST_TYPE_COLORS, POST_TYPES } from "@/lib/constants";
import { formatDateTime, truncateText } from "@/lib/utils";
import { MessageSquare, Share } from "lucide-react";
import { adaptAppUserToApiUser } from "@/lib/typeAdapters";

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
}

export const PostCard = ({ post, showFullContent = false }: PostCardProps) => {
  const [showMore, setShowMore] = useState(false);
  const isContentLong = post.content?.length > 200;

  const [isLiked, setIsLiked] = useState(false);

  const displayedContent =
    showFullContent || showMore
      ? post.content
      : truncateText(post.content || "", 200);

  const apiUser = adaptAppUserToApiUser(post.author);

  return (
    <Card className="w-full mb-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar user={apiUser} />
            <div>
              <p className="font-medium text-md">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(post.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            style={{ backgroundColor: POST_TYPE_COLORS[post.type] }}
            className="text-white"
          >
            {POST_TYPES[post.type]}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2">{post.title}</CardTitle>
        <CardDescription>
          {post.target_department !== "All Departments" &&
            post.target_department &&
            `Department: ${post.target_department}`}
          {post.target_batch && ` • Batch: ${post.target_batch}`}
          {post.target_section && ` • Section: ${post.target_section}`}
          {post.target_school && ` • School: ${post.target_school}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-1">
        <p className="text-md">{displayedContent}</p>
        {isContentLong && !showFullContent && !showMore && (
          <Button
            variant="ghost"
            className="text-primary p-0 h-auto mt-2"
            onClick={() => setShowMore(true)}
          >
            Read more
          </Button>
        )}

        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {post.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  {attachment.title}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <LikeButton
            postId={post._id}
            isLiked={isLiked}
            initialLikes={post.like?.length || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;

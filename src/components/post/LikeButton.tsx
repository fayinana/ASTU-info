import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeDisLike } from "@/hooks/useEngagement";

interface LikeButtonProps {
  postId?: string; // Make postId optional
  initialLikes?: number;
  initialLiked?: boolean;
  isLiked?: boolean;
}

export const LikeButton = ({
  postId,
  initialLikes = 0,
  initialLiked = false,
  isLiked: isLikedProp,
}: LikeButtonProps) => {
  const { likeDislike } = useLikeDisLike();
  const [likedState, setLikedState] = useState(initialLiked);
  const [likesState, setLikesState] = useState(initialLikes);

  const isControlled = isLikedProp !== undefined;
  const liked = isControlled ? isLikedProp : likedState;
  const likes = likesState;

  function handleLike() {
    if (!postId) return; // Safety check

    // Optimistically update UI state if uncontrolled
    if (!isControlled) {
      if (liked) {
        setLikedState(false);
        setLikesState((prev) => Math.max(prev - 1, 0));
      } else {
        setLikedState(true);
        setLikesState((prev) => prev + 1);
      }
    }

    // Call API or hook function to update backend
    likeDislike(postId);
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLike}
      className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </Button>
  );
};

export default LikeButton;

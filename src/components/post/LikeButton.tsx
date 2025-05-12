
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Size } from '@/lib/types';

interface LikeButtonProps {
  postId?: string; // Make postId optional 
  initialLikes?: number;
  initialLiked?: boolean;
  size?: Size;
  isLiked?: boolean;
  onLike?: (postId: string, liked: boolean) => void;
  onToggle?: () => void;
}

export const LikeButton = ({
  postId,
  initialLikes = 0,
  initialLiked = false,
  size = "default",
  isLiked: isLikedProp,
  onLike,
  onToggle,
}: LikeButtonProps) => {
  const [likedState, setLikedState] = useState(initialLiked);
  const [likesState, setLikesState] = useState(initialLikes);
  
  const isControlled = isLikedProp !== undefined;
  const liked = isControlled ? isLikedProp : likedState;
  const likes = likesState;

  const handleLike = () => {
    if (!isControlled) {
      const newLikedState = !likedState;
      setLikedState(newLikedState);
      setLikesState(likes + (newLikedState ? 1 : -1));
      if (onLike && postId) {
        onLike(postId, newLikedState);
      }
    } else if (onToggle) {
      onToggle();
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
};

export default LikeButton;

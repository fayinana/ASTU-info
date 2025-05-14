import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "../user/Avatar";
import { Comment } from "@/types/post";
import { User } from "@/types/user";
import { formatRelativeTime } from "@/lib/utils";
import { z } from "zod";
import { Edit, Trash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { adaptApiUserToAppUser } from "@/lib/typeAdapters";

// Form schema for comments
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment: (postId: string, content: string) => void;
  onUpdateComment?: (id: string, postId: string, content: string) => void;
  onDeleteComment?: (id: string, postId: string) => void;
  isSubmitting?: boolean;
}

export const CommentSection = ({
  comments,
  postId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  isSubmitting = false,
}: CommentSectionProps) => {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const addCommentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const editCommentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleAddComment = (data: CommentFormValues) => {
    onAddComment(postId, data.content);
    addCommentForm.reset();
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment._id);
    editCommentForm.reset({
      content: comment.text,
    });
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
  };

  const handleUpdateComment = (data: CommentFormValues) => {
    if (editingCommentId) {
      onUpdateComment?.(editingCommentId, postId, data.content);
      setEditingCommentId(null);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    onDeleteComment?.(commentId, postId);
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const canEditComment = (comment: Comment) => {
    if (!user) return false;

    const commentAuthorId =
      typeof comment.author === "string" ? comment.author : comment.author._id;

    return commentAuthorId === user._id || user.role === "admin";
  };

  return (
    <div className="space-y-4 pt-2">
      <h3 className="font-medium">Comments ({comments.length})</h3>

      {user && (
        <form
          onSubmit={addCommentForm.handleSubmit(handleAddComment)}
          className="flex items-start space-x-2"
        >
          <Avatar user={user} size="sm" />
          <div className="flex-1">
            <Input
              placeholder="Write a comment..."
              {...addCommentForm.register("content")}
              disabled={isSubmitting}
            />
            {addCommentForm.formState.errors.content && (
              <p className="text-xs text-red-500 mt-1">
                {addCommentForm.formState.errors.content.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-primary"
            disabled={isSubmitting}
          >
            Post
          </Button>
        </form>
      )}

      <Separator />

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          sortedComments.map((comment) => {
            // Get the appropriate user object for the comment author
            const commentUser =
              typeof comment.author === "string"
                ? ({
                    _id: comment.author,
                    name: "Unknown User",
                    email: comment.email || "",
                    role: "student",
                    isApproved: true,
                  } as User)
                : comment.author;

            return (
              <div key={comment._id} className="flex space-x-2">
                <Avatar user={commentUser} size="sm" />
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {typeof comment.author === "string"
                          ? comment.email?.split("@")[0] || "User"
                          : comment.author.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.createdAt.toString())}
                      </span>
                    </div>

                    {editingCommentId === comment._id ? (
                      <form
                        onSubmit={editCommentForm.handleSubmit(
                          handleUpdateComment
                        )}
                        className="mt-2"
                      >
                        <Input
                          {...editCommentForm.register("content")}
                          defaultValue={comment.text}
                        />
                        {editCommentForm.formState.errors.content && (
                          <p className="text-xs text-red-500 mt-1">
                            {editCommentForm.formState.errors.content.message}
                          </p>
                        )}
                        <div className="flex space-x-2 mt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-primary"
                            disabled={isSubmitting}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm mt-1">{comment.text}</p>
                    )}
                  </div>

                  {canEditComment(comment) &&
                    editingCommentId !== comment._id && (
                      <div className="flex items-center space-x-2 mt-1 ml-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteComment(comment._id || "")}
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;

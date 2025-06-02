import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { CommentSection } from "@/components/post/CommentSection";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import useAppToast from "@/hooks/useAppToast";
import { useLikeDisLike } from "@/hooks/useEngagement";
import { usePost, usePosts } from "@/hooks/usePosts";
import {
  AlertTriangle,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useAppToast();
  const { user } = useAuth();
  // In a real app, we'd fetch the post data using a hook like usePosts
  // For this demo, we'll use mock data
const {error : postError, isLoading : isLoadingPost , post , refetch} = usePost(id as string);
  const {
    error: likeError,
    likeDislike,
    isLoading: isiking,
  } = useLikeDisLike();

  if (isLoadingPost)
    return (
      <AppLayout>
        <LoadingOverlay message="Loading..." isLoading={isLoadingPost} />;
      </AppLayout>
    );
  const isLiked = post?.like?.includes(user._id as unknown as string); // Ensure type compatibility
  if (!post) {
    return <p>Post not found</p>;
  }

  const handleDeletePost = () => {
    // change this with the function call
    error({
      title: "Post Deleted",
      description: "The post has been removed from the platform.",
    });
  };
  const handleLikeDislike = () => {
    likeDislike(post._id);
  };
  if (postError) {
    return (
      <AppLayout
        title="Post Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/student/dashboard" },
          { label: "Posts", href: "/student/posts" },
          { label: "Post Details" },
        ]}
        allowedRoles={["student"]}
      >
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-semibold">Post Not Found</h2>
          <p className="text-muted-foreground">
            The requested post could not be found.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Post Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Posts", href: "/student/posts" },
        { label: post.title },
      ]}
      allowedRoles={["student"]}
    >
      <div className="space-y-6">
        {/* Post Information */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={post.type} className="capitalize" />
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete Post
            </Button>
          </div>
        </div>

        {/* Post Content and Metadata */}

        {/* Main post content */}
        <div className=" space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" />
              {post.content}
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleLikeDislike}
                >
                  {isLiked ? (
                    <ThumbsUp className="h-5 w-5 mr-2 text-#ff0000-500" />
                  ) : (
                    <ThumbsUp className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">{post.like?.length || 0}</div>
                    <div className="text-muted-foreground text-sm">Likes</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">
                    {post.comments?.length || 0}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Comments
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection
                postId={post._id}
                comments={post.comments}
                onAddComment={() => {}}
                onDeleteComment={() => {}}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PostDetail;

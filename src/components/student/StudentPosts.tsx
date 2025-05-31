import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/post/PostCard";
import { PostListSkeleton } from "@/components/skeletons/PostListSkeleton";
import { useAuth } from "@/context/AuthContext";
import { adaptApiPostToAppPost } from "@/lib/typeAdapters";
import { access } from "fs";

interface StudentPostsProps {
  showHeader?: boolean;
  maxPosts?: number;
}

const StudentPosts: React.FC<StudentPostsProps> = ({
  showHeader = true,
  maxPosts = 5,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<
    "all" | "announcement" | "instructional" | "public"
  >("all");

  // Options for fetching posts
  // const options = {
  //   limit: maxPosts,
  //   type: activeTab,
  // };

  // Set type filter if not 'all'
  // if (activeTab !== "all") {
  //   options.type = activeTab === "all" ? "" : activeTab;
  // }

  // Fetch posts
  const { posts, isLoading, error } = usePosts({
    limit: maxPosts,
    type: activeTab === "all" ? undefined : activeTab,
  });

  return (
    <Card className="shadow-sm">
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h2 className="text-xl font-semibold">Posts</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/student/public-posts/create")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </CardHeader>
      )}

      <CardContent className="pt-0">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
            <TabsTrigger value="instructional">Instractional</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 space-y-4">
            {isLoading ? (
              <PostListSkeleton count={3} />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load posts</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}

                {posts.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/student/posts")}
                    >
                      View all posts
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentPosts;

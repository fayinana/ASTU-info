import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, FileText, Users, MessageSquare } from "lucide-react";
import PostsSection from "@/components/dashboard/PostsSection";
import { useState } from "react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activePostType, setActivePostType] = useState<
    "instructional" | "public"
  >("instructional");

  // Fetch teacher's posts with authorId filter
  const { posts, isLoading: isLoadingPosts } = usePosts({});

  // Use stats from posts
  const totalPosts = posts?.length || 0;
  const instructionalPosts =
    posts?.filter((post) => post.type === "instructional").length || 0;
  const publicPosts =
    posts?.filter((post) => post.type === "public").length || 0;
  const recentPosts = posts.slice(0, 5);

  return (
    <AppLayout
      title="Teacher Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "Teacher"}! Manage your content and
              monitor student engagement.
            </p>
          </div>
          {/* 
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/teacher/instructional-posts/create")}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">New Instructional</span>
            </Button>
            <Button onClick={() => navigate("/teacher/public-posts/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">New Public Post</span>
            </Button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Posts
              </CardTitle>
              <p className="text-3xl font-bold">{totalPosts}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total posts you've created
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Instructional Content
              </CardTitle>
              <p className="text-3xl font-bold">{instructionalPosts}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learning materials published
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Public Posts
              </CardTitle>
              <p className="text-3xl font-bold">{publicPosts}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Public discussions started
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Posts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <PostsSection posts={recentPosts} isLoading={isLoadingPosts} />
              </CardContent>
            </Card>
          </div>

          {/* <div>
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/teacher/resources")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Resources
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/teacher/students")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Students
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/chat")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Teaching Schedule</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground text-center py-8">
                  Your upcoming classes will appear here
                </p>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </AppLayout>
  );
};

export default TeacherDashboard;

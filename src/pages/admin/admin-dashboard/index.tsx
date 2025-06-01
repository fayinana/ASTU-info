import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Bell, FileText, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PostsSection from "@/components/dashboard/PostsSection";
import { useUsers } from "@/hooks/useUsers";
import { usePosts } from "@/hooks/usePosts";
import { useAnnouncementFilters } from "@/hooks/useAnnouncementFilters";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { users, isLoading: isLoadingUser } = useUsers({
    limit: 100,
  });
  const { filters, pagination, updateFilters, updatePagination, getQuery } =
    useAnnouncementFilters();

  const { posts: announcements, isLoading: isLoadingAnnouncements } = usePosts(
    getQuery()
  );

  const { posts, isLoading: isLoadingPosts } = usePosts({
    limit: 100,
  });

  const pendingApprovals =
    users?.filter((user) => user.status === "pending") || [];
  const studentsCount =
    users?.filter((user) => user.role === "student").length || 0;
  const teachersCount =
    users?.filter((user) => user.role === "teacher").length || 0;
  const adminCount = users?.filter((user) => user.role === "admin").length || 0;
  const totalUsers = users?.length || 0;
  const totalPosts = posts?.length || 0;
  const totalAnnouncements = announcements.length || 0;
  const pendingUsers = pendingApprovals?.length || 0;
  const recentPosts = posts.slice(0, 5);

  return (
    <AppLayout
      title="Admin Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Welcome to the admin dashboard. Monitor platform activity and
              manage users, posts, and settings.
            </p>
          </div>
          <Button onClick={() => navigate("/admin/announcements/new")}>
            Create Announcement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {teachersCount} Teachers, {studentsCount} Students{" "}
                <span className="font-semibold">{adminCount} Admins</span>
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/10 rounded-tl-full"></div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all categories
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-500/10 rounded-tl-full"></div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Announcements
              </CardTitle>
              <Bell className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnnouncements}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active announcements
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-500/10 rounded-tl-full"></div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <UserCheck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting review
              </p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-tl-full"></div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <PostsSection posts={recentPosts} isLoading={isLoadingPosts} />

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/admin/users/students")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Manage Students</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View and approve student accounts
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/admin/users/teachers")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Manage Teachers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View and approve teacher accounts
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate("/admin/announcements")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Announcements</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage system announcements
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

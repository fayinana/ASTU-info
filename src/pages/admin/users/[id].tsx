"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/user/Avatar";
import { RoleBadge } from "@/components/user/RoleBadge";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import useAppToast from "@/hooks/useAppToast";
import {
  UserIcon,
  FileText,
  Clock,
  BookText,
  Check,
  X,
  AlertTriangle,
  Edit,
  Loader2,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const { success, error } = useAppToast();

  // Fetch users from multiple sources to ensure we find the user
  const { users: allUsers, isLoading: allUsersLoading } = useUsers({});
  const { users: students, isLoading: studentsLoading } = useUsers({
    role: "student",
  });
  const { users: teachers, isLoading: teachersLoading } = useUsers({
    role: "teacher",
  });

  const isLoading = allUsersLoading || studentsLoading || teachersLoading;

  // Combine all users and find the specific user
  const allCombinedUsers = [...allUsers, ...students, ...teachers];
  const uniqueUsers = allCombinedUsers.filter(
    (user, index, self) => index === self.findIndex((u) => u._id === user._id)
  );
  const user = uniqueUsers.find((user) => user._id === id);

  if (isLoading) {
    return (
      <AppLayout
        title="User Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users/students" },
          { label: "User Details" },
        ]}
        allowedRoles={["admin"]}
      >
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading user details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout
        title="User Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users/students" },
          { label: "User Details" },
        ]}
        allowedRoles={["admin"]}
      >
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-semibold">User Not Found</h2>
          <p className="text-muted-foreground">
            The requested user could not be found.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </AppLayout>
    );
  }

  const handleEditUser = () => {
    navigate(`/admin/users/${user._id}/edit`);
  };

  const handleApproveUser = () => {
    success({
      title: "User Approved",
      description: `${user.name} has been approved successfully.`,
    });
  };

  const handleRejectUser = () => {
    error({
      title: "User Rejected",
      description: `${user.name} has been rejected.`,
    });
  };

  // Mock post data for this user
  const userPosts = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      type: "instructional",
      createdAt: "2023-05-15T09:30:00Z",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      title: "Programming Basics with Python",
      type: "public",
      createdAt: "2023-04-22T14:15:00Z",
      likes: 17,
      comments: 5,
    },
    {
      id: "3",
      title: "Web Development Fundamentals",
      type: "instructional",
      createdAt: "2023-03-10T11:45:00Z",
      likes: 32,
      comments: 12,
    },
  ];

  // Mock activities for this user
  const userActivities = [
    {
      id: "1",
      action: "Login",
      description: "User logged in from Chrome on Windows",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      action: "Post Created",
      description: "Created post: Introduction to Computer Science",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "3",
      action: "Comment Added",
      description: "Commented on: Web Development Fundamentals",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "4",
      action: "Profile Updated",
      description: "Updated profile information",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
  ];

  const postColumns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: any) => <StatusBadge status={row.type} />,
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (row: any) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Engagement",
      accessorKey: "engagement",
      cell: (row: any) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{row.likes} likes</span>
          <span className="text-sm">{row.comments} comments</span>
        </div>
      ),
    },
  ];

  const activityColumns = [
    {
      header: "Action",
      accessorKey: "action",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Time",
      accessorKey: "timestamp",
      cell: (row: any) => (
        <span>{new Date(row.timestamp).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <AppLayout
      title="User Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        {
          label: user?.role === "student" ? "Students" : "Teachers",
          href:
            user?.role === "student"
              ? "/admin/users/students"
              : "/admin/users/teachers",
        },
        { label: user?.name || "User Details" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Details</h1>
            <p className="text-muted-foreground">
              View and manage user information
            </p>
          </div>
          <Button onClick={handleEditUser}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>

        {/* User Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar user={user} size="xl" className="mb-4" />
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <RoleBadge role={user.role} size="md" />
                  <StatusBadge status={user.status} text={user.status} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.department && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Department
                      </h3>
                      <p>{user.department}</p>
                    </div>
                  )}
                  {user.school && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        School
                      </h3>
                      <p>{user.school}</p>
                    </div>
                  )}
                  {user.batch && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Batch
                      </h3>
                      <p>{user.batch}</p>
                    </div>
                  )}
                  {user.section && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Section
                      </h3>
                      <p>{user.section}</p>
                    </div>
                  )}
                  {user.studentID && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Student ID
                      </h3>
                      <p>{user.studentID}</p>
                    </div>
                  )}
                  {user.createdAt && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Registered
                      </h3>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {user.status === "pending" && (
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button onClick={handleApproveUser}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve User
                    </Button>
                    <Button variant="destructive" onClick={handleRejectUser}>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details" className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center">
                  <FileText className="h-4 w-4 mr-1.5" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.bio && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Bio
                          </h4>
                          <p>{user.bio}</p>
                        </div>
                      )}
                      {user.title && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Title
                          </h4>
                          <p>{user.title}</p>
                        </div>
                      )}
                      {user.occupation && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Occupation
                          </h4>
                          <p>{user.occupation}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Account Status
                        </h4>
                        <StatusBadge status={user.status} text={user.status} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Role
                        </h4>
                        <RoleBadge role={user.role} />
                      </div>
                      {user.createdAt && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Created At
                          </h4>
                          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" onClick={handleEditUser}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="posts">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">User Posts</h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center">
                          <BookText className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            {userPosts.length} Posts
                          </span>
                        </span>
                      </div>
                    </div>

                    <DataTable
                      columns={postColumns}
                      data={userPosts}
                      onView={(post) => navigate(`/admin/posts/${post.id}`)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Recent Activity</h3>
                    <DataTable
                      columns={activityColumns}
                      data={userActivities}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserDetail;

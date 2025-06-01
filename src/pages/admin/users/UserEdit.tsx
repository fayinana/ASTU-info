"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/user/Avatar";
import { useUsers } from "@/hooks/useUsers";
import { updateProfile } from "@/api/user";
import useAppToast from "@/hooks/useAppToast";
import { Save, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useAppToast();
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    title: "",
    occupation: "",
    department: "",
    school: "",
    batch: "",
    section: "",
    studentID: "",
  });

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        title: user.title || "",
        occupation: user.occupation || "",
        department: user.department || "",
        school: user.school || "",
        batch: user.batch || "",
        section: user.section || "",
        studentID: user.studentID || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsUpdating(true);

    try {
      await updateProfile({ id: user._id, data: formData });
      ;

      success({
        title: "User Updated",
        description: `${formData.name}'s profile has been updated successfully.`,
      });

      // Navigate back to user detail page after successful update
      navigate(`/admin/users/${user._id}`);
    } catch (err: any) {
      console.error("Failed to update user:", err);
      error({
        title: "Update Failed",
        description:
          err?.message || "Failed to update user profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/students/${user?._id || ""}`);
  };

  if (isLoading) {
    return (
      <AppLayout
        title="Edit User"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users/students" },
          { label: "Edit User" },
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
        title="Edit User"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users/students" },
          { label: "Edit User" },
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

  return (
    <AppLayout
      title="Edit User"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        {
          label: user.role === "student" ? "Students" : "Teachers",
          href:
            user.role === "student"
              ? "/admin/users/students"
              : "/admin/users/teachers",
        },
        { label: user.name, href: `/admin/users/${user._id}` },
        { label: "Edit" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar user={user} size="md" />
              <div>
                <div>Edit User Profile</div>
                <CardDescription>
                  Update {user.name}'s profile information
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                {user.role === "teacher" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="e.g., Professor, Dr., Mr."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) =>
                          handleInputChange("occupation", e.target.value)
                        }
                        placeholder="e.g., Computer Science Professor"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={formData.school}
                    onChange={(e) =>
                      handleInputChange("school", e.target.value)
                    }
                  />
                </div>

                {user.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch</Label>
                      <Input
                        id="batch"
                        value={formData.batch}
                        onChange={(e) =>
                          handleInputChange("batch", e.target.value)
                        }
                        placeholder="e.g., 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={formData.section}
                        onChange={(e) =>
                          handleInputChange("section", e.target.value)
                        }
                        placeholder="e.g., A, B, C"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentID">Student ID</Label>
                      <Input
                        id="studentID"
                        value={formData.studentID}
                        onChange={(e) =>
                          handleInputChange("studentID", e.target.value)
                        }
                        placeholder="e.g., 2024001"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserEdit;

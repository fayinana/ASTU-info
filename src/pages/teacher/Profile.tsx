
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileForm } from "@/components/user/ProfileForm";
import { useAuth } from "@/context/useAuth";
import { ProfileFormValues } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherProfile } from "@/api/teacher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeacherProfile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      if (!user?._id) throw new Error("User not found");
      return updateTeacherProfile(user._id, data);
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      // Update user in auth context if needed
      if (setUser && data.user) {
        setUser(data.user);
      }
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["teacher", user?._id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  const handleUpdateProfile = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  return (
    <AppLayout
      title="Profile"
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Profile" }
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            View and update your profile information
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Password & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal and professional details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user && (
                  <ProfileForm 
                    user={user} 
                    onSubmit={handleUpdateProfile} 
                    isSubmitting={isUpdating}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Password change functionality will be implemented here.</p>
                  <Button disabled>Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TeacherProfile;

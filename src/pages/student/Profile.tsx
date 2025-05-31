import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/user/ProfileForm";
import { UserProfileDetails } from "@/components/user/UserProfileDetails";
import useAppToast from "@/hooks/useAppToast";
import { useAuth } from "@/context/AuthContext";
import { ProfileFormValues } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileEdit, LogIn, Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUpdateProfile } from "@/hooks/useUsers";

// Password change form schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AdminProfile = () => {
  const { user } = useAuth();
  const { success } = useAppToast();
  const [activeTab, setActiveTab] = useState("profile");
  const { updateUserProfile, isLoading } = useUpdateProfile();
  // Password change form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = (data: ProfileFormValues) => {
    updateUserProfile({ id: user._id, data });
  };

  const handlePasswordChange = (data: PasswordFormValues) => {
    updateUserProfile({
      id: user._id,
      data: { password: data.newPassword },
    });
    passwordForm.reset();
    // In a real app, this would call an API to change the password
  };

  if (!user) return null;

  return (
    <AppLayout
      title="Profile"
      breadcrumbs={[
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Profile" },
      ]}
      allowedRoles={["student"]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-start">
          <div>
            <p className="text-muted-foreground ">
              View and manage your personal information and security settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Summary */}
          <div className="md:col-span-1 md:sticky top-6 self-start h-fit">
            <UserProfileDetails user={user} />
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <Card>
                <CardHeader>
                  <TabsList className="flex gap-4">
                    <TabsTrigger value="profile" className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1.5" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                      <Shield className="h-4 w-4 mr-1.5" />
                      Security
                    </TabsTrigger>
                    {/* <TabsTrigger value="activity" className="flex items-center">
                      <Activity className="h-4 w-4 mr-1.5" />
                      Activity
                    </TabsTrigger> */}
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="profile" className="mt-0 space-y-4">
                    <div className="space-y-0.5 pb-2">
                      <h3 className="font-medium text-lg">
                        Edit Profile Information
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Update your personal details and preferences.
                      </p>
                    </div>

                    {user && (
                      <ProfileForm
                        user={user}
                        isSubmitting={isLoading}
                        onSubmit={handleUpdateProfile}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="security" className="mt-0 space-y-6">
                    <div className="space-y-0.5 pb-2">
                      <h3 className="font-medium text-lg">Security Settings</h3>
                      <p className="text-muted-foreground text-sm">
                        Manage your password and account security options.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Change Password</h4>
                      <Form {...passwordForm}>
                        <form
                          onSubmit={passwordForm.handleSubmit(
                            handlePasswordChange
                          )}
                          className="space-y-4"
                        >
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit">Update Password</Button>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminProfile;

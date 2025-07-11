import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/form/FileUploader";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, User, Shield } from "lucide-react";
import { adminRegister } from "@/api/auth";
import useAppToast from "@/hooks/useAppToast";

export default function AddNewAdmin() {
  const [tab, setTab] = useState("manual");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { success, error } = useAppToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setProfileImage(files[0]);
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      error({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    const newAdminData = {
      name,
      email,
      password,
      title,
      role: "admin",
    };

    try {
      await adminRegister(newAdminData);
      success({
        title: "Admin Registered",
        description: `${name} has been added successfully.`,
      });

      // Optionally reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTitle("");
      setProfileImage(null);
      setPreviewUrl("");
    } catch (err: any) {
      console.error("Admin registration failed:", err);
      error({
        title: "Registration Failed",
        description:
          err?.message || "Something went wrong during registration.",
      });
    }
  };

  return (
    <AppLayout
      title="Add New Admin"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Add New Admin", href: "/admin/users/add-admin" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <CardTitle>Add New Administrator</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        {previewUrl ? (
                          <AvatarImage src={previewUrl} alt="Profile Preview" />
                        ) : (
                          <AvatarFallback className="bg-primary/10">
                            <User className="h-12 w-12 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="w-full">
                        <FileUploader
                          onFileSelect={handleFileSelect}
                          maxFiles={1}
                          maxSize={2}
                          accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                          className="w-full"
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          JPG, PNG. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@astu.edu.et"
                            className="pl-8"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Set a temporary password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          The user will be prompted to change this on first
                          login.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm_password"
                          type="password"
                          placeholder="Confirm temporary password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          placeholder="e.g. System Administrator"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Admin Permissions</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="perm_users" defaultChecked />
                        <div className="space-y-1">
                          <Label htmlFor="perm_users" className="font-medium">
                            User Management
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Can add, edit, and remove users from the system
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="perm_announcements" defaultChecked />
                        <div className="space-y-1">
                          <Label
                            htmlFor="perm_announcements"
                            className="font-medium"
                          >
                            Announcement Management
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Can create, edit, and delete announcements
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="perm_resources" defaultChecked />
                        <div className="space-y-1">
                          <Label
                            htmlFor="perm_resources"
                            className="font-medium"
                          >
                            Resource Management
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Can upload, edit, and delete resource materials
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="perm_settings" />
                        <div className="space-y-1">
                          <Label
                            htmlFor="perm_settings"
                            className="font-medium"
                          >
                            System Settings
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Can modify system settings and configurations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end space-x-4 mt-6 px-0">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Administrator</Button>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="bulk">
                <div className="space-y-6">
                  <div className="text-center p-6 border-2 border-dashed rounded-lg">
                    <div className="space-y-2">
                      <FileUploader
                        onFileSelect={() => {}}
                        maxFiles={1}
                        maxSize={5}
                        accept={{
                          "application/vnd.ms-excel": [".xlsx", ".xls", ".csv"],
                        }}
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Upload a CSV or Excel file with admin user details
                      </p>
                      <p className="text-xs text-muted-foreground">
                        File must contain columns: name, email, password,
                        permissions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Download Template</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a template file to ensure your data is formatted
                      correctly.
                    </p>
                    <Button variant="outline" size="sm">
                      Download Template
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

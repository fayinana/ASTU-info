import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/user/Avatar";
import { ProfileForm } from "@/components/user/ProfileForm";
import { UserProfileDetails } from "@/components/user/UserProfileDetails";
import { useToast } from "@/hooks/useAppToast";
import { useAuth } from "@/context/useAuth";
import { ProfileFormValues } from "@/lib/zodSchemas";
import {
  BadgeCheck,
  Calendar,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  PenSquare,
  Phone,
  School,
  User,
} from "lucide-react";
import { useState } from "react";

const StudentProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = (data: ProfileFormValues) => {
    console.log("Profile update:", data);
    // In a real app, this would call an API to update the profile
    toast("Profile updated successfully");
    setIsEditing(false);
  };

  if (!user) return null;

  // Education history (sample data)
  const education = [
    {
      id: 1,
      institution: "XYZ High School",
      degree: "High School Diploma",
      field: "Science",
      startYear: 2016,
      endYear: 2020,
      grade: "A",
    },
    {
      id: 2,
      institution: user.school || "ABC University",
      degree: "Bachelor of Science",
      field: user.department || "Computer Science",
      startYear: 2020,
      endYear: 2024,
      grade: "In Progress",
    },
  ];

  // Achievements (sample data)
  const achievements = [
    {
      id: 1,
      title: "Dean's List",
      description: "Recognized for academic excellence",
      date: "2023",
    },
    {
      id: 2,
      title: "Hackathon Winner",
      description: "First place in the university hackathon",
      date: "2022",
    },
    {
      id: 3,
      title: "Scholarship Recipient",
      description: "Merit-based scholarship for academic performance",
      date: "2021",
    },
  ];

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
        {/* Profile Header */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-r from-primary/30 to-primary/10 rounded-lg"></div>

          <div className="absolute -bottom-16 left-6 flex items-end z-50">
            <Avatar
              user={user}
              size="xl"
              className="border-4 border-background h-32 w-32"
            />
          </div>

          <div className="absolute bottom-4 right-6 flex space-x-2">
            <Button
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <PenSquare className="mr-1 h-4 w-4" />
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6 sticky top-6 self-start h-fit">
            <UserProfileDetails user={user} />

            {/* Skills Section */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-xl">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">JavaScript</Badge>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">React</Badge>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">Node.js</Badge>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">Python</Badge>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">UI/UX Design</Badge>
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">Data Analysis</Badge>
                </div>
              </CardContent>
            </Card>
             */}
            {/* Contact Information */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>+1 234 567 8900</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>123 Campus Drive, Education City</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {user.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Student at {user.school || "University"}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{user.department || "Department"}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">About Me</h3>
                    <p className="mt-2 text-muted-foreground">
                      {user.bio ||
                        "Passionate student interested in technology and innovation. Always eager to learn new things and take on challenging projects."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-1" /> Profile
                </TabsTrigger>
                <TabsTrigger value="security">
                  <User className="h-4 w-4 mr-1" /> Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="pt-6">
                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileForm user={user} onSubmit={handleUpdateProfile} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Information</CardTitle>
                      <CardDescription>Your academic details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Full Name
                          </h3>
                          <p className="mt-1">{user.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Username
                          </h3>
                          <p className="mt-1">{user.username}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Email
                          </h3>
                          <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Department
                          </h3>
                          <p className="mt-1">
                            {user.department || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            School/University
                          </h3>
                          <p className="mt-1">
                            {user.school || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Batch/Section
                          </h3>
                          <p className="mt-1">
                            {user.batch || "Not specified"}
                            {user.section && ` - ${user.section}`}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Joined
                          </h3>
                          <p className="mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Status
                          </h3>
                          <p className="mt-1">
                            <Badge
                              variant={user.isApproved ? "default" : "outline"}
                            >
                              {user.isApproved ? "Active" : "Pending"}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentProfile;

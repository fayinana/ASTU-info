import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import StudentPosts from "@/components/student/StudentPosts";
import StudentResources from "@/components/student/StudentResources";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick links for students
  const quickLinks = [
    {
      title: "Posts",
      description: "View all posts and announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/student/posts",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Resources",
      description: "Access learning materials",
      icon: <FileText className="h-5 w-5" />,
      href: "/student/resources",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Public Posts",
      description: "Create and participate in discussions",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/student/public-posts",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <AppLayout
      title="Student Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
      allowedRoles={["student"]}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            {user?.department ? `${user.department} • ` : ""}
            {user?.batch ? `Batch ${user.batch} • ` : ""}
            {user?.section ? `Section ${user.section}` : ""}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          {quickLinks.map((link) => (
            <Card
              key={link.title}
              className="border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(link.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${link.color}`}>
                    {link.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements & Posts Column */}
          <div className="space-y-6">
            <StudentPosts maxPosts={3} />
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <StudentResources maxResources={6} />

            {/* Upcoming Events Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming events</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    View calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

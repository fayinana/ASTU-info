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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            {user?.department ? `${user.department} • ` : ""}
            {user?.batch ? `Batch ${user.batch} • ` : ""}
            {user?.section ? `Section ${user.section}` : ""}
          </p>
        </div>

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
          <div className="space-y-6">
            <StudentPosts maxPosts={3} />
          </div>

          <div className="space-y-6 md:sticky top-6 self-start h-fit">
            <StudentResources maxResources={6} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

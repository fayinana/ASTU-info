import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "../user/Avatar";
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Users,
  UserPlus,
  FileText,
  Book,
  BookText,
  Settings,
  LogOut,
  Search,
  User,
  Shield,
  BarChart2,
  File,
  Edit,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Sidebar = () => {
  const { logout } = useLogout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const MenuItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ComponentType<any>;
    label: string;
  }) => {
    const isActive = location.pathname === href;

    return (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`justify-start w-full ${
          isActive ? "bg-primary/10 hover:bg-primary/20" : ""
        }`}
        onClick={() => navigate(href)}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    );
  };

  return (
    <div className="h-full flex flex-col border-r w-64">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            <div className="w-10 h-10 ">
              <img
                src="https://estudent.astu.edu.et/dist/img/astu_logo.svg"
                alt="logo"
              />
            </div>
            <h1 className="text-center">
              <span className="text-xl font-bold">ASTU</span>
              <span className="text-xl"> - Info</span>
            </h1>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        {isAdmin && (
          <div className="py-2">
            <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
              Admin
            </p>
            <div className="space-y-1">
              <MenuItem
                href="/admin/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <MenuItem
                href="/admin/announcements"
                icon={Bell}
                label="Announcements"
              />
              <MenuItem href="/admin/resources" icon={File} label="Resources" />
              <MenuItem
                href="/admin/users/teachers"
                icon={UserPlus}
                label="Teachers"
              />
              <MenuItem
                href="/admin/users/students"
                icon={Users}
                label="Students"
              />
              <MenuItem href="/admin/posts" icon={FileText} label="All Posts" />
              <MenuItem
                href="/admin/student-search"
                icon={Search}
                label="Student Search"
              />
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="py-2">
            <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
              Actions
            </p>
            <div className="space-y-1">
              <MenuItem
                href="/admin/posts/new"
                icon={Edit}
                label="Add New Post"
              />
              <MenuItem
                href="/admin/teachers/assign-responsibilities"
                icon={UserPlus}
                label="Assign Teacher Duties"
              />
              <MenuItem
                href="/admin/users/add-admin"
                icon={Plus}
                label="Add New Admin"
              />
            </div>
          </div>
        )}

        {isTeacher && (
          <div className="py-2">
            <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
              Teacher
            </p>
            <div className="space-y-1">
              <MenuItem
                href="/teacher/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <MenuItem
                href="/teacher/instructional-posts"
                icon={Book}
                label="Instructional Posts"
              />
              <MenuItem
                href="/teacher/resources"
                icon={File}
                label="Resources"
              />
              <MenuItem
                href="/teacher/public-posts"
                icon={FileText}
                label="Public Posts"
              />
              <MenuItem
                href="/teacher/students"
                icon={Users}
                label="Students"
              />
              <MenuItem
                href="/teacher/posts"
                icon={BookText}
                label="All Posts"
              />
            </div>
          </div>
        )}

        {isStudent && (
          <div className="py-2">
            <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
              Student
            </p>
            <div className="space-y-1">
              <MenuItem
                href="/student/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <MenuItem
                href="/student/resources"
                icon={File}
                label="Resources"
              />
              <MenuItem
                href="/student/public-posts"
                icon={FileText}
                label="Public Posts"
              />
              <MenuItem
                href="/student/posts"
                icon={BookText}
                label="All Posts"
              />
            </div>
          </div>
        )}

        <div className="py-2">
          <p className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
            General
          </p>
          <div className="space-y-1">
            <MenuItem href="/chat" icon={MessageSquare} label="Chat" />
            <MenuItem
              href={`/${user.role}/profile`}
              icon={User}
              label="Profile"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3"
            onClick={() => navigate(`/${user.role}/profile`)}
            style={{ cursor: "pointer" }}
          >
            <Avatar user={user} size="sm" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/${user.role}/profile`)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

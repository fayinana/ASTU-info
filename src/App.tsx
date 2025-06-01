import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, memo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/auth/Register";
import RegisterSuccess from "@/pages/auth/RegisterSuccess";
import Unauthorized from "@/pages/auth/Unauthorized";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleGuard from "@/components/auth/RoleGuard";

// // Admin pages
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminAnnouncements from "@/pages/admin/announcements/index";
import AdminAnnouncementView from "@/pages/admin/announcements/[id]";
import AdminAnnouncementNew from "@/pages/admin/announcements/new";
// import AdminPosts from "@/pages/admin/Posts";
import AdminPostView from "@/pages/admin/posts/[id]";
// import AdminAddPost from "@/pages/admin/posts/new"; // New import
// import AdminProfile from "@/pages/admin/Profile";
import AdminResources from "@/pages/admin/resource/Resources";
// import AdminSettings from "@/pages/admin/settings";
// import AdminStudents from "@/pages/admin/Students";
// import AdminStudentSearch from "@/pages/admin/StudentSearch";
// import TeacherResponsibilities from "@/pages/admin/TeacherResponsibilities";
import TeacherResponsibilitiesAssignment from "@/pages/admin/teacher/assign-responsibilities"; // New import
// import AdminTeachers from "@/pages/admin/Teachers";
import AddNewAdmin from "@/pages/admin/users/add-admin"; // New import
import UploadReacourse from "@/pages/admin/resource/UploadReacourse";
// import AdminUserView from "@/pages/admin/users/[id]";

// // Teacher pages
// import TeacherDashboard from "@/pages/teacher/Dashboard";
// import TeacherCreateInstructional from "@/pages/teacher/instructional-posts/Create";
// import TeacherInstructionalPosts from "@/pages/teacher/InstructionalPosts";
// import TeacherPosts from "@/pages/teacher/Posts";
// import TeacherProfile from "@/pages/teacher/Profile";
// import TeacherCreatePublic from "@/pages/teacher/public-posts/create";
// import TeacherPublicPosts from "@/pages/teacher/PublicPosts";
// import TeacherResources from "@/pages/teacher/Resources";
// import TeacherStudents from "@/pages/teacher/Students";

// // Student pages
// import StudentDashboard from "@/pages/student/Dashboard";
import StudentPosts from "@/pages/student/Posts";
import StudentProfile from "@/pages/student/Profile";
import StudentCreatePublic from "@/pages/student/public-posts/Create";
import StudentPublicPosts from "@/pages/student/PublicPosts";
// import StudentResources from "@/pages/student/Resources";
import Resources from "@/pages/student/Resources";

// // Chat
// import Chat from "@/pages/chat/Chat";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import AdminTeachers from "./pages/admin/teacher/Teachers";
import AdminStudentSearch from "./pages/admin/students/StudentSearch";
import AdminStudents from "./pages/admin/students/Students";

import AdminAddPost from "./pages/admin/posts/new";
import AdminPosts from "./pages/admin/posts/Posts";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherPosts from "./pages/teacher/Posts";
import TeacherInstructionalPosts from "./pages/teacher/InstructionalPosts";
import TeacherPublicPosts from "./pages/teacher/PublicPosts";
import TeacherResources from "./pages/teacher/Resources";
import UploadResource from "./pages/teacher/UploadReacourse";
import TeacherStudents from "./pages/teacher/Students";
import TeacherCreatePost from "./pages/teacher/public-posts/create";
import StudentDashboard from "./pages/student/Dashboard";
import AdminProfile from "./pages/admin/profile/Profile";
import TeacherProfile from "./pages/teacher/Profile";
// import StudentResources from "./components/student/StudentResources";
// import StudentPosts from "./components/student/StudentPosts";
// import { AuthProvider } from "./context/useAuth";

// Create a memoized Routes component to prevent unnecessary rerenders
const AppRoutes = memo(() => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/register-success" element={<RegisterSuccess />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Admin Routes */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    {/* Update the route to the new dashboard page */}
    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

    <Route
      path="/admin/posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/posts/:id"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminPostView />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    {/* New route for add post page */}
    <Route
      path="/admin/posts/new"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminAddPost />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/announcements"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminAnnouncements />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/announcements/:id"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminAnnouncementView />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/announcements/new"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminAnnouncementNew />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users/students"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminStudents />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users/teachers"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminTeachers />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    {/* New route for adding new admin */}
    <Route
      path="/admin/users/add-admin"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AddNewAdmin />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    {/* <Route
      path="/admin/users/:id"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminUserView />
          </RoleGuard>
        </ProtectedRoute>
      }
    /> */}
    <Route
      path="/admin/student-search"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminStudentSearch />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/teachers/assign-responsibilities"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <TeacherResponsibilitiesAssignment />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/resources"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminResources />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/profile"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminProfile />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/upload-resource"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <UploadReacourse />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    {/* Teacher Routes */}
    <Route
      path="/teacher/dashboard"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/instructional-posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherInstructionalPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/public-posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherPublicPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/resources"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherResources />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/upload-resource"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <UploadResource />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/students"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherStudents />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/profile"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherProfile />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher/posts/new"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["teacher"]}>
            <TeacherCreatePost />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    {/* Student Routes */}
    <Route
      path="/student/dashboard"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <StudentDashboard />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <StudentPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/public-posts"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <StudentPublicPosts />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/resources"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <Resources />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/profile"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <StudentProfile />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/student/public-posts/new"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["student"]}>
            <StudentCreatePublic />
          </RoleGuard>
        </ProtectedRoute>
      }
    />

    {/* Chat Route */}
    {/* <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    /> */}

    <Route path="*" element={<NotFound />} />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minutes
      refetchOnWindowFocus: false, // Prevent refetching on window focus which can cause rerenders
      retry: 2,
    },
  },
});

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ReactQueryDevtools />
            <Toaster richColors />
            <AppRoutes />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

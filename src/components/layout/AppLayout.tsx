import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { Breadcrumb } from "./Breadcrumb";
// import { adaptApiUserToAppUser } from "@/lib/typeAdapters";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  requireAuth?: boolean;
  allowedRoles?: string[];
}

// Use memo to prevent unnecessary rerenders
const AppLayoutContent = memo(
  ({
    children,
    title,
    breadcrumbs,
    user,
    isMobileNavOpen,
    setIsMobileNavOpen,
  }: {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
    user: any;
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
  }) => (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        user={user}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          onMenuClick={() => setIsMobileNavOpen(true)}
          title={title}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}

          <div>{children}</div>
        </main>
      </div>
    </div>
  )
);

AppLayoutContent.displayName = "AppLayoutContent";

export const AppLayout = ({
  children,
  title,
  breadcrumbs,
  requireAuth = true,
  allowedRoles,
}: AppLayoutProps) => {
  const { user, isLoading, isAuthenticated, checkRole } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  // Convert user to the expected format if needed
  // const user = authUser ? (authUser._id ? authUser : adaptApiUserToAppUser(authUser)) : null;

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate("/login", { replace: true });
    }

    if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      !checkRole(allowedRoles)
    ) {
      navigate("/unauthorized", { replace: true });
    }
  }, [
    isLoading,
    isAuthenticated,
    requireAuth,
    allowedRoles,
    navigate,
    checkRole,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we set things up
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  if (allowedRoles && user && !checkRole(allowedRoles)) {
    return null; // Will redirect to unauthorized
  }

  return (
    <AppLayoutContent
      title={title}
      breadcrumbs={breadcrumbs}
      user={user}
      isMobileNavOpen={isMobileNavOpen}
      setIsMobileNavOpen={setIsMobileNavOpen}
    >
      {children}
    </AppLayoutContent>
  );
};

export default AppLayout;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, MessageSquare, Filter } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const TeacherPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "announcement" | "instructional" | "public" | "all"
  >("all");
  const [search, setSearchQuery] = useState("");

  // Setup filters based on active tab
  const filters: Record<string, any> = {};
  if (activeTab !== "all") {
    filters.type = activeTab;
  }

  // Use the posts hook with filters
  const { posts, isLoading, pagination } = usePosts({
    type: activeTab === "all" ? undefined : activeTab,
    search,
  });

  // Define columns for the data table
  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row: any) => (
        <div>
          <p className="font-medium">{row.title || "Untitled"}</p>
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {(row.content || "").slice(0, 60)}...
          </p>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: any) => (
        <StatusBadge
          status={
            row.type === "announcement"
              ? "info"
              : row.type === "instructional"
              ? "success"
              : "secondary"
          }
          text={row.type}
        />
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: any) => format(new Date(row.createdAt), "MMM dd, yyyy"),
    },
    {
      header: "Engagement",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {(row.like || []).length}
            </span>
            <span className="mx-1">likes</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-sm">{(row.comments || []).length}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="All Posts"
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "All Posts" },
      ]}
      allowedRoles={["student"]}
    >
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Posts</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your posts including instructional content and
              public discussions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/teacher/public-posts/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Public
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Your Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="instructional">Instructional</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search posts..."
                    className="max-w-xs"
                    value={search}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      console.log(e.target.value || null);
                    }}
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  columns={columns}
                  data={posts}
                  isLoading={isLoading}
                  searchable={false} // We're handling search manually
                  onView={(row) => navigate(`/teacher/posts/${row._id}`)}
                  pagination={{
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: (page) => console.log(page),
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TeacherPosts;

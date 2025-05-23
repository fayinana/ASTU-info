import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useResources,
  useUploadResource as useCreateResource,
} from "@/hooks/useResources";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { format as dateFormat } from "date-fns";
import ResourceTypeIcon from "@/components/resource/ResourceTypeIcon";
import ResourceUploadDialog from "@/components/resource/ResourceUploadDialog";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/tables/DataTable";

const TeacherResources = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  // Memoize initialFilters to prevent unnecessary re-renders
  const initialFilters = useMemo(
    () => ({
      department: user?.department,
      ...(activeTab !== "all" ? { type: activeTab } : {}),
    }),
    [user?.department, activeTab]
  );

  // Get resources with department filter
  const { resources, isLoading, pagination } = useResources({
    initialFilters,
  });

  // const { : uploadResource, isLoading: isUploading } =
  //   useCreateResource();

  // const handleUpload = useCallback((data: { file: File; data: any }) => {
  //   uploadResource(data, {
  //     onSuccess: () => {
  //       setOpenUploadDialog(false);
  //     },
  //   });
  // }, [uploadResource]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: (row: any) => (
          <div className="flex items-center gap-2">
            <ResourceTypeIcon type={row.type} />
            <span>{row.title}</span>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Year",
        accessorKey: "year",
        cell: (row: any) => <span>{row.year || "All Years"}</span>,
      },
      {
        header: "Uploaded On",
        accessorKey: "createdAt",
        cell: (row: any) => dateFormat(new Date(row.createdAt), "MMM dd, yyyy"),
      },
    ],
    []
  );

  return (
    <AppLayout
      title="Resources"
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Resources" },
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Resources</h1>
            <p className="text-muted-foreground">
              Share educational resources with your students
            </p>
          </div>
          <Button onClick={() => setOpenUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Resource
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Department Resources</CardTitle>
            <CardDescription>
              View and manage resources for{" "}
              {user?.department || "your department"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="link">Links</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  value="resource"
                  columns={columns}
                  data={resources}
                  isLoading={isLoading}
                  onView={(resource) => window.open(resource.url, "_blank")}
                  searchable
                  searchPlaceholder="Search resources..."
                  onSearch={(query) => setSearch(query || null)}
                  pagination={{
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: (page) => setPagination(page),
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ResourceUploadDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        onSubmit={handleUpload}
        isSubmitting={isUploading}
      />
    </AppLayout>
  );
};

export default TeacherResources;

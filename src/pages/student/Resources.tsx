import { Resource } from "@/types/resource";
import { AppLayout } from "@/components/layout/AppLayout";
import { Column, DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteResource, useResources } from "@/hooks/useResources";
import { format } from "date-fns";
import { File as FileIcon, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterState, useResourceFilters } from "@/hooks/useResourceFilters";
import ApiQuerySender from "@/lib/apiQuery";

const TeacherResources = () => {
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use resource filters
  const { filters, pagination, updateFilters, updatePagination, getQuery } =
    useResourceFilters();

  // Get resources with filtering
  const { resources, isLoading, error, refetch } = useResources(getQuery());

  const { deleteResource, isLoading: isDeleting } = useDeleteResource();

  // Update pagination from API response
  useEffect(() => {
    if (resources && resources.length > 0) {
      updatePagination({
        total: pagination.total || resources.length,
        totalPages:
          pagination.totalPages ||
          Math.ceil((pagination.total || resources.length) / filters.limit),
      });
    }
  }, [
    resources,
    pagination.total,
    pagination.totalPages,
    filters.limit,
    updatePagination,
  ]);

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    deleteResource(selectedResource._id);
    setIsDeleteDialogOpen(false);
    setSelectedResource(null);
  };

  const getResourceTypeIcon = (type: "resource" | "exitExam") => {
    switch (type) {
      case "exitExam":
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case "resource":
        return <FileIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  const columns: Column<Resource>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row: Resource) => (
        <div className="flex items-center gap-2">
          {getResourceTypeIcon(row.type)}
          <span className="truncate max-w-xs">{row.title}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: Resource) => <span className="capitalize">{row.type}</span>,
    },
    {
      header: "School",
      accessorKey: "school",
      cell: (row: Resource) => <span>{row.school || "N/A"}</span>,
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: (row: Resource) => (
        <span>{row.department || "All Departments"}</span>
      ),
    },
    {
      header: "Year",
      accessorKey: "year",
      cell: (row: Resource) => <span>{row.year || "N/A"}</span>,
    },
    {
      header: "Uploaded On",
      accessorKey: "createdAt",
      cell: (row: Resource) => format(new Date(row.createdAt), "MM/dd/yyyy"),
    },
    {
      header: "Files",
      accessorKey: "files",
      cell: (row: Resource) => (
        <span>
          {row.files.length} {row.files.length === 1 ? "file" : "files"}
        </span>
      ),
    },
  ];

  // Filters for DataTable
  const filtersConfig = [
    {
      name: "type",
      label: "Type",
      options: [
        { label: "All", value: "" },
        { label: "Exit Exam", value: "exitExam" },
        { label: "Resource", value: "resource" },
      ],
      selectedValue: filters.type,
    },
  ];

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    updateFilters(newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  return (
    <AppLayout
      title="Resources"
      breadcrumbs={[
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Resources" },
      ]}
      allowedRoles={["student"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Resources</h1>
            <p className="text-muted-foreground">View and use resources</p>
          </div>
        </div>

        {error && (
          <Card className="border-red-500">
            <CardContent className="pt-6">
              <p className="text-red-500">Error: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Browse Resources</CardTitle>
            <CardDescription>
              View, filter, and manage all resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange({ type: value === "all" ? "" : value })
              }
            >
              <TabsList className="mb-4 flex flex-wrap h-auto justify-start">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="exitExam">Exit Exams</TabsTrigger>
                <TabsTrigger value="resource">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value={filters.type || "all"} className="mt-0">
                <DataTable
                  value="resource"
                  columns={columns}
                  data={resources}
                  isLoading={isLoading}
                  onRowClick={(resource) =>
                    navigate(`/teacher/resource/${resource._id}`)
                  }
                  onView={(resource) =>
                    navigate(`/teacher/resource/${resource._id}`)
                  }
                  onDelete={handleDelete}
                  searchable
                  searchPlaceholder="Search resources by title or description..."
                  defaultSearchValue={filters.search}
                  pagination={{
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages || 1,
                    onPageChange: handlePageChange,
                  }}
                  filters={filtersConfig}
                  querySender={new ApiQuerySender()}
                  onFilter={(field, value) =>
                    handleFilterChange({ [field]: value })
                  }
                  onClear={() => handleFilterChange({ search: "", type: "" })}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the resource "
                {selectedResource?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default TeacherResources;

import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
// import { useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types/post";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  FilterState,
  useAnnouncementFilters,
} from "@/hooks/useAnnouncementFilters";
import { useEffect } from "react";
import ApiQuerySender from "@/lib/apiQuery";

const AdminAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // const { isDeleteing, deleteAnnouncment } = useDeleteAnnouncement();

  // Use announcement filters
  const { filters, pagination, updateFilters, updatePagination, getQuery } =
    useAnnouncementFilters();

  // Fetch posts with query from filters
  const { posts: announcements, isLoading, refetch } = usePosts(getQuery());

  // Update pagination from API response
  useEffect(() => {
    if (pagination.total !== 0 && pagination.totalPages !== 0) {
      updatePagination({
        total: pagination.total,
        totalPages: pagination.totalPages,
      });
    }
  }, [pagination.total, pagination.totalPages, updatePagination]);

  // Columns for DataTable
  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      className: "font-medium",
    },
    {
      header: "Author",
      accessorKey: "author.name",
      cell: (row: Post) => <p>{row.author.name}</p>,
    },
    {
      header: "Content",
      accessorKey: "content",
      cell: (row: Post) => <p>{row.content?.substring(0, 15)}...</p>,
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: Post) => <StatusBadge status={row.type} />,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: Post) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  // Filters for DataTable
  const filtersConfig = [
    {
      name: "role",
      label: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Editor", value: "editor" },
      ],
      selectedValue: filters.role,
    },
  ];

  // Handle delete action
  const handleDelete = (id: string) => {
    // deleteAnnouncment(id);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    updateFilters(newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  return (
    <LoadingOverlay isLoading={false} message="Deleting Announcement...">
      <AppLayout
        title="Announcements"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Announcements" },
        ]}
        allowedRoles={["admin"]}
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-muted-foreground">
                Manage system announcements
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/announcements/new")}
              className="sm:w-auto w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> New Announcement
            </Button>
          </div>

          <DataTable
            value="Announcement"
            columns={columns}
            data={announcements}
            isLoading={isLoading}
            onView={(row) => navigate(`/admin/announcements/${row._id}`)}
            onDelete={(row) => handleDelete(row._id)}
            hideDelete={(row) => row.author._id !== user?._id}
            searchable
            searchPlaceholder="Search announcements..."
            defaultSearchValue={filters.search}
            pagination={{
              currentPage: pagination.page,
              totalPages: pagination.totalPages || 1,
              onPageChange: handlePageChange,
            }}
            filters={filtersConfig}
            querySender={new ApiQuerySender()}
            onFilter={(field, value) => handleFilterChange({ [field]: value })}
            onClear={() => handleFilterChange({ search: "", role: "" })}
          />
        </div>
      </AppLayout>
    </LoadingOverlay>
  );
};

export default AdminAnnouncementsPage;

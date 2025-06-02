import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/user/Avatar";
import { RoleBadge } from "@/components/user/RoleBadge";
import StatusBadge from "@/components/tables/StatusBadge";
import useAppToast from "@/hooks/useAppToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useApproveUser } from "@/hooks/useAuth";
import type { User } from "@/types/user";

const AdminTeachers = () => {
  const { success } = useAppToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { user } = useAuth();

  const initialFilters = useMemo(
    () => ({
      department: user?.department || undefined,
      role: "teacher" as const,
    }),
    [user?.department]
  );

  const { users: teachers, pagination, isLoading } = useUsers(initialFilters);

  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    teachers.forEach((teacher) => {
      teacher.secAssigned?.forEach((assignment) => {
        if (assignment?.department) {
          deptSet.add(assignment.department);
        }
      });
    });
    return Array.from(deptSet).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((teacher): teacher is User => !!teacher?.role)
      .filter((teacher) => {
        const matchesStatus =
          statusFilter === "all" ||
          teacher.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesDepartment =
          departmentFilter === "all" ||
          teacher.secAssigned.some(
            (a) =>
              a.department?.toLowerCase() === departmentFilter.toLowerCase()
          );
        return matchesStatus && matchesDepartment;
      });
  }, [teachers, statusFilter, departmentFilter]);

  const tableData = useMemo(
    () => filteredTeachers.map((teacher) => ({ row: { row: teacher } })),
    [filteredTeachers]
  );

  const { approve, isLoading: isApproving } = useApproveUser();

  const handleApprove = (user: User) => {
    const newStatus =
      user.status === "approved"
        ? "suspend"
        : user.status === "suspended" || user.status === "rejected"
        ? "approve"
        : "approve";

    approve({ id: user._id, userStatus: newStatus });
  };

  const handleDelete = (teacher: User) => {
    success({
      title: "Teacher Removed",
      description: `${teacher?.name || "Unknown"} has been removed.`,
    });
    // TODO: API call to delete teacher
  };

  const columns = [
    {
      header: "Teacher",
      accessorKey: "name",
      cell: ({ row }: { row: { row: User } }) => (
        <div className="flex items-center gap-2">
          <Avatar user={row.row} size="sm" />
          <div>
            <div className="font-medium">{row.row.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: ({ row }: { row: { row: User } }) =>
        row.row.secAssigned
          ?.map((a) => a.department)
          .filter(Boolean)
          .join(", ") || "N/A",
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: ({ row }: { row: { row: User } }) =>
        row.row.secAssigned
          ?.map((a) => a.subject)
          .filter(Boolean)
          .join(", ") || "N/A",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }: { row: { row: User } }) => (
        <RoleBadge role={row.row.role} />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { row: User } }) => (
        <StatusBadge status={row.row.status || "pending"} />
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { row: User } }) =>
        new Date(row.row.createdAt).toLocaleDateString(),
    },
  ];

  const additionalActions = [
    {
      label: ({ row }: { row: { row: User } }) =>
        row.row.status === "approved" ? "Suspend" : "Approve",
      onClick: ({ row }: { row: { row: User } }) => handleApprove(row.row),
      variant: "default" as const,
      className: ({ row }: { row: { row: User } }) =>
        row.row.status === "approved"
          ? "bg-red-600 hover:bg-red-700"
          : "bg-green-600 hover:bg-green-700",
      condition: ({ row }: { row: { row: User } }) => true,
    },
  ];
  

  return (
    <AppLayout
      title="Teachers"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Teachers" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-muted-foreground">
            Approve, view, and manage teacher accounts.
          </p>
          <Button asChild>
            <Link to="/admin/teachers/assign-responsibilities">
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Responsibility
            </Link>
          </Button>
        </div>

        <div className="bg-muted/40 p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Department
              </label>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase()}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={tableData}
          value={[]}
          querySender={() => {}}
          onView={({ row }) => console.log("View", row.row._id)}
          onEdit={({ row }) => console.log("Edit", row.row._id)}
          onDelete={({ row }) => handleDelete(row.row)}
          additionalActions={additionalActions}
          searchable
          searchPlaceholder="Search teachers..."
          isLoading={isLoading}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            onPageChange: (page: number) => {
              console.log("Change to page:", page);
              // Update pagination here if needed
            },
          }}
        />
      </div>
    </AppLayout>
  );
};

export default AdminTeachers;

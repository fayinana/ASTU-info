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

import type { User } from "@/types/user";
const AdminTeachers = () => {
  const { success } = useAppToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const { user } = useAuth();

  const initialFilters = useMemo(
    () => ({
      department: user?.department || undefined,
      role: "teacher" as const,
    }),
    [user?.department]
  );

  // Fetch teachers using the useUsers hook
  const { users: teachers, pagination, isLoading } = useUsers(initialFilters);

  // Extract unique departments from secAssigned
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    teachers.forEach((teacher) => {
      if (teacher?.secAssigned) {
        teacher.secAssigned.forEach((assignment) => {
          if (assignment?.department) {
            deptSet.add(assignment.department);
          }
        });
      }
    });
    return Array.from(deptSet).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((teacher): teacher is User => {
        return (
          teacher != null &&
          typeof teacher === "object" &&
          "role" in teacher &&
          "status" in teacher &&
          "secAssigned" in teacher &&
          Array.isArray(teacher.secAssigned)
        );
      })
      .filter((teacher) => {
        const matchesStatus =
          statusFilter === "all" ||
          (teacher.status &&
            teacher.status.toLowerCase() === statusFilter.toLowerCase());
        const matchesDepartment =
          departmentFilter === "all" ||
          teacher.secAssigned.some(
            (assignment) =>
              assignment.department?.toLowerCase() ===
              departmentFilter.toLowerCase()
          );
        return matchesStatus && matchesDepartment;
      });
  }, [teachers, statusFilter, departmentFilter]);

  // Transform filteredTeachers to match DataTable's expected { row: { row: User } }[] type
  const tableData = useMemo(
    () => filteredTeachers.map((teacher) => ({ row: { row: teacher } })),
    [filteredTeachers]
  );

  const handleApprove = (teacher: User) => {
    success({
      title: "Teacher Approved",
      description: `${
        teacher?.name || "Unknown"
      } has been approved successfully.`,
    });
    // TODO: Call API to update teacher status
  };

  const handleDelete = (teacher: User) => {
    success({
      title: "Teacher Removed",
      description: `${
        teacher?.name || "Unknown"
      } has been removed successfully.`,
    });
    // TODO: Call API to delete teacher
  };

  const columns = [
    {
      header: "Teacher",
      accessorKey: "name",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.name || !row.row.email) {
          return <div className="text-muted-foreground">N/A</div>;
        }
        return (
          <div className="flex items-center gap-2">
            <Avatar user={row.row} size="sm" />
            <div>
              <div className="font-medium">{row.row.name}</div>
              <div className="text-sm text-muted-foreground">
                {row.row.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.secAssigned) return <span>N/A</span>;
        const dept = row.row.secAssigned
          .map((assignment) => assignment.department)
          .filter(Boolean)
          .join(", ");
        return <span>{dept || "N/A"}</span>;
      },
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.secAssigned) return <span>N/A</span>;
        const subjects = row.row.secAssigned
          .map((assignment) => assignment.subject)
          .filter(Boolean)
          .join(", ");
        return <span>{subjects || "N/A"}</span>;
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.role) return <span>N/A</span>;
        return <RoleBadge role={row.row.role} />;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.status)
          return <StatusBadge status="pending" />;
        return <StatusBadge status={row.row.status} />;
      },
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { row: User } | undefined }) => {
        if (!row || !row.row || !row.row.createdAt) return <span>N/A</span>;
        return new Date(row.row.createdAt).toLocaleDateString();
      },
    },
  ];

  const additionalActions = [
    {
      label: "Approve",
      onClick: ({ row }: { row: { row: User } }) => handleApprove(row.row),
      variant: "default" as const,
      className: "bg-green-600 hover:bg-green-700",
      condition: ({ row }: { row: { row: User } }) =>
        row.row.status === "pending",
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Approve, view, and manage teacher accounts.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/teachers/assign-responsibilities">
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Responsiblity
            </Link>
          </Button>
        </div>

        {/* Filters */}
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
          data={tableData} // Use transformed data
          value={[]}
          querySender={() => {}} // Provide a no-op function or your actual query sender
          onView={({ row }: { row: { row: User } }) =>
            console.log("View teacher:", row.row._id)
          }
          onEdit={({ row }: { row: { row: User } }) =>
            console.log("Edit teacher:", row.row._id)
          }
          onDelete={({ row }: { row: { row: User } }) => handleDelete(row.row)}
          additionalActions={additionalActions}
          searchable
          searchPlaceholder="Search teachers..."
          isLoading={isLoading}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            onPageChange: (page: number) => {
              console.log("Change to page:", page);
            },
          }}
        />
      </div>
    </AppLayout>
  );
};

export default AdminTeachers;

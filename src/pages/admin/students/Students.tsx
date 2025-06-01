import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/user/Avatar";
import useAppToast from "@/hooks/useAppToast";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";
import { Book, Filter, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const { success } = useAppToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const navigate = useNavigate();
  // Get students from mock data
  const {
    users: students,
    pagination,
    isLoading,
  } = useUsers({
    role: "student" as const,
  });
  // Apply filters
  const filteredStudents = students.filter((student) => {
    if (statusFilter !== "all") {
      if (statusFilter === "approved" && student.status !== "approved")
        return false;
      if (statusFilter === "pending" && student.status === "approved")
        return false;
    }
    if (departmentFilter !== "all" && student.department !== departmentFilter)
      return false;
    if (schoolFilter !== "all" && student.school !== schoolFilter) return false;
    return true;
  });

  // Get unique departments and schools for filters
  const departments = [
    ...new Set(students.map((student) => student.department)),
  ].filter(Boolean) as string[];
  const schools = [
    ...new Set(students.map((student) => student.school)),
  ].filter(Boolean) as string[];

  // Count approved and pending students
  const approvedCount = students.filter((s) => s.status === "approved").length;
  const pendingCount = students.filter((s) => s.status === "pending").length;

  const handleApprove = (user: User) => {
    success({
      title: "Student Approved",
      description: `${user.name} has been approved successfully.`,
    });
  };

  const handleDelete = (user: User) => {
    success({
      title: "Student Removed",
      description: `${user.name} has been removed successfully.`,
    });
  };
  const handleView = (user: User) => {
    navigate(`/admin/users/students/${user._id}`);
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/users/students/${user._id}/edit`);
  };
  const columns = [
    {
      header: "Student",
      accessorKey: "name",
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <Avatar user={row} size="sm" />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: (row: User) => row.department,
    },
    {
      header: "Batch/Section",
      accessorKey: "batch",
      cell: (row: User) => (
        <div>
          {row.batch} {row.section && `- ${row.section}`}
        </div>
      ),
    },
    {
      header: "School",
      accessorKey: "school",
      cell: (row: User) => row.school,
    },
    {
      header: "Status",
      accessorKey: "isApproved",
      cell: (row: User) => <StatusBadge status={row.status} />,
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (row: User) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const additionalActions = [
    {
      label: "Approve",
      onClick: (row: User) => handleApprove(row),
      variant: "default" as const,
      className: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <AppLayout
      title="Students"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Students" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Approve, view, and manage student accounts.
            </p>
          </div>
          <div></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl">{students.length}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                Across all departments and schools
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {approvedCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                Active student accounts
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Approval</CardDescription>
              <CardTitle className="text-3xl text-amber-500">
                {pendingCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                Awaiting review
              </div>
            </CardContent>
          </Card>
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
                  <SelectItem value="pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <Book className="h-3.5 w-3.5" /> Department
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
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> School
              </label>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
{/* student table */}
        <DataTable
          columns={columns}
          data={filteredStudents}
          onView={(row: User) => handleView(row)}
          onEdit={(row: User) => handleEdit(row)}
          onDelete={(row) => handleDelete(row)}
          additionalActions={
            !statusFilter || statusFilter === "pending"
              ? filteredStudents.filter((s) => s.status === "pending").length
                ? additionalActions
                : undefined
              : undefined
          }
          searchable
          searchPlaceholder="Search students..."
          value={""}
          querySender={() => {}}
        />
      </div>
    </AppLayout>
  );
};

export default AdminStudents;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { StudentsPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { Search } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";

const TeacherStudents = () => {
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { users, isLoading, pagination, error, refetch } = useUsers({
    role: "student",
    section: user.secAssigned.map((sec) => sec.section),
    department: user.secAssigned.map((sec) => sec.department),
  });

  const columns = [
    {
      header: "Student Name",
      accessorKey: "name",
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Batch",
      accessorKey: "batch",
    },
    {
      header: "Section",
      accessorKey: "section",
    },
    {
      header: "Department",
      accessorKey: "department",
    },
    {
      accessorKey: "_id",
      header: "Actions",
      cell: (row: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`/student/${row._id}`, "_blank")}
        >
          View Details
        </Button>
      ),
    },
  ];
  if (isLoading)
    return (
      <AppLayout>
        <StudentsPageSkeleton />
      </AppLayout>
    );

  return (
    // <LoadingOverlay isLoading={isLoading} message="Loading students...">
    <AppLayout
      title="Students"
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Students" },
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your students by section
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <p className="text-3xl font-bold">{users?.length || 0}</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                In your assigned sections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Sections
              </CardTitle>
              <p className="text-3xl font-bold">
                {user.secAssigned.length || 0}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Currently assigned to you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Department
              </CardTitle>
              <p className="text-3xl font-bold">
                {user.secAssigned.length || 0}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Departments you teach in
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-muted/40">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">Department</p>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {user.secAssigned?.map((sec) => (
                      <SelectItem key={sec.department} value={sec.department}>
                        {sec.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">Depatment</p>
                <Select value={batch} onValueChange={setBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  {/* <SelectContent> 
                  <SelectItem value="">All Batches</SelectItem>
                    {user.secAssigned.map((b) => (
                      <SelectItem key={b} value={b.}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent> 
                </Select>
              </div> */}

              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">Section</p>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {user.secAssigned.map((s) => (
                      <SelectItem key={s.section} value={s.section}>
                        {s.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => {
                    setDepartment("");
                    setBatch("");
                    setSection("");
                    setSearch("");
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  className="ml-2"
                  onClick={() => refetch()}
                >
                  Apply
                </Button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={users || []}
              value={search}
              querySender={refetch}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
    // </LoadingOverlay>
  );
};

export default TeacherStudents;

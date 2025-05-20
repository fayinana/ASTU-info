import { format } from "date-fns";
import { SelectField } from "@/components/form/SelectField";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCard } from "@/components/user/UserCard";
import useAppToast from "@/hooks/useAppToast";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Check,
  GraduationCap,
  Search,
  Users as UsersIcon,
  UserX2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUsers } from "@/hooks/useUsers";

// Define the search form schema with Zod
const searchFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  department: z.string().optional(),
  school: z.string().optional(),
  batch: z.string().optional(),
  section: z.string().optional(),
  isApproved: z.enum(["all", "approved", "pending"]).default("all"),
  joinedAfter: z.date().optional(),
  joinedBefore: z.date().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const AdminStudentSearch = () => {
  const { success } = useAppToast();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchMode, setSearchMode] = useState<"basic" | "advanced">("basic");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filter mock users to only include students
         const { users: students, pagination, isLoading } = useUsers({
      role: "student" as const,
    });
       
  // Get unique values for filters
  const departments = [
    ...new Set(students.map((student) => student.department)),
  ].filter(Boolean) as string[];
  const schools = [
    ...new Set(students.map((student) => student.school)),
  ].filter(Boolean) as string[];
  const batches = [...new Set(students.map((student) => student.batch))].filter(
    Boolean
  ) as string[];
  const sections = [
    ...new Set(students.map((student) => student.section)),
  ].filter(Boolean) as string[];

  // Setup form with default values
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      school: "",
      batch: "",
      section: "",
      isApproved: "all",
    },
  });

  // Filtered students state
  const [filteredStudents, setFilteredStudents] = useState<User[]>(students);

  // Handle search form submission
  const onSubmit = (data: SearchFormValues) => {
    console.log("Search data:", data);

    // Filter students based on search criteria
    const filtered = students.filter((student) => {
      // Filter by name
      if (
        data.name &&
        !student.name.toLowerCase().includes(data.name.toLowerCase())
      ) {
        return false;
      }

      // Filter by email
      if (
        data.email &&
        !student.email.toLowerCase().includes(data.email.toLowerCase())
      ) {
        return false;
      }

      // Filter by department
      if (data.department && student.department !== data.department) {
        return false;
      }

      // Filter by school
      if (data.school && student.school !== data.school) {
        return false;
      }

      // Filter by batch
      if (data.batch && student.batch !== data.batch) {
        return false;
      }

      if (data.isApproved === "approved" && student.status !== "approved") {
        return false;
      }

      if (data.isApproved === "pending" && student.status !== "pending") {
        return false;
      }


      // Filter by section
      if (data.section && student.section !== data.section) {
        return false;
      }
      // Filter by join date range
      if (data.joinedAfter && new Date(student.createdAt) < data.joinedAfter) {
        return false;
      }

      if (
        data.joinedBefore &&
        new Date(student.createdAt) > data.joinedBefore
      ) {
        return false;
      }

      return true;
    });

    setFilteredStudents(filtered);
  
  };

  // Reset search filters
  const resetSearch = () => {
    form.reset();
    setFilteredStudents(students);
  };

  // Handle viewing student details
  const handleViewStudent = (student: User) => {
    setSelectedStudent(student);
  };

  // Handle approving a student
  const handleApprove = (student: User) => {
    success({
      title: "Student Approved",
      description: `${student.name} has been approved successfully.`,
    });
  };

  // Prepare department options for SelectField
  const departmentOptions = [
    { value: "none", label: "Any Department" },
    ...departments.map((dept) => ({ value: dept, label: dept })),
  ];

  // Prepare school options for SelectField
  const schoolOptions = [
    { value: "none", label: "Any School" },
    ...schools.map((school) => ({ value: school, label: school })),
  ];

  // Prepare batch options for SelectField
  const batchOptions = [
    { value: "none", label: "Any Batch" },
    ...batches.map((batch) => ({ value: batch, label: batch })),
  ];

  // Prepare section options for SelectField
  const sectionOptions = [
    { value: "none", label: "Any Section" },
    ...sections.map((section) => ({ value: section, label: section })),
  ];

  // Prepare status options for SelectField
  const statusOptions = [
    { value: "all", label: "All Students" },
    { value: "approved", label: "Approved Only" },
    { value: "pending", label: "Pending Approval" },
  ];

  // Table columns definition
  const columns = [
    {
      header: "Student",
      accessorKey: "name" as keyof User,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <UserCard.Avatar user={row} size="sm" />
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessorKey: "department" as keyof User,
    },
    {
      header: "School",
      accessorKey: "school" as keyof User,
    },
    {
      header: "Batch/Section",
      accessorKey: "batch" as keyof User,
      cell: (row: User) => (
        <div>
          {row.batch} {row.section && `- ${row.section}`}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "isApproved" as keyof User,
      cell: (row: User) => (
        <div className="flex items-center">
          {row.status === "approved" ? (
            <div className="flex items-center text-green-600">
              <Check className="w-4 h-4 mr-1" />
              <span>Approved</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <X className="w-4 h-4 mr-1" />
              <span>{row.status}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt" as keyof User,
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
      title="Student Search"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Student Search" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Find and filter student profiles by various criteria
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* First Tabs: Search Mode */}
            <Tabs
              value={searchMode}
              onValueChange={(value: "basic" | "advanced") =>
                setSearchMode(value)
              }
            >
              <TabsList>
                <TabsTrigger value="basic">Basic Search</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Second Tabs: View Mode */}
            <Tabs
              value={viewMode}
              onValueChange={(value: "table" | "grid") => setViewMode(value)}
            >
              <TabsList className="hidden sm:flex">
                <TabsTrigger value="table">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Table
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Grid
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>{" "}
        </div>

        {/* Search Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {searchMode === "basic" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search by name..."
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <SelectField
                        name="department"
                        control={form.control}
                        label="Department"
                        placeholder="Any Department"
                        options={departmentOptions}
                      />

                      <SelectField
                        name="isApproved"
                        control={form.control}
                        label="Status"
                        options={statusOptions}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Search by name..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Search by email..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <SelectField
                          name="department"
                          control={form.control}
                          label="Department"
                          placeholder="Any Department"
                          options={departmentOptions}
                        />

                        <SelectField
                          name="school"
                          control={form.control}
                          label="School"
                          placeholder="Any School"
                          options={schoolOptions}
                        />

                        <SelectField
                          name="batch"
                          control={form.control}
                          label="Batch"
                          placeholder="Any Batch"
                          options={batchOptions}
                        />

                        <SelectField
                          name="section"
                          control={form.control}
                          label="Section"
                          placeholder="Any Section"
                          options={sectionOptions}
                        />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <SelectField
                          name="isApproved"
                          control={form.control}
                          label="Status"
                          options={statusOptions}
                        />

                        <FormField
                          control={form.control}
                          name="joinedAfter"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Registered After</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="joinedBefore"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Registered Before</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetSearch}
                    >
                      Reset
                    </Button>
                    <Button type="submit" className="bg-primary">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Search Results{" "}
              <span className="text-muted-foreground">
                ({filteredStudents.length})
              </span>
            </h2>
          </div>

          {viewMode === "table" ? (
            <DataTable
              isLoading={false}
              value="student"
              columns={columns}
              data={filteredStudents}
              onView={(student) => handleViewStudent(student)}
              onEdit={(student) => console.log("Edit student:", student._id)}
              onDelete={(student) => console.log("Delete student:", student._id)}
              additionalActions={additionalActions}
              searchable={false}
              pagination={{
                currentPage: 1,
                totalPages: 1,
                onPageChange: (page) => console.log("Page:", page),
              }}
              querySender={() => Promise.resolve({ data: filteredStudents, total: filteredStudents.length })}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStudents.map((student) => (
                <UserCard
                  key={student._id}
                  user={student}
                  onView={() => handleViewStudent(student)}
                  onEdit={() => console.log("Edit student:", student._id)}
                  onDelete={() => console.log("Delete student:", student._id)}
                  onApprove={!student.status ? handleApprove : undefined}
                />
              ))}

              {filteredStudents.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  <UserX2 className="mx-auto h-12 w-12 opacity-30 mb-3" />
                  <h3 className="font-medium text-lg">No students found</h3>
                  <p>Try adjusting your search filters.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedStudent && (
          <>{console.log("Selected student details:", selectedStudent)}</>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminStudentSearch;

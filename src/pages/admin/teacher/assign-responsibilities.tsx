
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignResponsibilities } from "@/components/teacher/AssignResponsibilities";
import { Avatar } from "@/components/user/Avatar";
import { RoleBadge } from "@/components/user/RoleBadge";
import { User } from "@/types/user";
import { Search, UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

export default function TeacherResponsibilitiesAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  
  const initialFilters = {
      role: "teacher" as const,
    }

  // Fetch teachers using the useUsers hook
  const { users: teachers, pagination, isLoading } = useUsers(initialFilters);

  // Filter teachers based on search query and department
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || teacher.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <AppLayout 
      title="Assign Teacher Responsibilities" 
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Teachers", href: "/admin/users/teachers" },
        { label: "Assign Responsibilities", href: "/admin/teachers/assign-responsibilities" }
      ]}
      allowedRoles={["admin"]}
    >
      <div className="container mx-auto py-6">
        <Tabs defaultValue="assign" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="assign">Assign Responsibilities</TabsTrigger>
            <TabsTrigger value="manage">Manage Existing Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assign" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Teacher Selection Panel */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Teacher</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and filter */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search teachers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select
                      value={filterDepartment}
                      onValueChange={setFilterDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Teacher list */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <div
                          key={teacher._id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTeacher === teacher._id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedTeacher(teacher._id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar user={teacher} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{teacher.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {teacher.email}
                              </p>
                            </div>
                            <RoleBadge role="teacher" size="sm" />
                          </div>
                          {teacher.department && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Department: {teacher.department}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        No teachers found matching your criteria.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Assignment Form */}
              <div className="md:col-span-2">
                {selectedTeacher ? (
                  <AssignResponsibilities 
                    teacherId={selectedTeacher}
                    initialAssignments={[]} 
                    onSuccess={() => {
                      // Would handle success in real implementation
                    }}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center py-12 px-4">
                      <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a Teacher</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Please select a teacher from the list to assign course responsibilities and sections.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Existing Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage existing teacher assignments here. This section would display a table of current assignments with options to edit or remove them.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

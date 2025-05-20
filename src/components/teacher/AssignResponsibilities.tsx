import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { useAssignTeacherResponsibilities } from "@/hooks/useUsers";
import { TeacherAssignment } from "@/types/auth";

// Sample options (replace with API data in a real app)
const schools = ["Electrical", "Computing", "Mechanical"];
const departments = ["Software", "Computer Science", "Electrical Engineering"];
const sections = ["1", "2", "3", "4"];
const subjects = [
  "Web Development",
  "Testing and Quality Assurance",
  "Fundamentals of Software Engineering",
  "Database Systems",
];

interface AssignResponsibilitiesProps {
  teacherId: string;
  initialAssignments?: TeacherAssignment[];
  onSuccess?: () => void;
}

export const AssignResponsibilities = ({
  teacherId,
  initialAssignments = [],
  onSuccess,
}: AssignResponsibilitiesProps) => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(initialAssignments);

  const { assignTeacherResponsibilities, isLoading } = useAssignTeacherResponsibilities();

  useEffect(() => {
    if (initialAssignments.length > 0) {
      setAssignments(initialAssignments);
    }
  }, [initialAssignments]);

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      { section: "", subject: "", department: "", school: "" },
    ]);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleAssignmentChange = (
    index: number,
    field: keyof TeacherAssignment,
    value: string
  ) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setAssignments(newAssignments);
  };

  const handleSubmit = () => {
    // Validate fields
    const hasEmptyFields = assignments.some(
      (a) => !a.section || !a.subject || !a.department || !a.school
    );
    if (hasEmptyFields) {
      toast.error("Please fill in all fields for each assignment");
      return;
    }

    // Validate unique section-subject pairs
    const assignmentKeys = assignments.map((a) => `${a.section}-${a.subject}`);
    const uniqueKeys = new Set(assignmentKeys);
    if (uniqueKeys.size !== assignmentKeys.length) {
      toast.error("Duplicate section-subject assignments are not allowed");
      return;
    }

    assignTeacherResponsibilities(
      { id: teacherId, data: { assignments } },
      {
        onSuccess: () => {
          toast.success("Teacher responsibilities assigned successfully");
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          toast.error(`Failed to assign responsibilities: ${error.message}`);
        },
      }
    );
  };

  return (
    <LoadingOverlay isLoading={isLoading} message="Updating teacher responsibilities...">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assign Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No assignments yet. Add some below.</p>
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md relative"
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => handleRemoveAssignment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-medium">School</label>
                  <Select
                    value={assignment.school}
                    onValueChange={(value) => handleAssignmentChange(index, "school", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select
                    value={assignment.department}
                    onValueChange={(value) => handleAssignmentChange(index, "department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select
                    value={assignment.section}
                    onValueChange={(value) => handleAssignmentChange(index, "section", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select
                    value={assignment.subject}
                    onValueChange={(value) => handleAssignmentChange(index, "subject", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddAssignment}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Assignment
          </Button>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={assignments.length === 0 || isLoading}
          >
            Save Assignments
          </Button>
        </CardFooter>
      </Card>
    </LoadingOverlay>
  );
};

export default AssignResponsibilities;
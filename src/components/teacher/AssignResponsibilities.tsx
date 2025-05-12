
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssignTeacherResponsibilities, TeacherResponsibilityData } from "@/hooks/useTeacher";
import { SectionAssignment } from "@/types/user";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";

interface AssignResponsibilitiesProps {
  teacherId: string;
  initialAssignments?: SectionAssignment[];
  onSuccess?: () => void;
}

export const AssignResponsibilities = ({ 
  teacherId,
  initialAssignments = [],
  onSuccess
}: AssignResponsibilitiesProps) => {
  const [assignments, setAssignments] = useState<SectionAssignment[]>(initialAssignments);
  
  const { assignResponsibilities, isLoading } = useAssignTeacherResponsibilities();

  useEffect(() => {
    if (initialAssignments?.length) {
      setAssignments(initialAssignments);
    }
  }, [initialAssignments]);

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      { section: "", subject: "", department: "", school: "" }
    ]);
  };

  const handleRemoveAssignment = (index: number) => {
    const newAssignments = [...assignments];
    newAssignments.splice(index, 1);
    setAssignments(newAssignments);
  };

  const handleAssignmentChange = (index: number, field: keyof SectionAssignment, value: string) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setAssignments(newAssignments);
  };

  const handleSubmit = () => {
    // Validate fields
    const hasEmptyFields = assignments.some(a => 
      !a.section || !a.subject || !a.department || !a.school
    );
    
    if (hasEmptyFields) {
      toast.error("Please fill in all fields for each assignment");
      return;
    }

    const data: TeacherResponsibilityData = {
      secAssigned: assignments
    };

    assignResponsibilities(
      { teacherId, data },
      { 
        onSuccess: () => {
          if (onSuccess) onSuccess();
        }
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
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md relative">
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
                  <Input
                    value={assignment.school}
                    onChange={(e) => handleAssignmentChange(index, 'school', e.target.value)}
                    placeholder="School"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    value={assignment.department}
                    onChange={(e) => handleAssignmentChange(index, 'department', e.target.value)}
                    placeholder="Department"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Input
                    value={assignment.section}
                    onChange={(e) => handleAssignmentChange(index, 'section', e.target.value)}
                    placeholder="Section"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={assignment.subject}
                    onChange={(e) => handleAssignmentChange(index, 'subject', e.target.value)}
                    placeholder="Subject"
                  />
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

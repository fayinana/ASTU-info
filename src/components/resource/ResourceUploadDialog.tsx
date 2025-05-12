
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { FileUploader } from "@/components/form/FileUploader";
import { TextareaField } from "@/components/form/TextareaField";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";

interface ResourceUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { file: File, data: any }) => void;
  isSubmitting: boolean;
}

const ResourceUploadDialog: React.FC<ResourceUploadDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  isSubmitting 
}) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      department: user?.department || "",
      year: "",
    },
  });

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = (data: any) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    onSubmit({
      file: selectedFile,
      data: {
        ...data,
        type: getResourceTypeFromFile(selectedFile),
      },
    });
  };

  // Determine resource type based on file
  const getResourceTypeFromFile = (file: File): string => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    if (
      fileType.includes("pdf") ||
      fileType.includes("document") ||
      fileType.includes("sheet")
    )
      return "document";
    return "document"; // Default
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Resource</DialogTitle>
          <DialogDescription>
            Share educational resources with your students
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            <InputField
              name="title"
              label="Resource Title"
              placeholder="Enter a title for this resource"
              control={form.control}
              required
            />

            <TextareaField
              name="description"
              label="Description"
              placeholder="Enter a description of this resource"
              control={form.control}
            />

            {/* Teachers can only upload to their department */}
            <InputField
              name="department"
              label="Department"
              value={user?.department || ""}
              disabled
              control={form.control}
            />

            <SelectField
              name="year"
              label="Year"
              control={form.control}
              options={[
                { value: "", label: "All Years" },
                { value: "1", label: "Year 1" },
                { value: "2", label: "Year 2" },
                { value: "3", label: "Year 3" },
                { value: "4", label: "Year 4" },
                { value: "5", label: "Year 5" },
              ]}
            />

            <FileUploader
              label="Upload File"
              description="Upload PDF, DOCX, images, videos (max 50MB)"
              onChange={handleFileChange}
              maxSize={50 * 1024 * 1024} // 50MB
              acceptedFileTypes={[
                "application/pdf",
                "image/*",
                "video/*",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceUploadDialog;

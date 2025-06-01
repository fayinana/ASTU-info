import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUploader } from "@/components/form/FileUploader";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { TextareaField } from "@/components/form/TextareaField";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useUploadResource as useCreateResource } from "@/hooks/useResources";
import { ResourceCreationRequest } from "@/types/resource";

const SCHOOLDDEP = {
  ELEC: ["SE", "CSE", "ECPC", "ECE"],
  MECH: ["ME", "MCE", "MEE"],
};

export default function UploadResource() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadResource, isLoading } = useCreateResource();

  const form = useForm<ResourceCreationRequest>({
    defaultValues: {
      title: "",
      description: "",
      type: "resource",
      department: "",
      year: "",
      school: "",
      files: [],
    },
  });

  const selectedSchool = form.watch("school");
  const selectedType = form.watch("type");

  useEffect(() => {
    form.setValue("department", "");
  }, [selectedSchool, form]);

  const schoolOptions = [
    { value: "", label: "Select School" },
    ...Object.keys(SCHOOLDDEP).map((school) => ({
      value: school,
      label: school,
    })),
  ];

  const departmentOptions =
    selectedSchool && SCHOOLDDEP[selectedSchool]
      ? SCHOOLDDEP[selectedSchool].map((dep) => ({ value: dep, label: dep }))
      : [];

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      form.setValue("files", files);
    }
  };

  const handleUpload: SubmitHandler<ResourceCreationRequest> = (data) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    console.log("Uploading resource with data:", data);
    uploadResource({ ...data, files: [selectedFile] });
  };

  return (
    <AppLayout
      title="Admin Dashboard"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Resources", href: "/admin/resources" },
        { label: "Create" },
      ]}
      allowedRoles={["admin", "teacher"]}
    >
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={form.handleSubmit(handleUpload)}>
          <div className="space-y-2">
            <Label>Post Type</Label>
            <RadioGroup
              value={selectedType}
              className="flex flex-wrap gap-4"
              onValueChange={(value) =>
                form.setValue("type", value as "resource" | "exitExam")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resource" id="resource" />
                <Label htmlFor="resource">Resource</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exitExam" id="exitExam" />
                <Label htmlFor="exitExam">Exit Exam</Label>
              </div>
            </RadioGroup>
          </div>

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

            <SelectField
              name="school"
              label="School"
              control={form.control}
              options={schoolOptions}
              required
            />

            <SelectField
              name="department"
              label="Department"
              control={form.control}
              options={[
                { value: "", label: "Select Department" },
                ...departmentOptions,
              ]}
              disabled={!selectedSchool}
              required={!!selectedSchool}
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
              maxSize={50 * 1024 * 1024}
              acceptedFileTypes={[
                "application/pdf",
                "image/*",
                "video/*",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              component={Link}
              to="/admin/resources"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isLoading}>
              {isLoading ? "Uploading..." : "Upload Resource"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

import FileUploader from "@/components/form/FileUploader";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateAnnouncement } from "@/hooks/useAnnouncements";
import { AnnouncementFormValues, announcementSchema } from "@/lib/zodSchemas";
import { CreatePostRequest } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const TeacherCreatePost = () => {
  const navigate = useNavigate();
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      file: null,
    },
  });
  const { createAnnouncment, isLoading: isCreatingAnauncment } =
    useCreateAnnouncement();
  const onSubmit = async (values: CreatePostRequest) => {
    values.type = "announcement";
    createAnnouncment(values);
  };

  return (
    <LoadingOverlay message="Creating..." isLoading={isCreatingAnauncment}>
      <AppLayout
        title="Create Announcement"
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Posts", href: "/teacher/posts" },
          { label: "Create" },
        ]}
        allowedRoles={["teacher"]}
      >
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <InputField
                    label="Title"
                    name="title"
                    control={form.control}
                    placeholder="Enter announcement title"
                    required
                  />

                  <TextareaField
                    label="Content"
                    name="content"
                    control={form.control}
                    placeholder="Enter announcement content"
                    rows={5}
                    required
                  />

                  <Controller
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value } }) => (
                      <FileUploader
                        label="Upload File"
                        onChange={(files) => onChange(files[0])} // Only single file expected
                        value={value ? [value] : []} // FileUploader expects an array
                        maxFiles={1}
                        acceptedFileTypes={["image/*", "application/pdf"]} // customize as needed
                        description="Upload a PDF or image file (max 5MB)"
                      />
                    )}
                  />
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/announcements")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingAnauncment}>
                    {isCreatingAnauncment
                      ? "Creating..."
                      : "Create Announcement"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </AppLayout>
    </LoadingOverlay>
  );
};

export default TeacherCreatePost;

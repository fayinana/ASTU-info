
import { AppLayout } from "@/components/layout/AppLayout";
import { CreatePostForm } from "@/components/post/CreatePostForm";

const TeacherCreateInstructionalPost = () => {
  return (
    <AppLayout 
      title="Create Instructional Post" 
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Instructional Posts", href: "/teacher/instructional-posts" },
        { label: "Create" }
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Instructional Post</h1>
          <p className="text-muted-foreground mt-1">
            Create educational content for your students.
          </p>
        </div>

        <CreatePostForm 
          redirectPath="/teacher/instructional-posts"
          defaultType="instructional"
        />
      </div>
    </AppLayout>
  );
};

export default TeacherCreateInstructionalPost;

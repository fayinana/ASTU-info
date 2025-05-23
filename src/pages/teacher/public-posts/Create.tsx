
import { AppLayout } from "@/components/layout/AppLayout";
import { CreatePostForm } from "@/components/post/CreatePostForm";

const TeacherCreatePublicPost = () => {
  return (
    <AppLayout 
      title="Create Public Post" 
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Public Posts", href: "/teacher/public-posts" },
        { label: "Create" }
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Public Post</h1>
          <p className="text-muted-foreground mt-1">
            Share information or start discussions with the community.
          </p>
        </div>

        <CreatePostForm 
          redirectPath="/teacher/public-posts"
          defaultType="public"
        />
      </div>
    </AppLayout>
  );
};

export default TeacherCreatePublicPost;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostList from "@/components/post/PostList";
import { PlusCircle, BookOpen } from "lucide-react";

const TeacherInstructionalPosts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("my-posts");

  return (
    <AppLayout
      title="Instructional Posts"
      breadcrumbs={[
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Instructional Posts" },
      ]}
      allowedRoles={["teacher"]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Instructional Posts</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage instructional posts for your students.
            </p>
          </div>
          <Button
            onClick={() => navigate("/teacher/instructional-posts/create")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full md:w-auto mb-4">
            <TabsTrigger value="my-posts">
              <BookOpen className="mr-2 h-4 w-4" />
              My Instructional Posts
            </TabsTrigger>
            <TabsTrigger value="all-instructional">
              All Instructional
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-posts" className="mt-0">
            <PostList
              defaultType="instructional"
              showTabs={false}
              authorOnly={true}
              showCreateButton={false}
              createPath="/teacher/instructional-posts/create"
            />
          </TabsContent>

          <TabsContent value="all-instructional" className="mt-0">
            <PostList
              defaultType="instructional"
              showTabs={false}
              showCreateButton={false}
              createPath="/teacher/instructional-posts/create"
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TeacherInstructionalPosts;

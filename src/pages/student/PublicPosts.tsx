import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostList from "@/components/post/PostList";
import { PlusCircle, MessageSquare } from "lucide-react";

const StudentPublicPosts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("browse");

  return (
    <AppLayout
      title="Public Posts"
      breadcrumbs={[
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Public Posts" },
      ]}
      allowedRoles={["student"]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Public Posts</h1>
            <p className="text-muted-foreground mt-1">
              Create and participate in public discussions with the community.
            </p>
          </div>
          <Button onClick={() => navigate("/student/public-posts/new")}>
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
            <TabsTrigger value="browse">
              <MessageSquare className="mr-2 h-4 w-4" />
              Browse Posts
            </TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-0">
            <PostList
              defaultType="public"
              showTabs={false}
              showCreateButton={false}
              createPath="/student/public-posts/create"
            />
          </TabsContent>

          <TabsContent value="my-posts" className="mt-0">
            <PostList
              defaultType="public"
              showTabs={false}
              authorOnly={true}
              showCreateButton={false}
              createPath="/student/public-posts/create"
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StudentPublicPosts;

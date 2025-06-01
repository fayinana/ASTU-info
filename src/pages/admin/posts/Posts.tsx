// import { AppLayout } from "@/components/layout/AppLayout";
// import { DataTable } from "@/components/tables/DataTable";
// import StatusBadge from "@/components/tables/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar } from "@/components/user/Avatar";
// import { useAuth } from "@/context/AuthContext";
// import useAppToast from "@/hooks/useAppToast";
// import { usePosts } from "@/hooks/usePosts";
// import { Post } from "@/types/post";
// import {
//   Bell,
//   BookOpen,
//   FileText,
//   Heart,
//   MessageSquare,
//   Plus,
//   Users as UsersIcon,
// } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const postTypeLabels: Record<string, string> = {
//   announcement: "Announcement",
//   instructional: "Instructional",
//   public: "Public Discussion",
// };

// const AdminPosts = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { success } = useAppToast();
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [authorFilter, setAuthorFilter] = useState<string>("all");
//   const [currentTab, setCurrentTab] = useState<string>("all");

//   const {
//     posts: announcements,
//     isLoading: isLoadingAnnouncements,
//     error: announcementsError,
//   } = usePosts({
//     initialFilters: { type: "announcement" },
//   });

//   const {
//     error: instructionalError,
//     isLoading: isLoadingInstructional,
//     posts: instructionalPosts,
//   } = usePosts({
//     initialFilters: { type: "instructional" },
//   });

//   const { posts, isLoading: isLoadingPosts, error: postsError } = usePosts({});

//   // Get all post authors for filter
//   const postAuthors = [...new Set(posts.map((post) => post.author._id))];
//   const authorMap = new Map(posts.map((user) => [user._id, user]));

//   // Count post types
//   const announcementCount = announcements?.length || 0;
//   const instructionalCount = instructionalPosts?.length || 0;
//   const publicCount = posts?.length || 0;

//   const {
//     error,
//     posts: allPosts,
//     pagination,
//     isLoading,
//   } = usePosts({
//     initialLimit: 5,
//   });

//   const handleDelete = (post: Post) => {
//     success({
//       title: "Post Deleted",
//       description: `"${post.title}" has been deleted successfully.`,
//     });
//   };

//   const columns = [
//     {
//       header: "Title",
//       accessorKey: "title",
//       cell: (row: Post) => (
//         <div>
//           <div className="font-medium">{row.title || "Untitled"}</div>
//           <div className="text-xs text-muted-foreground truncate max-w-xs">
//             {(row.content || "").slice(0, 60)}...
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "Author",
//       accessorKey: "author",
//       cell: (row: Post) => (
//         <div className="flex items-center gap-2">
//           <Avatar user={row.author} size="sm" />
//           <div>
//             <div className="font-medium">{row.author.name}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "Type",
//       accessorKey: "type",
//       cell: (row: Post) => (
//         <StatusBadge
//           status={
//             row.type === "announcement"
//               ? "info"
//               : row.type === "instructional"
//               ? "success"
//               : "secondary"
//           }
//           text={postTypeLabels[row.type] || row.type}
//         />
//       ),
//     },
//     {
//       header: "Engagement",
//       accessorKey: "like",
//       cell: (row: Post) => (
//         <div className="flex items-center gap-3">
//           <div className="flex items-center">
//             <Heart className="h-4 w-4 mr-1 text-red-400" />
//             <span>{(row.like || []).length}</span>
//           </div>
//           <div className="flex items-center">
//             <MessageSquare className="h-4 w-4 mr-1 text-blue-400" />
//             <span>{(row.comments || []).length}</span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "Date",
//       accessorKey: "createdAt",
//       cell: (row: Post) => new Date(row.createdAt).toLocaleDateString(),
//     },
//   ];

//   return (
//     <AppLayout
//       title="All Posts"
//       breadcrumbs={[
//         { label: "Dashboard", href: "/admin/dashboard" },
//         { label: "All Posts" },
//       ]}
//       allowedRoles={["admin"]}
//     >
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//           <div>
//             <p className="text-muted-foreground">
//               Manage all content across the platform
//             </p>
//           </div>
//           <Link to="/admin/posts/new?type=public">
//             <Button className="sm:w-auto w-full">
//               <Plus className="mr-2 h-4 w-4" /> New Post
//             </Button>
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">All Posts</CardTitle>
//                 <FileText className="h-4 w-4 text-primary" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{pagination.total}</div>
//               <div className="text-sm text-muted-foreground mt-1">
//                 Total platform content
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">Announcements</CardTitle>
//                 <Bell className="h-4 w-4 text-blue-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{announcementCount}</div>
//               <div className="text-sm text-muted-foreground mt-1">
//                 Official notifications
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">Instructional</CardTitle>
//                 <BookOpen className="h-4 w-4 text-green-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{instructionalCount}</div>
//               <div className="text-sm text-muted-foreground mt-1">
//                 Teaching materials
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">Public</CardTitle>
//                 <UsersIcon className="h-4 w-4 text-amber-500" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{publicCount}</div>
//               <div className="text-sm text-muted-foreground mt-1">
//                 Community discussions
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs and Filters */}
//         <Tabs
//           defaultValue="all"
//           value={currentTab}
//           onValueChange={setCurrentTab}
//         >
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b pb-3">
//             <TabsList>
//               <TabsTrigger value="all">All Posts</TabsTrigger>
//               <TabsTrigger value="announcement">Announcements</TabsTrigger>
//               <TabsTrigger value="instructional">Instructional</TabsTrigger>
//               <TabsTrigger value="public">Public</TabsTrigger>
//             </TabsList>

//             <div className="flex gap-2">
//               <Select value={authorFilter} onValueChange={setAuthorFilter}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Authors" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Authors</SelectItem>
//                   {postAuthors.map((authorId) => {
//                     const author = authorMap.get(authorId);
//                     return author ? (
//                       <SelectItem key={authorId} value={authorId}>
//                         author
//                       </SelectItem>
//                     ) : null;
//                   })}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <TabsContent value="all" className="mt-0 pt-4">
//             <DataTable
//               columns={columns}
//               data={allPosts}
//               isLoading={isLoading}
//               onView={(row) =>
//                 navigate(
//                   `/admin/${
//                     row.type === "announcement" ? "announcements" : "posts"
//                   }/${row._id}`
//                 )
//               }
//               onDelete={handleDelete}
//               hideDelete={(row) => row.author._id !== user?._id}
//               searchable
//               searchPlaceholder="Search posts..."
//               value="post"
//               pagination={{
//                 currentPage: pagination.page,
//                 totalPages: pagination.totalPages,
//                 onPageChange: (newPage) => newPage,
//               }}
//               querySender={() => {}} // Provide a no-op or actual function as needed
//             />
//           </TabsContent>

//           <TabsContent value="announcement" className="mt-0 pt-4">
//             <DataTable
//               columns={columns}
//               data={announcements}
//               isLoading={isLoadingAnnouncements}
//               onView={(row) => console.log("View post:", row._id)}
//               onDelete={handleDelete}
//               hideDelete={(row) => row.author._id !== user?._id}
//               searchable
//               searchPlaceholder="Search announcements..."
//               value="announcement"
//               querySender={() => {}} // Provide a no-op or actual function as needed
//             />
//           </TabsContent>

//           <TabsContent value="instructional" className="mt-0 pt-4">
//             <DataTable
//               columns={columns}
//               data={instructionalPosts}
//               isLoading={isLoadingInstructional}
//               onView={(row) => console.log("View post:", row._id)}
//               onDelete={handleDelete}
//               hideDelete={(row) => row.author._id !== user?._id}
//               searchable
//               searchPlaceholder="Search instructional posts..."
//               value="instructional"
//               querySender={() => {}} // Provide a no-op or actual function as needed
//             />
//           </TabsContent>

//           <TabsContent value="public" className="mt-0 pt-4">
//             <DataTable
//               columns={columns}
//               data={posts}
//               isLoading={isLoadingPosts}
//               onView={(row) => console.log("View post:", row._id)}
//               hideDelete={(row) => row.author._id !== user?._id}
//               onDelete={handleDelete}
//               searchable
//               searchPlaceholder="Search public posts..."
//               value="public"
//               querySender={() => {}} // Provide a no-op or actual function as needed
//             />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </AppLayout>
//   );
// };

// export default AdminPosts;
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, MessageSquare, Filter } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const TeacherPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "announcement" | "instructional" | "public" | "all"
  >("all");
  const [search, setSearchQuery] = useState("");

  // Setup filters based on active tab
  const filters: Record<string, any> = {};
  if (activeTab !== "all") {
    filters.type = activeTab;
  }

  // Use the posts hook with filters
  const { posts, isLoading, pagination } = usePosts({
    type: activeTab === "all" ? undefined : activeTab,
    search,
  });

  // Define columns for the data table
  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row: any) => (
        <div>
          <p className="font-medium">{row.title || "Untitled"}</p>
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {(row.content || "").slice(0, 60)}...
          </p>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: any) => (
        <StatusBadge
          status={
            row.type === "announcement"
              ? "info"
              : row.type === "instructional"
              ? "success"
              : "secondary"
          }
          text={row.type}
        />
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: any) => format(new Date(row.createdAt), "MMM dd, yyyy"),
    },
    {
      header: "Engagement",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {(row.like || []).length}
            </span>
            <span className="mx-1">likes</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-sm">{(row.comments || []).length}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="All Posts"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "All Posts" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Posts</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your posts including instructional content and
              public discussions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/teacher/public-posts/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Public
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Your Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="instructional">Instructional</TabsTrigger>
                  <TabsTrigger value="announcement">Announcement</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search posts..."
                    className="max-w-xs"
                    value={search}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      console.log(e.target.value || null);
                    }}
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  columns={columns}
                  data={posts}
                  isLoading={isLoading}
                  searchable={false} // We're handling search manually
                  onView={(row) => navigate(`/teacher/posts/${row._id}`)}
                  pagination={{
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: (page) => console.log(page),
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TeacherPosts;

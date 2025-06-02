import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { Heart, MessageSquare } from "lucide-react";
import { Post } from "@/types/post";
import { Avatar } from "@/components/user/Avatar";
import { useAuth } from "@/context/AuthContext";

interface PostsSectionProps {
  posts: Post[];
  isLoading: boolean;
}

const PostsSection: React.FC<PostsSectionProps> = ({ posts, isLoading }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const columns = [
    {
      header: "Title",
      accessorKey: "content",
      cell: (row: Post) => (
        <div>
          <div className="font-medium">{row.title || "Untitled"}</div>
          <div className="text-xs text-muted-foreground truncate max-w-xs">
            {(row.content || "").slice(0, 60)}...
          </div>
        </div>
      ),
    },
    {
      header: "Author",
      accessorKey: "author",
      cell: (row: Post) => (
        <div className="flex items-center gap-2">
          {typeof row.author !== "string" && (
            <Avatar user={row.author} size="sm" />
          )}
          <div>
            <div className="font-medium">
              {typeof row.author === "string" ? row.author : row.author.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row: Post) => (
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
      header: "Engagement",
      accessorKey: "like",
      cell: (row: Post) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1 text-red-400" />
            <span>{(row.like || []).length}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1 text-blue-400" />
            <span>{(row.comments || []).length}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: Post) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b pb-3 ">
        <h3 className="text-lg font-medium">Recent Posts</h3>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          value="post"
          columns={columns}
          data={posts}
          isLoading={isLoading}
          onView={(row) => navigate(`/teacher/posts/${row._id}`)}
          onDelete={(row) => {
            if (user._id === row.author._id) {
              return null;
            } else {
              // Handle delete action
              console.log("Delete post:", row);
            }
          }}
          searchPlaceholder="Search posts..."
          querySender={() => {}} // Provide a no-op function or replace with actual logic if needed
        />
      </CardContent>
    </Card>
  );
};

export default PostsSection;

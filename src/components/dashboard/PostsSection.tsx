
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { Heart, MessageSquare } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types/post";
import { Avatar } from "@/components/user/Avatar";

interface PostsSectionProps {
  limit?: number;
  type?: "announcement" | "instructional" | "public";
  showPagination?: boolean;
}

const PostsSection: React.FC<PostsSectionProps> = ({
  limit = 5,
  type,
  showPagination = false,
}) => {
  const navigate = useNavigate();
  
  const options = {
    initialLimit: limit,
    initialFilters: {} as Record<string, any>
  };
  
  if (type) {
    options.initialFilters.type = type;
  }
  
  const { 
    posts, 
    isLoading,
    pagination,
    setSearch,
    setPagination
  } = usePosts(options);

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
      <CardHeader className="border-b pb-3">
        <h3 className="text-lg font-medium">
          {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Posts` : "Recent Posts"}
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          value="post"
          columns={columns}
          data={posts}
          isLoading={isLoading}
          onView={(row) => navigate(`/admin/posts/${row._id}`)}
          pagination={showPagination ? {
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            onPageChange: (newPage) => setPagination(newPage)
          } : undefined}
          searchable={showPagination}
          onSearch={(query) => setSearch(query || null)}
          searchPlaceholder="Search posts..."
        />
      </CardContent>
    </Card>
  );
};

export default PostsSection;

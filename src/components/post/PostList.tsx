
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts"; 
import { PostListSkeleton } from "@/components/skeletons/PostListSkeleton";
import { Post } from "@/types/post";

interface PostListProps {
  defaultType?: string;
  showFilters?: boolean;
  showTabs?: boolean;
  showCreateButton?: boolean;
  authorOnly?: boolean;
  createPath?: string;
}

export const PostList = ({
  defaultType = "all",
  showFilters = true,
  showTabs = true,
  showCreateButton = true,
  authorOnly = false,
  createPath = "",
}: PostListProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(defaultType);
  const [localSearch, setLocalSearch] = useState("");

  // Memoize filters to prevent unnecessary rerenders
  const initialFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    
    // Set type filter if not 'all'
    if (activeTab !== "all") {
      filters.type = activeTab;
    }
    
    // Set authorId filter if authorOnly is true
    if (authorOnly && user?._id) {
      filters.authorId = user._id;
    }
    
    return filters;
  }, [activeTab, authorOnly, user?._id]);

  // Fetch posts based on filters
  const { 
    posts,
    isLoading,
    error: isError,
    setSearch,
    setFilter
  } = usePosts({
    initialFilters
  });

  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch || null);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update type filter based on tab
    if (value !== "all") {
      setFilter("type", value);
    } else {
      setFilter("type", null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {showFilters && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        )}

        {showCreateButton && user && createPath && (
          <Button onClick={() => navigate(createPath)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      {showTabs && (
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="instructional">Instructional</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {isLoading ? (
        <PostListSkeleton count={3} />
      ) : isError ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Failed to load posts. Please try again.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No posts found</p>
            {showCreateButton && user && createPath && (
              <Button variant="outline" onClick={() => navigate(createPath)}>
                Create your first post
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostList;

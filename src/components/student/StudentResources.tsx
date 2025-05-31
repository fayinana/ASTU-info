import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, FileVideo, Link, Search } from "lucide-react";
import { useResources } from "@/hooks/useResources";
import { Badge } from "@/components/ui/badge";
import { useResourceFilters } from "@/hooks/useResourceFilters";

interface StudentResourcesProps {
  showHeader?: boolean;
  maxResources?: number;
}

const StudentResources: React.FC<StudentResourcesProps> = ({
  showHeader = true,
  maxResources = 6,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { getQuery } = useResourceFilters();

  // Get resources with filtering
  const { resources, isLoading, error } = useResources(getQuery());

  // Display resources based on expanded state
  const displayedResources = expanded
    ? resources
    : resources.slice(0, maxResources);

  // Helper function to render resource icon based on type
  const renderResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "image":
        return <FileImage className="h-8 w-8 text-green-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-red-500" />;
      default:
        return <Link className="h-8 w-8 text-purple-500" />;
    }
  };

  return (
    <Card className="shadow-sm">
      {showHeader && (
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">Learning Resources</h2>
        </CardHeader>
      )}

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted rounded-md p-4 h-32"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load resources</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedResources.map((resource) => (
              <Card
                key={resource._id}
                className="overflow-hidden border hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {resource.department}
                      </p>
                    </div>
                    <div>{renderResourceIcon(resource.type)}</div>
                  </div>

                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                    {resource.year && (
                      <Badge variant="outline" className="text-xs ml-2">
                        Year {resource.year}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No resources found</p>
          </div>
        )}
      </CardContent>

      {resources.length > maxResources && (
        <CardFooter className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudentResources;

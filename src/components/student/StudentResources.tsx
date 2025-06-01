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

  const { resources, isLoading, error } = useResources(getQuery());

  const displayedResources = expanded
    ? resources
    : resources.slice(0, maxResources);

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case "resource":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "image":
        return <FileImage className="h-8 w-8 text-green-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedResources.map((resource) => (
              <Card
                key={resource._id}
                className="relative overflow-hidden border hover:shadow-md transition-shadow w-35 h-25 p-2"
              >
                <span className="absolute top-1 right-1 text-[9px] text-muted-foreground">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>

                <div className="flex flex-col justify-between h-full p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1">
                      <h3 className="font-medium text-xs line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-[9px] text-muted-foreground">
                        {resource.department}
                      </p>
                    </div>
                    <div>{renderResourceIcon(resource.type)}</div>
                  </div>

                  <div className="mt-1">
                    <Badge variant="outline" className="text-[9px] px-1 py-0.5">
                      {resource.type}
                    </Badge>
                    {resource.year && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0.5 ml-1"
                      >
                        Year {resource.year}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      size="xs"
                      variant="outline"
                      className="px-2 py-0.5 text-[9px]"
                    >
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

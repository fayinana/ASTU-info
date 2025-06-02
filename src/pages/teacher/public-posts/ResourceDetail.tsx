import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, FileX } from "lucide-react";
import { useResources } from "@/hooks/useResources";
import { useParams } from "react-router-dom";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import AppLayout from "@/components/layout/AppLayout";

interface Author {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

interface ResourceFile {
  type: string;
  url: string;
}

interface Resource {
  _id: string;
  authorId: Author | string;
  type: "resource" | "exitExam";
  title: string;
  description: string;
  school: string;
  department: string;
  year?: number;
  files: ResourceFile[];
  createdAt: string;
  updatedAt: string;
}

const ResourceDetail = () => {
  const params = useParams();
  const { resources, isLoading } = useResources({});
  const resourceId = params.id;
  const resource = resources.find((res: Resource) => res._id === resourceId);

  // Extract author if available and is an object
  const author: Author | undefined =
    resource && typeof resource.authorId === "object"
      ? (resource.authorId as Author)
      : undefined;
  if (isLoading)
    return (
      <AppLayout>
        <LoadingOverlay
          isLoading={isLoading}
          message="Loading resource details..."
        />
      </AppLayout>
    );

  if (!resource) {
    return (
      <AppLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="rounded-2xl ">
            <CardContent className="p-6 text-center space-y-4">
              <h1 className="text-3xl font-bold">Resource Not Found</h1>
              <p className="text-muted-foreground">
                The requested resource does not exist.
              </p>
              <FileX className="mx-auto h-24 w-24  text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{resource.title}</h1>
              <p className="text-muted-foreground">{resource.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <Badge>{resource.type}</Badge>
              <Badge variant="outline">{resource.school}</Badge>
              <Badge variant="outline">{resource.department}</Badge>
              {resource.year && (
                <Badge variant="outline">Year: {resource.year}</Badge>
              )}
            </div>

            <Separator />

            {author && (
              <div>
                <p className="text-sm">
                  Author: <span className="font-medium">{author.name}</span> (
                  {author.role})
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {author.email}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Files</h2>
              <ScrollArea className="h-40">
                <ul className="space-y-2">
                  {resource.files.map((file: ResourceFile, idx: number) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-2 border rounded-lg"
                    >
                      <span>{file.type}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Created: {new Date(resource.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(resource.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ResourceDetail;

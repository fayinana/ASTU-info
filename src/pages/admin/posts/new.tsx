import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUploader } from "@/components/form/FileUploader";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePost } from "@/hooks/usePosts";
import { CreatePostRequest } from "@/types/post";

export default function AdminAddPost() {
  const [postType, setPostType] = useState<"announcement" | "instructional" | "public">("announcement");
  const [files, setFiles] = useState<File[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [school, setSchool] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [section, setSection] = useState<string>("");

  const { createPost, error, isLoading } = useCreatePost();

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();

    const data: CreatePostRequest = {
      content: contentRef.current?.value || "",
      title: postType === "announcement" ? titleRef.current?.value || "" : "",
      files: files[0], // Assuming only one file for simplicity; adjust if multiple files are needed
      type: postType,
    };

    // For instructional posts, append additional fields if needed
    if (postType === "instructional") {
      const instructionalData = {
        ...data,
        school,
        department,
        batch,
        section,
      };
      createPost(instructionalData);
    } else {
      createPost(data);
    }
  }

  return (
    <AppLayout
      title="Add New Post"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Posts", href: "/admin/posts" },
        { label: "Add New Post", href: "/admin/posts/new" },
      ]}
      allowedRoles={["admin"]}
    >
      <div className="container mx-auto py-6">
        <Card className="max-w-4xl mx-auto">
          <form onSubmit={handleCreatePost}>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Post Type Selection */}
              <div className="space-y-2">
                <Label>Post Type</Label>
                <RadioGroup
                  defaultValue="announcement"
                  className="flex flex-wrap gap-4"
                  onValueChange={(value) => setPostType(value as "announcement" | "instructional" | "public")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="announcement" id="announcement" />
                    <Label htmlFor="announcement">Announcement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instructional" id="instructional" />
                    <Label htmlFor="instructional">Instructional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Title (only for announcements) */}
              {postType === "announcement" && (
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter announcement title" ref={titleRef} />
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter post content"
                  className="min-h-[150px]"
                  ref={contentRef}
                />
              </div>

              {/* Target audience (for instructional posts) */}
              {postType === "instructional" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Select value={school} onValueChange={setSchool}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sos">School of Science</SelectItem>
                        <SelectItem value="soe">School of Engineering</SelectItem>
                        <SelectItem value="soc">School of Computing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="se">Software Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select value={batch} onValueChange={setBatch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select value={section} onValueChange={setSection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">Section A</SelectItem>
                        <SelectItem value="b">Section B</SelectItem>
                        <SelectItem value="c">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* File upload */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
           <FileUploader
  onChange={(selectedFiles) => setFiles(selectedFiles)}
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  acceptedFileTypes={[
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]}
/>     {files.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useCreatePost } from "@/hooks/usePosts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PostType } from "@/lib/types";
import { POST_TYPES } from "@/lib/constants";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.enum(["announcement", "instructional", "public"] as const),
  target_department: z.string().optional(),
  target_batch: z.string().optional(),
  target_section: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePostFormProps {
  redirectPath: string;
  defaultType?: PostType;
}

export const CreatePostForm = ({
  redirectPath,
  defaultType = "public",
}: CreatePostFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { create, isLoading, error } = useCreatePost();
  const [showTargetFields, setShowTargetFields] = useState(
    defaultType !== "public"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: defaultType,
      target_department: user?.department || "",
      target_batch: "",
      target_section: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) return;

    // Create FormData for API
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("type", values.type);
    
    if (values.type !== "public" && values.target_department) {
      formData.append("target_department", values.target_department);
    }
    
    if (values.type === "instructional") {
      if (values.target_batch) formData.append("target_batch", values.target_batch);
      if (values.target_section) formData.append("target_section", values.target_section);
    }

    create(formData, {
      onSuccess: () => {
        toast.success("Post created successfully");
        navigate(redirectPath);
      },
      onError: (error: Error) => {
        toast.error(`Error creating post: ${error.message}`);
      },
    });
  };

  const handleTypeChange = (type: string) => {
    form.setValue("type", type as PostType);
    setShowTargetFields(type !== "public");

    // Reset target fields if switching to public
    if (type === "public") {
      form.setValue("target_department", "");
      form.setValue("target_batch", "");
      form.setValue("target_section", "");
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type</FormLabel>
                  <Select
                    onValueChange={handleTypeChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(POST_TYPES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showTargetFields && (
              <FormField
                control={form.control}
                name="target_department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter target department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("type") === "instructional" && (
              <>
                <FormField
                  control={form.control}
                  name="target_batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter target batch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter target section" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(redirectPath)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;

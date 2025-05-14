import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingOverlay } from "@/components/modals/LoadingOverlay";
import { StatusBadge } from "@/components/tables/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/user/Avatar";
import { useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import useAppToast from "@/hooks/useAppToast";
import { usePosts } from "@/hooks/usePosts";
import { ArrowLeft, Calendar, Share2, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppToast();
  const { posts: announcements, isLoading } = usePosts({
    type: "announcement",
  });
  const { isDeleteing, deleteAnnouncment } = useDeleteAnnouncement();
  if (isLoading)
    return <LoadingOverlay message="Loading..." isLoading={isLoading} />;
  const announcement = announcements.find(
    (announcement) => announcement._id === id
  );
  const handleDelete = () => {
    deleteAnnouncment(id);
  };

  const handleShare = () => {
    // Copy the URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    success({
      title: "Link Copied",
      description: "Announcement link copied to clipboard.",
    });
  };

  return (
    <LoadingOverlay isLoading={isDeleteing} message="Deleting...">
      <AppLayout
        title="Announcement Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Announcements", href: "/admin/announcements" },
          { label: "Details" },
        ]}
        allowedRoles={["admin"]}
      >
        <div className="max-w-3xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/announcements")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Announcements
          </Button>

          <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <StatusBadge status="active" />
                <h2 className="text-2xl font-bold">{announcement.title}</h2>

                <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 border-t">
              <div className="prose max-w-none text-foreground">
                {announcement.content}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t pt-4">
                <Avatar user={announcement.author} size="sm" />
                <div>
                  <p className="text-sm font-medium">
                    {announcement.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {announcement.author.title || announcement.author.role}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  {announcement.files && announcement.files.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {announcement.files.map((file, index) => {
                        const isImage = file.match(
                          /\.(jpeg|jpg|png|gif|webp)$/i
                        );
                        const isPDF = file.match(/\.pdf$/i);
                        const isPPT = file.match(/\.(ppt|pptx)$/i);

                        return (
                          <div
                            key={index}
                            className="border rounded-md p-2 bg-muted flex items-center gap-3"
                          >
                            {isImage ? (
                              <img
                                src={file}
                                alt={`announcement-file-${index}`}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-200 p-2 rounded-md">
                                  📄
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {isPDF
                                      ? "PDF File"
                                      : isPPT
                                      ? "PPT File"
                                      : "File"}
                                  </p>
                                  <a
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-xs underline"
                                  >
                                    View / Download
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end items-center gap-2 border-t pt-5 bg-muted/20">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the announcement and remove it from all users' views.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground"
                      disabled={isDeleteing}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    </LoadingOverlay>
  );
};

export default AnnouncementDetailPage;

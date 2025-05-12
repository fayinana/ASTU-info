
import { File, FileImage, FileVideo, Link } from "lucide-react";
import React from "react";

interface ResourceTypeIconProps {
  type: string;
  className?: string;
}

const ResourceTypeIcon: React.FC<ResourceTypeIconProps> = ({ type, className = "h-4 w-4" }) => {
  switch (type) {
    case "document":
      return <File className={className} />;
    case "image":
      return <FileImage className={className} />;
    case "video":
      return <FileVideo className={className} />;
    case "link":
      return <Link className={className} />;
    default:
      return <File className={className} />;
  }
};

export default ResourceTypeIcon;

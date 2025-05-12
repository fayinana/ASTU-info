
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export const Breadcrumb = ({ items, showHome = true }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center text-sm">
      {showHome && (
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <Home className="h-4 w-4" />
        </Link>
      )}
      
      {showHome && items.length > 0 && (
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;

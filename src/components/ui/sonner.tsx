
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-green-50 !text-green-800 !border-green-200",
          error: "!bg-red-50 !text-red-800 !border-red-200",
          warning: "!bg-amber-50 !text-amber-700 !border-amber-200",
          info: "!bg-blue-50 !text-blue-700 !border-blue-200",
          icon: "text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"

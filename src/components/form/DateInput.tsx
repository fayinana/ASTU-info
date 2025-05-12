
import { forwardRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface DateInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DateInput = forwardRef<HTMLButtonElement, DateInputProps>(
  ({ name, control, label, description, placeholder = "Select date", disabled = false, className = "" }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={ref}
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;

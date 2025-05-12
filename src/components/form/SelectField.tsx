
import { forwardRef } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ name, control, label, description, placeholder, options, disabled = false, className = "" }, ref) => {
    // Ensure we don't have any options with empty string values
    const processedOptions = options.map(option => {
      // If we have an empty string, replace it with a special value
      if (option.value === "") {
        return { ...option, value: "__all__" };
      }
      return option;
    });
    
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          // Handle the case where current value is an empty string
          const safeValue = field.value === "" ? "__all__" : field.value;
          
          return (
            <FormItem className={className}>
              {label && <FormLabel>{label}</FormLabel>}
              <Select
                onValueChange={(value) => {
                  // Convert "__all__" back to empty string for the form value if needed
                  const formValue = value === "__all__" ? "" : value;
                  field.onChange(formValue);
                }}
                defaultValue={safeValue}
                value={safeValue}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger ref={ref}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {processedOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;

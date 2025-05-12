
import React, { forwardRef } from "react";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface TextareaFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  control?: Control<any>;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ name, control, label, description, placeholder, rows = 3, disabled = false, className = "", value, onChange, required }, ref) => {
    // If using react-hook-form with control prop
    if (control) {
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  rows={rows}
                  disabled={disabled}
                  ref={ref}
                  required={required}
                />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    
    // If using as a controlled component
    return (
      <div className={className}>
        {label && <label className="text-sm font-medium text-gray-700 block mb-1" htmlFor={name}>{label}</label>}
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
        />
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";

export default TextareaField;


import { forwardRef } from "react";
import { 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  control?: Control<any>;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ name, control, label, description, placeholder, type = "text", disabled = false, className = "", value, onChange, required }, ref) => {
    // Only use FormField when control is provided
    if (control) {
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  type={type}
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
    
    // If using as a controlled component without react-hook-form
    return (
      <div className={className}>
        {label && <label className="text-sm font-medium text-gray-700 block mb-1" htmlFor={name}>{label}</label>}
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
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

InputField.displayName = "InputField";

export default InputField;

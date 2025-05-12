import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, File, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type FileWithPreview = File & { preview?: string };

interface FileUploaderProps {
  label?: string;
  description?: string;
  onChange?: (files: File[]) => void;
  value?: File[];
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  disabled?: boolean;
  isLoading?: boolean;
}

export const FileUploader = ({
  label,
  description,
  onChange,
  value = [],
  multiple = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes,
  disabled = false,
  isLoading = false,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }, []);

  const acceptedTypesText = useMemo(() => {
    if (!acceptedFileTypes) return "Any file type";

    const types = acceptedFileTypes.map((type) => {
      if (type.endsWith("/*")) {
        return `${type.split("/")[0]} files`;
      }
      return type.split("/").pop();
    });

    return types.join(", ");
  }, [acceptedFileTypes]);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `${file.name} exceeds maximum size of ${formatFileSize(
          maxSize
        )}`,
      };
    }

    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileType = file.type;
      const isValidType = acceptedFileTypes.some((type) => {
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.split("/")[0]);
        }
        return type === fileType;
      });

      if (!isValidType) {
        return {
          valid: false,
          error: `${file.name} has an invalid file type (${fileType})`,
        };
      }
    }

    return { valid: true };
  };

  const processFiles = (selectedFiles: File[]) => {
    if (multiple && selectedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      return [];
    }

    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push(validation.error!);
        return;
      }

      // Create preview for images
      const fileWithPreview = file;
      if (file.type.startsWith("image/")) {
        (fileWithPreview as FileWithPreview).preview =
          URL.createObjectURL(file);
      }

      validFiles.push(fileWithPreview);
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
    } else {
      setError(null);
    }

    return validFiles;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = processFiles(selectedFiles);

    if (validFiles.length === 0) return;

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    onChange?.(newFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = processFiles(acceptedFiles);

      if (validFiles.length === 0) return;

      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);
      onChange?.(newFiles);
    },
    [files, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || (multiple && files.length >= maxFiles),
    maxSize,
    accept: acceptedFileTypes
      ? Object.fromEntries(acceptedFileTypes.map((type) => [type, []]))
      : undefined,
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    const [removedFile] = newFiles.splice(index, 1);

    // Revoke object URL if it exists
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }

    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleClearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    onChange?.([]);
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? "Drop files here"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {acceptedTypesText} up to {formatFileSize(maxSize)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={disabled || (multiple && files.length >= maxFiles)}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Select Files
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hidden file input for button click */}
        <Input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept={acceptedFileTypes?.join(",")}
          disabled={disabled || (multiple && files.length >= maxFiles)}
          ref={inputRef}
        />

        {error && (
          <p className="text-sm font-medium text-destructive flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleClearAll}
                disabled={disabled}
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded">
                        <File className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground"
                    onClick={() => handleRemoveFile(index)}
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;

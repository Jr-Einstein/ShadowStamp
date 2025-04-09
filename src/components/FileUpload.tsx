
import React, { useState } from 'react';
import { UploadCloud, File, FileImage, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export default function FileUpload({ 
  onFileSelect, 
  accept = "image/*, application/pdf", 
  maxSize = 10 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Check file type
    const fileType = selectedFile.type;
    const isAcceptedType = accept.includes("*") || accept.includes(fileType);
    if (!isAcceptedType) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file of type: ${accept}`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file size
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast({
        title: "File too large",
        description: `File size should be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    simulateUpload(selectedFile);
  };
  
  // Simulate file upload with progress
  const simulateUpload = (file: File) => {
    setLoading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setLoading(false);
          onFileSelect(file);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (!file) return <UploadCloud size={48} className="text-muted-foreground" />;
    
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <FileImage size={48} className="text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FileText size={48} className="text-red-500" />; // Changed FilePdf to FileText
    } else {
      return <File size={48} className="text-muted-foreground" />;
    }
  };
  
  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-muted p-4">{getFileIcon()}</div>
          
          <div className="text-center">
            <p className="text-foreground font-medium mb-1">
              {file ? file.name : "Drag and drop your file here"}
            </p>
            <p className="text-muted-foreground text-sm">
              {file 
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                : `Supported formats: Images, PDFs (Max: ${maxSize}MB)`
              }
            </p>
          </div>
          
          {loading ? (
            <div className="w-full max-w-xs">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Processing file... {Math.round(uploadProgress)}%
              </p>
            </div>
          ) : !file ? (
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Select file
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={accept}
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setUploadProgress(0);
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Change file
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {file && !loading && (
        <div className="mt-4">
          <p className="text-sm text-green-500 flex items-center">
            <span className="inline-block mr-1">✓</span> File ready for processing
          </p>
        </div>
      )}
    </div>
  );
}

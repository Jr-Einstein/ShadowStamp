
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Check, X, Link2, FileSearch, Shield, ArrowRight, Lock, Layers, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import { VerificationResult, extractWatermark } from '@/utils/watermarkUtils';
import { extractSteganography } from '@/utils/steganographyUtils';
import VerificationVisualizer from '@/components/VerificationVisualizer';
import ARVisualizer from '@/components/ARVisualizer';

export default function Verify() {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<'watermark' | 'steganography'>('watermark');
  const [showARView, setShowARView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('extracted');
  
  const { toast } = useToast();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setExtractedMessage(null);
    setShowARView(false);
  };
  
  // Force extracted content tab to be selected when verification is successful
  useEffect(() => {
    if ((result?.isVerified && result?.originalWatermark) || extractedMessage) {
      setActiveTab('extracted');
    }
  }, [result, extractedMessage]);
  
  const handleVerify = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file to verify",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setVerificationProgress(0);
    
    // Simulate verification progress
    const progressInterval = setInterval(() => {
      setVerificationProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 200);
    
    try {
      if (verificationMethod === 'watermark') {
        // Extract watermark and verify
        const verificationResult = await extractWatermark(file, password || undefined);
        setResult(verificationResult);
        
        // Show toast notification
        if (verificationResult.isVerified) {
          toast({
            title: "Verification successful",
            description: "Document watermark is intact and verified",
            variant: "default",
          });
          
          // Check if there's AR content to display
          if (verificationResult.originalWatermark?.startsWith('http')) {
            setShowARView(true);
          }
          
          // Force the extracted content tab to be selected
          setActiveTab('extracted');
        } else {
          toast({
            title: "Verification failed",
            description: verificationResult.errorMessage || "Could not verify document integrity",
            variant: "destructive",
          });
        }
      } else {
        // Extract hidden data using steganography
        try {
          const message = await extractSteganography(file, password || undefined);
          setExtractedMessage(message);
          
          toast({
            title: "Data extracted successfully",
            description: "Hidden data was found in the file",
          });
          
          // Check if there's AR content to display
          if (message.startsWith('http')) {
            setShowARView(true);
          }
        } catch (error) {
          setExtractedMessage(null);
          toast({
            title: "Extraction failed",
            description: error instanceof Error ? error.message : "Could not extract hidden data",
            variant: "destructive",
          });
        }
      }
      
      // Complete the progress bar
      setVerificationProgress(100);
      
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setResult(null);
      setExtractedMessage(null);
    } finally {
      clearInterval(progressInterval);
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2 text-center">Verify Document</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Check document integrity and extract hidden watermarks or steganographic data
      </p>
      
      <Tabs
        defaultValue="watermark"
        value={verificationMethod}
        onValueChange={(value) => setVerificationMethod(value as 'watermark' | 'steganography')}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="watermark" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Watermark Verification</span>
          </TabsTrigger>
          <TabsTrigger value="steganography" className="flex items-center gap-2">
            <Layers size={16} />
            <span>Steganography Extraction</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="mb-8 security-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            {verificationMethod === 'watermark' ? (
              <FileSearch className="mr-2 h-5 w-5" />
            ) : (
              <Eye className="mr-2 h-5 w-5" />
            )}
            {verificationMethod === 'watermark' 
              ? "Document Verification" 
              : "Extract Hidden Data"
            }
          </CardTitle>
          <CardDescription>
            {verificationMethod === 'watermark'
              ? "Upload a document to verify its watermark and authenticity"
              : "Upload an image to extract hidden steganographic data"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload onFileSelect={handleFileSelect} />
          
          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  {verificationMethod === 'watermark' 
                    ? "Watermark Password (optional)" 
                    : "Steganography Password (optional)"
                  }
                </label>
                <div className="flex items-center space-x-2">
                  <Lock size={16} className="text-muted-foreground" />
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password if required"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying 
                  ? "Processing..." 
                  : verificationMethod === 'watermark' 
                    ? "Verify Document" 
                    : "Extract Hidden Data"
                }
              </Button>
              
              {isVerifying && (
                <div className="mt-4">
                  <Progress value={verificationProgress} className="h-2" />
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Processing... {Math.round(verificationProgress)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Watermark Verification Result */}
      {verificationMethod === 'watermark' && result && (
        <Card className={`security-border ${
          result.isVerified 
            ? "bg-green-500/10 border-green-500/20" 
            : "bg-red-500/10 border-red-500/20"
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${
              result.isVerified ? "text-green-500" : "text-red-500"
            }`}>
              {result.isVerified ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Document Authentic
                </>
              ) : (
                <>
                  <X className="mr-2 h-5 w-5" />
                  Verification Failed
                </>
              )}
            </CardTitle>
            <CardDescription>
              {result.isVerified 
                ? result.contentType === 'qr'
                  ? "This document contains a valid QR watermark"
                  : "This document contains a valid watermark"
                : "This document may have been tampered with or doesn't contain a valid watermark"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.isVerified && result.originalWatermark && (
                <div>
                  <h4 className="font-medium mb-1">Extracted Watermark:</h4>
                  <div className="bg-muted p-3 rounded-md">
                    {result.originalWatermark}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-1">Confidence Score:</h4>
                <div className="flex items-center">
                  <Progress 
                    value={result.confidenceScore ? result.confidenceScore * 100 : 0} 
                    className={`h-2 flex-grow ${
                      result.isVerified ? "bg-green-200" : "bg-red-200"
                    }`} 
                  />
                  <span className="ml-2 text-sm">
                    {result.confidenceScore 
                      ? `${(result.confidenceScore * 100).toFixed(1)}%` 
                      : "N/A"
                    }
                  </span>
                </div>
              </div>
              
              {/* Visualization components */}
              {result.frequencyData && (
                <VerificationVisualizer 
                  frequencyData={result.frequencyData}
                  detectionPoints={result.detectionPoints} 
                  originalWatermark={result.originalWatermark}
                  contentType={result.contentType}
                />
              )}
              
              {/* Show AR visualizer if appropriate watermark content is found */}
              {showARView && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">AR Content Preview:</h4>
                  <ARVisualizer 
                    arContent={result.originalWatermark}
                    isActive={showARView}
                    contentType={result.contentType === 'qr' ? 'qr' : 'text'}
                  />
                </div>
              )}
              
              {result.tamperedAreas && result.tamperedAreas.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Potential tampering detected</AlertTitle>
                  <AlertDescription>
                    We found {result.tamperedAreas.length} area(s) that may have been altered
                  </AlertDescription>
                </Alert>
              )}
              
              {result.isVerified && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Actions:</h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1">
                      <Shield className="mr-2 h-4 w-4" />
                      Generate Certificate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowARView(!showARView)}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      {showARView ? "Hide AR Content" : "View AR Content"}
                    </Button>
                  </div>
                </div>
              )}
              
              {!result.isVerified && (
                <div className="mt-6">
                  <Button variant="outline" asChild className="w-full">
                    <a href="/embed">
                      Create Authentic Document <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Steganography Extraction Result */}
      {verificationMethod === 'steganography' && extractedMessage !== null && (
        <Card className="security-border bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-500">
              <Check className="mr-2 h-5 w-5" />
              Hidden Data Extracted
            </CardTitle>
            <CardDescription>
              Successfully extracted hidden data from the document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Extracted Message:</h4>
                <div className="bg-muted p-3 rounded-md">
                  {extractedMessage}
                </div>
              </div>
              
              {/* Show AR visualizer if extracted content looks like a URL */}
              {showARView && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">AR Content Preview:</h4>
                  <ARVisualizer 
                    arContent={extractedMessage}
                    isActive={showARView}
                    contentType={extractedMessage?.startsWith('http') ? 'url' : 'text'}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowARView(!showARView)}
                    className="mt-2"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    {showARView ? "Hide AR Content" : "View AR Content"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

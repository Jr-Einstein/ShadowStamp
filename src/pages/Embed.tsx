
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Save, Lock, ArrowRight, Database, QrCode, FileText, Link2, Layers, Shield } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { WatermarkOptions, WatermarkType, embedWatermark, generateBlockchainProof } from '@/utils/watermarkUtils';
import { SteganographyOptions, embedSteganography } from '@/utils/steganographyUtils';

export default function Embed() {
  const [file, setFile] = useState<File | null>(null);
  
  // Security method selection
  const [securityMethod, setSecurityMethod] = useState<'watermark' | 'steganography'>('watermark');
  
  // Watermark options
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkContent, setWatermarkContent] = useState<string>('');
  const [watermarkAlgorithm, setWatermarkAlgorithm] = useState<'dct' | 'dwt'>('dwt');
  const [watermarkStrength, setWatermarkStrength] = useState<number>(70);
  const [watermarkPassword, setWatermarkPassword] = useState<string>('');
  
  // Steganography options
  const [steganographyMessage, setSteganographyMessage] = useState<string>('');
  const [steganographyMethod, setSteganographyMethod] = useState<'lsb' | 'dct' | 'advanced'>('lsb');
  const [steganographyQuality, setSteganographyQuality] = useState<number>(80);
  const [steganographyPassword, setSteganographyPassword] = useState<string>('');
  
  // Shared options
  const [useEncryption, setUseEncryption] = useState<boolean>(true);
  const [useBlockchain, setUseBlockchain] = useState<boolean>(true);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [blockchainData, setBlockchainData] = useState<any>(null);
  
  const { toast } = useToast();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Reset processed output
    setProcessedUrl('');
    setBlockchainData(null);
  };
  
  const handleProcess = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file to embed security features",
        variant: "destructive"
      });
      return;
    }
    
    // Content validation based on selected method
    if (securityMethod === 'watermark' && !watermarkContent) {
      toast({
        title: "No watermark content",
        description: "Please provide content for your watermark",
        variant: "destructive"
      });
      return;
    } else if (securityMethod === 'steganography' && !steganographyMessage) {
      toast({
        title: "No message to hide",
        description: "Please provide a message to hide using steganography",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let processedBlob: Blob;
      
      if (securityMethod === 'watermark') {
        // Prepare watermark options
        const options: WatermarkOptions = {
          type: watermarkType,
          content: watermarkContent,
          strength: watermarkStrength,
          algorithm: watermarkAlgorithm,
          encryption: useEncryption,
          password: watermarkPassword || undefined,
        };
        
        // Embed watermark
        processedBlob = await embedWatermark(file, options);
      } else {
        // Prepare steganography options
        const options: SteganographyOptions = {
          message: steganographyMessage,
          method: steganographyMethod,
          quality: steganographyQuality,
          password: steganographyPassword || undefined,
        };
        
        // Embed using steganography
        processedBlob = await embedSteganography(file, options);
      }
      
      // Generate blockchain proof if enabled
      if (useBlockchain) {
        const blockchainProof = await generateBlockchainProof(file);
        setBlockchainData(blockchainProof);
      }
      
      // Create URL for the processed file
      const url = URL.createObjectURL(processedBlob);
      setProcessedUrl(url);
      
      toast({
        title: securityMethod === 'watermark' 
          ? "Watermark embedded successfully" 
          : "Data hidden successfully",
        description: "Your file is ready to download",
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedUrl) return;
    
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `secured-${file?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2 text-center">ShadowStamp Security</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Protect your documents with invisible, AI-powered security features
      </p>
      
      <Tabs 
        defaultValue="watermark" 
        value={securityMethod} 
        onValueChange={(value) => setSecurityMethod(value as 'watermark' | 'steganography')}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="watermark" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Watermarking</span>
          </TabsTrigger>
          <TabsTrigger value="steganography" className="flex items-center gap-2">
            <Layers size={16} />
            <span>Steganography</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="mb-8 security-border">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            {securityMethod === 'watermark'
              ? "Supported formats: images (.jpg, .png) and documents (.pdf)"
              : "Supported formats: images (.jpg, .png)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onFileSelect={handleFileSelect} 
            accept={securityMethod === 'watermark' 
              ? "image/*, application/pdf" 
              : "image/*"
            } 
          />
        </CardContent>
      </Card>
      
      {file && securityMethod === 'watermark' && (
        <Card className="mb-8 security-border">
          <CardHeader>
            <CardTitle>Watermark Configuration</CardTitle>
            <CardDescription>
              Configure how you want to protect your document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" onValueChange={(value) => setWatermarkType(value as WatermarkType)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>Text</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <QrCode size={16} />
                  <span>QR Code</span>
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center gap-1">
                  <Link2 size={16} />
                  <span>AR Link</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text-watermark">Watermark Text</Label>
                    <Input
                      id="text-watermark"
                      placeholder="Enter text to embed as watermark"
                      value={watermarkContent}
                      onChange={(e) => setWatermarkContent(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="image">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-content">QR Code Content</Label>
                    <Input
                      id="qr-content"
                      placeholder="Enter URL or text for QR Code"
                      value={watermarkContent}
                      onChange={(e) => setWatermarkContent(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This will generate and embed a QR code with your content
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="link">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ar-link">AR Content URL</Label>
                    <Input
                      id="ar-link"
                      placeholder="https://example.com/ar-content"
                      value={watermarkContent}
                      onChange={(e) => setWatermarkContent(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Link to AR content that will be revealed on verification
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <div className="space-y-6 mt-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Algorithm</Label>
                  </div>
                  <RadioGroup value={watermarkAlgorithm} onValueChange={(value) => setWatermarkAlgorithm(value as 'dct' | 'dwt')} className="flex space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dct" id="dct" />
                      <Label htmlFor="dct">DCT (Better for images)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dwt" id="dwt" />
                      <Label htmlFor="dwt">DWT (Better for documents)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Watermark Strength: {watermarkStrength}%</Label>
                  </div>
                  <Slider
                    value={[watermarkStrength]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(values) => setWatermarkStrength(values[0])}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher strength is more resistant but may affect quality
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="watermark-password">Password Protection (Optional)</Label>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <Lock size={16} className="text-muted-foreground" />
                    <Input
                      id="watermark-password"
                      type="password"
                      placeholder="Add password to protect watermark"
                      value={watermarkPassword}
                      onChange={(e) => setWatermarkPassword(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    If set, this password will be required to verify the watermark
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="encryption">Encrypt Watermark</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an additional layer of security
                      </p>
                    </div>
                    <Switch
                      id="encryption"
                      checked={useEncryption}
                      onCheckedChange={setUseEncryption}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="blockchain">Blockchain Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Register document fingerprint on blockchain
                      </p>
                    </div>
                    <Switch
                      id="blockchain"
                      checked={useBlockchain}
                      onCheckedChange={setUseBlockchain}
                    />
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {file && securityMethod === 'steganography' && (
        <Card className="mb-8 security-border">
          <CardHeader>
            <CardTitle>Steganography Configuration</CardTitle>
            <CardDescription>
              Hide data within your image that is invisible to the human eye
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="steg-message">Message to Hide</Label>
                <textarea
                  id="steg-message"
                  placeholder="Enter text to hide within the image"
                  value={steganographyMessage}
                  onChange={(e) => setSteganographyMessage(e.target.value)}
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Steganography Method</Label>
                <RadioGroup 
                  value={steganographyMethod} 
                  onValueChange={(value) => setSteganographyMethod(value as 'lsb' | 'dct' | 'advanced')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lsb" id="lsb" />
                    <Label htmlFor="lsb">LSB (Least Significant Bit) - Basic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dct" id="steg-dct" />
                    <Label htmlFor="steg-dct">DCT (Discrete Cosine Transform) - Advanced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced (Multiple Techniques) - Most Secure</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Quality/Security Balance: {steganographyQuality}%</Label>
                </div>
                <Slider
                  value={[steganographyQuality]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(values) => setSteganographyQuality(values[0])}
                  className="mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Higher quality preserves image details but may reduce security
                </p>
              </div>
              
              <div>
                <Label htmlFor="steg-password">Password Protection (Optional)</Label>
                <div className="flex items-center space-x-2 mt-1.5">
                  <Lock size={16} className="text-muted-foreground" />
                  <Input
                    id="steg-password"
                    type="password"
                    placeholder="Add password to protect hidden data"
                    value={steganographyPassword}
                    onChange={(e) => setSteganographyPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  If set, this password will be required to extract the hidden data
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="steg-blockchain">Blockchain Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Register file fingerprint on blockchain for verification
                  </p>
                </div>
                <Switch
                  id="steg-blockchain"
                  checked={useBlockchain}
                  onCheckedChange={setUseBlockchain}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {file && (
        <div className="flex justify-center">
          <Button 
            onClick={handleProcess}
            disabled={isProcessing || (securityMethod === 'watermark' && !watermarkContent) || (securityMethod === 'steganography' && !steganographyMessage)}
            className="px-8"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : securityMethod === 'watermark' ? (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Embed Watermark
              </>
            ) : (
              <>
                <Layers className="mr-2 h-4 w-4" />
                Hide Data
              </>
            )}
          </Button>
        </div>
      )}
      
      {processedUrl && (
        <Card className="mt-10 security-border bg-muted/30 shadow-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-green-500" />
              Document Secured
            </CardTitle>
            <CardDescription>
              {securityMethod === 'watermark' 
                ? "Your document has been successfully watermarked" 
                : "Your data has been successfully hidden in the image"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              {file && file.type.startsWith('image/') ? (
                <div className="relative border border-border rounded-md overflow-hidden">
                  <img 
                    src={processedUrl} 
                    alt="Processed document" 
                    className="w-full h-auto max-h-60 object-contain bg-black/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/20 px-3 py-1 rounded-full text-white text-sm font-medium">
                      {securityMethod === 'watermark' ? "Watermarked" : "Data Hidden"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-md p-4 flex items-center justify-center bg-black/5">
                  <p className="text-center text-muted-foreground">
                    {file?.name} has been processed successfully
                  </p>
                </div>
              )}
            </div>
            
            {blockchainData && (
              <div className="mb-4 space-y-3">
                <Label>Blockchain Verification Data</Label>
                <div className="bg-muted rounded-md p-3 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Transaction Hash:</span>
                    <div className="font-mono text-xs break-all mt-1">{blockchainData.hash}</div>
                  </div>
                  <div>
                    <span className="font-medium">Block Number:</span>
                    <div className="font-mono">{blockchainData.blockNumber}</div>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span>
                    <div>{new Date(blockchainData.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={handleDownload} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> 
                Download Secured Document
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link to="/verify">
                  Verify Document <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

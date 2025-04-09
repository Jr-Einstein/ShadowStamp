
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, FileText, Image, Database, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About ShadowStamp Technology</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Understanding the advanced technology behind our invisible watermarking solution
          </p>
          
          <div className="prose prose-invert max-w-none">
            <p>
              ShadowStamp uses cutting-edge digital watermarking techniques to embed invisible data within your documents and images. 
              Our technology is based on frequency domain transformations that make the watermarks robust against common manipulations 
              while remaining invisible to the naked eye.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Core Technologies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-12">
              <Card className="security-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-shadow" />
                    <CardTitle>Discrete Cosine Transform (DCT)</CardTitle>
                  </div>
                  <CardDescription>
                    Frequency domain watermarking for images
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    DCT transforms spatial image data into frequency coefficients. Our algorithm embeds watermark data by 
                    modifying mid-range frequency coefficients, which are less perceptible to human vision but survive 
                    common image processing operations like compression.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="security-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-shadow" />
                    <CardTitle>Discrete Wavelet Transform (DWT)</CardTitle>
                  </div>
                  <CardDescription>
                    Multi-resolution watermarking for documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    DWT decomposes images into different frequency sub-bands, allowing more sophisticated watermark embedding. 
                    This technique provides excellent robustness against geometric transformations and is particularly 
                    suitable for document watermarking.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Blockchain Verification</h2>
            <p>
              ShadowStamp leverages blockchain technology to create immutable records of document fingerprints.
              When a document is watermarked, a unique hash is generated and recorded on the blockchain, providing
              an additional layer of verification that cannot be tampered with.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Augmented Reality Integration</h2>
            <p>
              Our AR feature takes document verification to the next level. When a watermarked document is scanned:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The hidden watermark is extracted and decoded</li>
              <li>If the watermark contains AR content (video, 3D model, or interactive elements), it's rendered in real-time</li>
              <li>Users can interact with the AR content through their device's camera</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Security Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 mb-12">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Tamper Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Our algorithms can detect if a document has been modified after watermarking by analyzing the integrity of the embedded data.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Watermark data can be encrypted before embedding, ensuring that only authorized parties can extract and interpret the hidden information.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Redundancy</h3>
                <p className="text-sm text-muted-foreground">
                  Critical watermark data is embedded multiple times throughout the document to ensure survival even if parts of the document are damaged.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Forensic Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  If tampering is detected, our system can identify the specific regions that have been modified.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center">
            <h2 className="text-2xl font-bold mb-4">Experience ShadowStamp For Yourself</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="px-6">
                <Link to="/embed">
                  <FileText className="mr-2 h-4 w-4" />
                  Secure a Document
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/verify">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify a Document
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

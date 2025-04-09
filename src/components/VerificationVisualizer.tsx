
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ScatterChart, 
  Scatter, 
  ZAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, AudioWaveform, BarChart3 } from 'lucide-react';

interface VerificationVisualizerProps {
  frequencyData?: {
    original: number[];
    modified: number[];
  };
  detectionPoints?: {
    x: number;
    y: number;
    confidence: number;
  }[];
  originalWatermark?: string;
  contentType?: 'text' | 'qr' | 'link';
}

const VerificationVisualizer: React.FC<VerificationVisualizerProps> = ({
  frequencyData,
  detectionPoints,
  originalWatermark,
  contentType = 'text'
}) => {
  // Generate QR code for the watermark content
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('frequency');

  useEffect(() => {
    // Generate QR code if we have watermark content or if it's a QR/link type
    if (originalWatermark && (contentType === 'qr' || contentType === 'link' || 
        originalWatermark.startsWith('http') || originalWatermark.includes('www.'))) {
      generateQrCode(originalWatermark);
    }
  }, [originalWatermark, contentType]);

  const generateQrCode = async (content: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(content, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 250,
        color: {
          dark: '#6e59a5',
          light: '#FFFFFF',
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // Transform frequency data for the chart
  const frequencyChartData = frequencyData ? 
    frequencyData.original.map((val, index) => ({
      index,
      original: val,
      modified: frequencyData.modified[index]
    })) : [];

  const isQrContent = contentType === 'qr' || originalWatermark?.startsWith('http') || originalWatermark?.includes('www.');

  // Automatically set active tab to 'extracted' if we have original watermark data
  useEffect(() => {
    if (originalWatermark && !activeTab) {
      setActiveTab('extracted');
    }
  }, [originalWatermark]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="frequency" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="frequency" className="flex items-center gap-2">
            <AudioWaveform size={16} />
            <span>Frequency Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Detection Heatmap</span>
          </TabsTrigger>
          <TabsTrigger 
            value="extracted" 
            className="flex items-center gap-2" 
            disabled={!originalWatermark}
          >
            <QrCode size={16} />
            <span>Extracted Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frequency">
          {frequencyData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Frequency Analysis</CardTitle>
                <CardDescription>
                  Comparison of frequency distributions in the document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={frequencyChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="index" 
                        label={{ value: 'Frequency Band', position: 'insideBottomRight', offset: -10 }}
                      />
                      <YAxis 
                        label={{ value: 'Magnitude', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend />
                      <Line 
                        name="Original Frequency" 
                        type="monotone" 
                        dataKey="original" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line 
                        name="Modified Frequency" 
                        type="monotone" 
                        dataKey="modified" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  This graph shows differences in frequency spectrum between original and watermarked document. 
                  Significant deviations could indicate tampering or modifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap">
          {detectionPoints && detectionPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Detection Heatmap</CardTitle>
                <CardDescription>
                  Areas where watermark or hidden data was detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Position X" 
                        unit="%"
                        label={{ value: 'Horizontal Position (X)', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Position Y" 
                        unit="%"
                        label={{ value: 'Vertical Position (Y)', angle: -90, position: 'insideLeft' }}
                      />
                      <ZAxis type="number" dataKey="confidence" name="Confidence" range={[20, 100]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value: any, name: string) => {
                          if (name === 'Confidence') {
                            return [`${(value * 100).toFixed(1)}%`, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Scatter 
                        name="Detection Points" 
                        data={detectionPoints} 
                        fill="#ff7300" 
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  The heatmap shows document areas with detected watermark data. Higher density areas 
                  indicate stronger watermark presence or possible tampering.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="extracted">
          {originalWatermark && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Extracted Content</CardTitle>
                <CardDescription>
                  {isQrContent 
                    ? "QR code watermark extracted from the document" 
                    : "Watermark content extracted from the document"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  {isQrContent && qrCodeDataUrl ? (
                    <div className="text-center">
                      <div className="mb-4 border p-2 rounded-md inline-block bg-white">
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code for extracted content"
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-sm font-medium mb-2">Scan to visit URL:</p>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono break-all">
                        {originalWatermark}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted p-4 rounded-md w-full">
                      <h3 className="font-medium mb-2">Extracted Text Content:</h3>
                      <div className="font-mono text-sm whitespace-pre-wrap">
                        {originalWatermark}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationVisualizer;

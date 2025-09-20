'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  File, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Share
} from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'markdown' | 'html' | 'json';
  includeScores: boolean;
  includeSources: boolean;
  includeAnalysis: boolean;
  customTitle?: string;
  metadata?: {
    author?: string;
    description?: string;
    tags?: string[];
  };
}

interface ExportResult {
  filename: string;
  downloadUrl?: string;
  content?: string;
  size: number;
  generatedAt: Date;
}

interface ExportDialogProps {
  sessionId: string;
  sessionTitle: string;
  onClose?: () => void;
}

export default function ExportDialog({ sessionId, sessionTitle, onClose }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeScores: true,
    includeSources: true,
    includeAnalysis: false,
    customTitle: '',
    metadata: {
      author: '',
      description: '',
      tags: []
    }
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const formats = [
    { 
      value: 'pdf', 
      label: 'PDF Document', 
      icon: <FileText className="h-4 w-4" />,
      description: 'Professional document with formatting'
    },
    { 
      value: 'markdown', 
      label: 'Markdown', 
      icon: <File className="h-4 w-4" />,
      description: 'Plain text with markdown formatting'
    },
    { 
      value: 'html', 
      label: 'HTML Page', 
      icon: <Globe className="h-4 w-4" />,
      description: 'Web page with styling'
    },
    { 
      value: 'json', 
      label: 'JSON Data', 
      icon: <File className="h-4 w-4" />,
      description: 'Raw data for further processing'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`/api/exports/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      clearInterval(progressInterval);
      setExportProgress(100);

      const data = await response.json();
      
      if (data.success) {
        setExportResult(data.data);
        
        // Auto-download for certain formats
        if (options.format === 'pdf' && data.data.downloadUrl) {
          window.open(data.data.downloadUrl, '_blank');
        }
      } else {
        setError(data.error || 'Export failed');
      }
    } catch (err: any) {
      setError(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = () => {
    if (exportResult?.downloadUrl) {
      window.open(exportResult.downloadUrl, '_blank');
    } else if (exportResult?.content) {
      // Create blob and download
      const blob = new Blob([exportResult.content], { 
        type: getContentType(options.format) 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportResult.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getContentType = (format: string) => {
    switch (format) {
      case 'pdf': return 'application/pdf';
      case 'markdown': return 'text/markdown';
      case 'html': return 'text/html';
      case 'json': return 'application/json';
      default: return 'text/plain';
    }
  };

  const copyToClipboard = async () => {
    if (exportResult?.content) {
      try {
        await navigator.clipboard.writeText(exportResult.content);
        // Show toast or feedback
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (exportResult) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Export Complete
          </CardTitle>
          <CardDescription>
            Your debate transcript has been exported successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{exportResult.filename}</span>
              <Badge variant="outline">{options.format.toUpperCase()}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(exportResult.size)} • Generated {new Date(exportResult.generatedAt).toLocaleTimeString()}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadFile} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            {exportResult.content && (
              <Button onClick={copyToClipboard} variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </div>

          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="w-full"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Debate Transcript
        </CardTitle>
        <CardDescription>
          Export "{sessionTitle}" in your preferred format
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isExporting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="font-medium">Generating Export...</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
            <div className="text-sm text-blue-600 mt-1">
              {exportProgress < 30 && "Analyzing debate content..."}
              {exportProgress >= 30 && exportProgress < 60 && "Processing arguments and scores..."}
              {exportProgress >= 60 && exportProgress < 90 && "Formatting document..."}
              {exportProgress >= 90 && "Finalizing export..."}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Export Failed</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Format Selection */}
        <div className="space-y-3">
          <Label>Export Format</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formats.map((format) => (
              <Card 
                key={format.value}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  options.format === format.value 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
                onClick={() => setOptions(prev => ({ ...prev, format: format.value as any }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {format.icon}
                    <div>
                      <div className="font-medium text-sm">{format.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Options */}
        <div className="space-y-3">
          <Label>Include in Export</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scores"
                checked={options.includeScores}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeScores: !!checked }))
                }
              />
              <Label htmlFor="scores" className="text-sm">
                Argument Scores & Ratings
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sources"
                checked={options.includeSources}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeSources: !!checked }))
                }
              />
              <Label htmlFor="sources" className="text-sm">
                Source References
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="analysis"
                checked={options.includeAnalysis}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeAnalysis: !!checked }))
                }
              />
              <Label htmlFor="analysis" className="text-sm">
                AI Analysis & Feedback
              </Label>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Custom Title (Optional)</Label>
            <Input
              id="title"
              placeholder={`Debate: ${sessionTitle}`}
              value={options.customTitle}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                customTitle: e.target.value 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author (Optional)</Label>
            <Input
              id="author"
              placeholder="Your name"
              value={options.metadata?.author || ''}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                metadata: { ...prev.metadata, author: e.target.value }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this debate..."
              value={options.metadata?.description || ''}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                metadata: { ...prev.metadata, description: e.target.value }
              }))}
              rows={2}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
          
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
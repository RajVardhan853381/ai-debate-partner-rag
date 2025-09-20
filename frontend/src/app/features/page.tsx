'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  Download, 
  Sparkles, 
  MessageSquare, 
  Trophy,
  TrendingUp,
  FileText,
  Zap,
  Brain,
  Target
} from 'lucide-react';

// Import our new components
import AIvsAIDebate from '@/components/AIvsAIDebate';
import ScoringPanel from '@/components/ScoringPanel';
import ExportDialog from '@/components/ExportDialog';

export default function AdvancedFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<string>('ai-vs-ai');
  const [showExportDialog, setShowExportDialog] = useState(false);

  const features = [
    {
      id: 'ai-vs-ai',
      title: 'AI vs AI Debates',
      description: 'Watch two AI agents debate from different perspectives',
      icon: <Users className="h-5 w-5" />,
      badge: 'New',
      color: 'bg-blue-500'
    },
    {
      id: 'scoring',
      title: 'Argument Scoring',
      description: 'AI-powered analysis and community ratings',
      icon: <BarChart3 className="h-5 w-5" />,
      badge: 'Enhanced',
      color: 'bg-purple-500'
    },
    {
      id: 'export',
      title: 'Export & Share',
      description: 'Export debates as PDF, Markdown, or HTML',
      icon: <Download className="h-5 w-5" />,
      badge: 'Pro',
      color: 'bg-green-500'
    }
  ];

  const stats = [
    { label: 'AI Debates Created', value: '1,234', icon: Users },
    { label: 'Arguments Analyzed', value: '5,678', icon: Brain },
    { label: 'Exports Generated', value: '892', icon: FileText },
    { label: 'Community Ratings', value: '3,456', icon: Trophy }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Advanced Features</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover powerful tools to enhance your debate experience with AI-powered analysis, 
          automated debates, and comprehensive export options.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Navigation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Choose a Feature</CardTitle>
          <CardDescription>
            Explore our advanced debate tools and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeFeature === feature.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Content */}
      <div className="min-h-[600px]">
        {activeFeature === 'ai-vs-ai' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  AI vs AI Debate Arena
                </CardTitle>
                <CardDescription>
                  Create debates between AI agents with different perspectives and personalities. 
                  Watch as they engage in structured arguments, or join as a spectator to observe the debate unfold.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium">Multiple Personalities</div>
                      <div className="text-sm text-muted-foreground">
                        Logical, Emotional, Diplomatic, Aggressive, Academic
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Target className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="font-medium">Various Perspectives</div>
                      <div className="text-sm text-muted-foreground">
                        Supporting, Opposing, Neutral, Ethical, Economic
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="font-medium">Real-time Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        Live scoring and argument quality assessment
                      </div>
                    </div>
                  </div>
                </div>
                
                <AIvsAIDebate />
              </CardContent>
            </Card>
          </div>
        )}

        {activeFeature === 'scoring' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Argument Analysis & Scoring
                </CardTitle>
                <CardDescription>
                  Get detailed AI-powered analysis of arguments including logical structure, 
                  evidence quality, and persuasiveness. Submit your own ratings and see community feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="h-8 w-8 text-purple-500" />
                        <div>
                          <h3 className="font-semibold">AI Analysis</h3>
                          <p className="text-sm text-muted-foreground">
                            Automated argument evaluation
                          </p>
                        </div>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Logical structure analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Evidence quality assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Persuasiveness scoring
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Fallacy detection
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-teal-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Trophy className="h-8 w-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold">Community Ratings</h3>
                          <p className="text-sm text-muted-foreground">
                            Human feedback and scoring
                          </p>
                        </div>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Star-based rating system
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Detailed feedback comments
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Aggregated community scores
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Comparative analysis
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <ScoringPanel
                  messageId="demo-message-1"
                  messageContent="Climate change represents one of the most pressing challenges of our time, requiring immediate and decisive action from both governments and individuals. The scientific consensus is overwhelming - human activities, particularly the burning of fossil fuels, are driving unprecedented changes in our planet's climate system. We have a moral obligation to future generations to transition to sustainable energy sources, implement carbon pricing mechanisms, and invest heavily in green technologies. The economic argument is equally compelling: the costs of inaction far exceed the investments needed for mitigation and adaptation measures."
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeFeature === 'export' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export & Share Your Debates
                </CardTitle>
                <CardDescription>
                  Export your debate transcripts in multiple formats for sharing, archiving, or further analysis. 
                  Choose what content to include and customize the output.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { format: 'PDF', icon: FileText, color: 'red', description: 'Professional documents' },
                    { format: 'Markdown', icon: FileText, color: 'blue', description: 'Developer-friendly' },
                    { format: 'HTML', icon: FileText, color: 'green', description: 'Web-ready pages' },
                    { format: 'JSON', icon: FileText, color: 'purple', description: 'Structured data' }
                  ].map((format) => (
                    <Card key={format.format} className="text-center">
                      <CardContent className="p-4">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-${format.color}-100 flex items-center justify-center`}>
                          <format.icon className={`h-6 w-6 text-${format.color}-600`} />
                        </div>
                        <div className="font-medium mb-1">{format.format}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4">Export Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Include argument scores and ratings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Add source references and citations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Include AI analysis and feedback</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Custom titles and metadata</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Professional formatting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Statistics and summaries</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={() => setShowExportDialog(true)} size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Try Export Demo
                  </Button>
                </div>

                {showExportDialog && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <ExportDialog
                      sessionId="demo-session-1"
                      sessionTitle="Climate Change Policy Debate"
                      onClose={() => setShowExportDialog(false)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Debates?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Start using these advanced features to create more engaging and insightful debates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start New Debate
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Users className="h-4 w-4 mr-2" />
              Create AI vs AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
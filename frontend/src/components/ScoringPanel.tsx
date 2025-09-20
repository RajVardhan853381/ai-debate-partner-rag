'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, BarChart3, TrendingUp, Award, MessageSquare, Brain, Target, Zap } from 'lucide-react';

interface ArgumentScore {
  id: string;
  messageId: string;
  userId: string;
  relevance: number;
  persuasiveness: number;
  logicalStrength: number;
  overallScore: number;
  feedback?: string;
  createdAt: Date;
}

interface ArgumentAnalysis {
  id: string;
  messageId: string;
  logicalStructure: {
    hasClaim: boolean;
    hasEvidence: boolean;
    hasReasoning: boolean;
    logicalFallacies: string[];
    coherence: number;
    score: number;
  };
  evidenceQuality: {
    sources: number;
    credibility: number;
    relevance: number;
    sufficiency: number;
    score: number;
  };
  persuasiveness: {
    emotionalAppeal: number;
    clarity: number;
    impact: number;
    counterArgumentHandling: number;
    score: number;
  };
  overallScore: number;
  feedback: string;
  createdAt: Date;
}

interface ScoringPanelProps {
  messageId: string;
  messageContent: string;
  onScoreSubmitted?: (score: ArgumentScore) => void;
}

export default function ScoringPanel({ messageId, messageContent, onScoreSubmitted }: ScoringPanelProps) {
  const [userScore, setUserScore] = useState({
    relevance: 3,
    persuasiveness: 3,
    logicalStrength: 3,
    overallScore: 3,
    feedback: ''
  });
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [existingScores, setExistingScores] = useState<ArgumentScore[]>([]);
  const [averageScore, setAverageScore] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserScored, setHasUserScored] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, [messageId]);

  const loadExistingData = async () => {
    try {
      // Load existing scores
      const scoresResponse = await fetch(`/api/scoring/${messageId}`);
      const scoresData = await scoresResponse.json();
      
      if (scoresData.success) {
        setExistingScores(scoresData.data.scores);
        setAverageScore(scoresData.data.average);
        
        // Check if current user has already scored
        // This would need user context
        setHasUserScored(false); // Placeholder
      }
    } catch (error) {
      console.error('Error loading scoring data:', error);
    }
  };

  const analyzeArgument = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/scoring/analyze/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'temp' }) // Would need actual session ID
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error('Error analyzing argument:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitUserScore = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/scoring/rate/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userScore)
      });

      const data = await response.json();
      if (data.success) {
        setHasUserScored(true);
        await loadExistingData(); // Refresh data
        onScoreSubmitted?.(data.data);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${
            star <= value 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => !disabled && onChange(star)}
        />
      ))}
    </div>
  );

  const ScoreDisplay = ({ label, value, maxValue, color, icon }: { 
    label: string; 
    value: number; 
    maxValue: number; 
    color: string; 
    icon: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {value.toFixed(1)}/{maxValue}
        </span>
      </div>
      <Progress 
        value={(value / maxValue) * 100} 
        className={`h-2 ${color}`}
      />
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Argument Analysis & Scoring
        </CardTitle>
        <CardDescription>
          Rate this argument and view AI-powered analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="rate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rate">Rate Argument</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="community">Community Scores</TabsTrigger>
          </TabsList>

          {/* User Rating Tab */}
          <TabsContent value="rate" className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Argument to Rate:</h4>
              <p className="text-sm leading-relaxed">
                {messageContent.slice(0, 300)}
                {messageContent.length > 300 && '...'}
              </p>
            </div>

            {!hasUserScored ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Relevance
                    </Label>
                    <StarRating 
                      value={userScore.relevance}
                      onChange={(value) => setUserScore(prev => ({ ...prev, relevance: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      How relevant is this argument to the topic?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Persuasiveness
                    </Label>
                    <StarRating 
                      value={userScore.persuasiveness}
                      onChange={(value) => setUserScore(prev => ({ ...prev, persuasiveness: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      How convincing is this argument?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Logical Strength
                    </Label>
                    <StarRating 
                      value={userScore.logicalStrength}
                      onChange={(value) => setUserScore(prev => ({ ...prev, logicalStrength: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      How sound is the logical reasoning?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Overall Score
                    </Label>
                    <StarRating 
                      value={userScore.overallScore}
                      onChange={(value) => setUserScore(prev => ({ ...prev, overallScore: value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Overall quality of the argument
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Feedback (Optional)</Label>
                  <Textarea
                    placeholder="Provide specific feedback about this argument's strengths and weaknesses..."
                    value={userScore.feedback}
                    onChange={(e) => setUserScore(prev => ({ ...prev, feedback: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={submitUserScore} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-medium mb-2">Thank you for rating!</h3>
                <p className="text-sm text-muted-foreground">
                  You have already rated this argument. Check out the community scores to see how others rated it.
                </p>
              </div>
            )}
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {!analysis ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="font-medium mb-2">AI Argument Analysis</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Get detailed AI-powered analysis of this argument's structure, evidence quality, and persuasiveness.
                </p>
                <Button onClick={analyzeArgument} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Argument'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {analysis.overallScore.toFixed(1)}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                    
                    <div className="space-y-4">
                      <ScoreDisplay
                        label="Logical Structure"
                        value={analysis.logicalStructure.score}
                        maxValue={10}
                        color="bg-blue-500"
                        icon={<Brain className="h-4 w-4 text-blue-500" />}
                      />
                      
                      <ScoreDisplay
                        label="Evidence Quality"
                        value={analysis.evidenceQuality.score}
                        maxValue={10}
                        color="bg-green-500"
                        icon={<Target className="h-4 w-4 text-green-500" />}
                      />
                      
                      <ScoreDisplay
                        label="Persuasiveness"
                        value={analysis.persuasiveness.score}
                        maxValue={10}
                        color="bg-purple-500"
                        icon={<Zap className="h-4 w-4 text-purple-500" />}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Logical Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Has Clear Claim:</span>
                        <Badge variant={analysis.logicalStructure.hasClaim ? "default" : "secondary"}>
                          {analysis.logicalStructure.hasClaim ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Has Evidence:</span>
                        <Badge variant={analysis.logicalStructure.hasEvidence ? "default" : "secondary"}>
                          {analysis.logicalStructure.hasEvidence ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Coherence:</span>
                        <span>{analysis.logicalStructure.coherence}/10</span>
                      </div>
                      {analysis.logicalStructure.logicalFallacies.length > 0 && (
                        <div>
                          <span className="text-red-500">Fallacies:</span>
                          <ul className="list-disc list-inside mt-1">
                            {analysis.logicalStructure.logicalFallacies.map((fallacy, i) => (
                              <li key={i} className="text-red-500">{fallacy}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Evidence Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Sources:</span>
                        <span>{analysis.evidenceQuality.sources}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credibility:</span>
                        <span>{analysis.evidenceQuality.credibility}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Relevance:</span>
                        <span>{analysis.evidenceQuality.relevance}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sufficiency:</span>
                        <span>{analysis.evidenceQuality.sufficiency}/10</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Persuasiveness</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Emotional Appeal:</span>
                        <span>{analysis.persuasiveness.emotionalAppeal}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clarity:</span>
                        <span>{analysis.persuasiveness.clarity}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Impact:</span>
                        <span>{analysis.persuasiveness.impact}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Counter-Arguments:</span>
                        <span>{analysis.persuasiveness.counterArgumentHandling}/10</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{analysis.feedback}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Community Scores Tab */}
          <TabsContent value="community" className="space-y-6">
            {averageScore ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Community Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {averageScore.averageRelevance.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Relevance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {averageScore.averagePersuasiveness.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Persuasiveness</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {averageScore.averageLogicalStrength.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Logic</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {averageScore.averageOverall.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Overall</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Based on {averageScore.totalRatings} rating{averageScore.totalRatings !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                </Card>

                {existingScores.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Community Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {existingScores.slice(0, 5).map((score) => (
                          <div key={score.id} className="border-l-2 border-blue-200 pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= score.overallScore
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(score.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {score.feedback && (
                              <p className="text-xs text-muted-foreground">
                                "{score.feedback}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-medium mb-2">No Community Scores Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Be the first to rate this argument!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
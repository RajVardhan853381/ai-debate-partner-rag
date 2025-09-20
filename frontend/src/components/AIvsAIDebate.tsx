'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Square, Users, Trophy, MessageSquare, BarChart3 } from 'lucide-react';

interface AIParticipant {
  id: string;
  name: string;
  perspective: string;
  personality: string;
  wins: number;
  totalDebates: number;
}

interface AIDebateSession {
  id: string;
  topic: string;
  participants: AIParticipant[];
  maxRounds: number;
  currentRound: number;
  status: 'active' | 'completed' | 'paused';
  winner?: string;
  spectators?: string[];
  scores?: {
    participant1: number;
    participant2: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface DebateMessage {
  id: string;
  content: string;
  aiParticipantName: string;
  roundNumber: number;
  argumentScore?: {
    logic: number;
    evidence: number;
    persuasiveness: number;
    overall: number;
  };
  createdAt: Date;
}

export default function AIvsAIDebate() {
  const [session, setSession] = useState<AIDebateSession | null>(null);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  
  // Setup form state
  const [topic, setTopic] = useState('');
  const [participant1, setParticipant1] = useState({
    name: 'AI Advocate',
    perspective: 'for',
    personality: 'logical'
  });
  const [participant2, setParticipant2] = useState({
    name: 'AI Critic', 
    perspective: 'against',
    personality: 'diplomatic'
  });
  const [maxRounds, setMaxRounds] = useState(5);

  const perspectives = [
    { value: 'for', label: 'Supporting' },
    { value: 'against', label: 'Opposing' },
    { value: 'neutral', label: 'Neutral Analysis' },
    { value: 'economic', label: 'Economic Focus' },
    { value: 'ethical', label: 'Ethical Focus' },
    { value: 'legal', label: 'Legal Focus' },
    { value: 'scientific', label: 'Scientific Focus' }
  ];

  const personalities = [
    { value: 'logical', label: 'Logical & Analytical' },
    { value: 'emotional', label: 'Emotional & Persuasive' },
    { value: 'aggressive', label: 'Assertive & Direct' },
    { value: 'diplomatic', label: 'Diplomatic & Balanced' },
    { value: 'academic', label: 'Academic & Scholarly' }
  ];

  const createDebate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-debates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          participant1,
          participant2,
          maxRounds
        })
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating AI debate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runNextRound = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai-debates/${session.id}/next-round`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data.sessionUpdated);
        setMessages(prev => [...prev, ...data.data.messages]);
      }
    } catch (error) {
      console.error('Error running next round:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutomatedDebate = async () => {
    if (!session) return;

    setIsLoading(true);
    setIsWatching(true);
    
    try {
      const response = await fetch(`/api/ai-debates/${session.id}/start-automated`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data.session);
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Error running automated debate:', error);
    } finally {
      setIsLoading(false);
      setIsWatching(false);
    }
  };

  const joinAsSpectator = async () => {
    if (!session) return;

    try {
      await fetch(`/api/ai-debates/${session.id}/spectate`, {
        method: 'POST'
      });
      // Update spectator count if needed
    } catch (error) {
      console.error('Error joining as spectator:', error);
    }
  };

  const getParticipantColor = (participantName: string) => {
    return participantName === session?.participants[0].name ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
  };

  const getParticipantBadge = (participantName: string) => {
    return participantName === session?.participants[0].name ? 'bg-blue-500' : 'bg-green-500';
  };

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Create AI vs AI Debate
            </CardTitle>
            <CardDescription>
              Watch two AI participants debate any topic with different perspectives and personalities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Debate Topic</Label>
              <Input
                id="topic"
                placeholder="Enter a debate topic (e.g., 'Should artificial intelligence replace human decision-making in healthcare?')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Participant 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={participant1.name}
                      onChange={(e) => setParticipant1(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="AI Advocate"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Perspective</Label>
                    <Select 
                      value={participant1.perspective} 
                      onValueChange={(value) => setParticipant1(prev => ({ ...prev, perspective: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {perspectives.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Personality</Label>
                    <Select 
                      value={participant1.personality} 
                      onValueChange={(value) => setParticipant1(prev => ({ ...prev, personality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {personalities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Participant 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Participant 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={participant2.name}
                      onChange={(e) => setParticipant2(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="AI Critic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Perspective</Label>
                    <Select 
                      value={participant2.perspective} 
                      onValueChange={(value) => setParticipant2(prev => ({ ...prev, perspective: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {perspectives.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Personality</Label>
                    <Select 
                      value={participant2.personality} 
                      onValueChange={(value) => setParticipant2(prev => ({ ...prev, personality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {personalities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Max Rounds</Label>
              <Select value={maxRounds.toString()} onValueChange={(value) => setMaxRounds(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10, 15, 20].map((rounds) => (
                    <SelectItem key={rounds} value={rounds.toString()}>
                      {rounds} rounds
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={createDebate} 
              disabled={isLoading || !topic.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Creating Debate...' : 'Start AI vs AI Debate'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{session.topic}</h1>
          <p className="text-muted-foreground mt-1">
            AI vs AI Debate • Round {session.currentRound} of {session.maxRounds}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {session.status === 'active' && (
            <>
              <Button onClick={runNextRound} disabled={isLoading} variant="outline">
                {isLoading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Next Round
              </Button>
              <Button onClick={startAutomatedDebate} disabled={isLoading || isWatching}>
                <Users className="h-4 w-4 mr-2" />
                {isWatching ? 'Watching...' : 'Watch Full Debate'}
              </Button>
            </>
          )}
          
          <Button onClick={joinAsSpectator} variant="ghost" size="sm">
            <Users className="h-4 w-4 mr-1" />
            {session.spectators?.length || 0} spectators
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Debate Progress</span>
            <span className="text-sm text-muted-foreground">
              {session.currentRound}/{session.maxRounds} rounds
            </span>
          </div>
          <Progress 
            value={(session.currentRound / session.maxRounds) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {session.participants.map((participant, index) => (
          <Card key={participant.id} className={`${getParticipantColor(participant.name)}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getParticipantBadge(participant.name)} text-white`}>
                      {participant.name}
                    </Badge>
                    {session.winner === participant.id && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {participant.perspective} perspective • {participant.personality} style
                  </p>
                </div>
                
                {session.scores && (
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {index === 0 ? session.scores.participant1 : session.scores.participant2}
                    </div>
                    <div className="text-xs text-muted-foreground">score</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Debate Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No arguments yet. Start the debate to see AI participants exchange views!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id}>
                <div className={`p-4 rounded-lg ${getParticipantColor(message.aiParticipantName)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getParticipantBadge(message.aiParticipantName)} text-white text-xs`}>
                        {message.aiParticipantName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Round {message.roundNumber}
                      </span>
                    </div>
                    
                    {message.argumentScore && (
                      <div className="flex items-center gap-1 text-xs">
                        <BarChart3 className="h-3 w-3" />
                        <span>{message.argumentScore.overall}/10</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.argumentScore && (
                    <div className="mt-3 pt-2 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Logic:</span>
                          <span className="ml-1 font-medium">{message.argumentScore.logic}/10</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Evidence:</span>
                          <span className="ml-1 font-medium">{message.argumentScore.evidence}/10</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Persuasiveness:</span>
                          <span className="ml-1 font-medium">{message.argumentScore.persuasiveness}/10</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {index < messages.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
          
          {isWatching && (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <Play className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">AI participants are debating...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {session.status === 'completed' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Debate Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            {session.winner ? (
              <p>
                <strong>{session.participants.find(p => p.id === session.winner)?.name}</strong> won this debate!
              </p>
            ) : (
              <p>The debate ended in a tie - both participants presented compelling arguments.</p>
            )}
            
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm">
                Export Transcript
              </Button>
              <Button variant="outline" size="sm">
                View Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSession(null)}>
                Start New Debate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
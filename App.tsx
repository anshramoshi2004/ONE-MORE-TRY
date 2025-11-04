import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, MessageSquare, Phone, SkipForward, Flag, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const queryClient = new QueryClient();

const App = () => {
  const [view, setView] = useState<'landing' | 'room'>('landing');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [chatMode, setChatMode] = useState<'text' | 'video'>('text');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; timestamp: Date; sender: string }>>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();

  const popularInterests = ["Music", "Art", "Gaming", "Movies", "Books", "Travel", "Sports", "Tech"];

  const handleStartChat = () => {
    setView('room');
    setIsVideoEnabled(chatMode === 'video');
    setMessages([]);
    setIsConnected(false);
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Connected!",
        description: "You're now chatting with a stranger",
      });
    }, 2000);
  };

  const addInterest = (interest: string) => {
    if (interest && !selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const handleSkip = () => {
    toast({
      title: "Finding new stranger...",
      description: "Connecting you to someone new",
    });
    setMessages([]);
    setIsConnected(false);
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Connected!",
        description: "Say hello to a new stranger",
      });
    }, 2000);
  };

  const handleReport = () => {
    if (!reportReason.trim()) return;
    
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe",
    });
    setShowReportDialog(false);
    setReportReason("");
    handleSkip();
  };

  const handleDisconnect = () => {
    setView('landing');
    setMessages([]);
    setIsConnected(false);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        text: message,
        timestamp: new Date(),
        sender: "You"
      }]);
      setMessage("");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {view === 'landing' ? (
          // Landing Page
          <div className="min-h-screen bg-[var(--gradient-hero)] flex flex-col">
            {/* Header */}
            <header className="container mx-auto px-4 py-6 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <Heart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-gradient">One More Try</h1>
              </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
              <div className="text-center mb-12 max-w-2xl animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Sometimes, all you need is one more chance
                </h2>
                <p className="text-xl text-muted-foreground">
                  Connect with strangers freely, safely, and without judgment. No names, no profiles — just honest, human conversation.
                </p>
              </div>

              <Card className="w-full max-w-xl p-8 bg-[var(--gradient-card)] border-border/50 backdrop-blur-sm shadow-[var(--shadow-card)] animate-fade-in">
                {/* Chat Mode Selection */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block text-foreground">Select Chat Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={chatMode === 'text' ? 'default' : 'outline'}
                      className="h-16"
                      onClick={() => setChatMode('text')}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Text Chat
                    </Button>
                    <Button
                      variant={chatMode === 'video' ? 'default' : 'outline'}
                      className="h-16"
                      onClick={() => setChatMode('video')}
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Video Chat
                    </Button>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block text-foreground">Add Your Interests (Optional)</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Type an interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addInterest(newInterest)}
                      className="flex-1 bg-input border-border"
                    />
                    <Button onClick={() => addInterest(newInterest)}>Add</Button>
                  </div>
                  
                  {selectedInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/20"
                          onClick={() => removeInterest(interest)}
                        >
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {popularInterests.filter(i => !selectedInterests.includes(i)).map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => addInterest(interest)}
                      >
                        + {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-lg glow"
                  onClick={handleStartChat}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Chatting
                </Button>
              </Card>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
                <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm text-center animate-fade-in">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-foreground">Built with Empathy</h3>
                  <p className="text-sm text-muted-foreground">
                    Every conversation is a chance for understanding and human connection
                  </p>
                </Card>

                <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm text-center animate-fade-in">
                  <Flag className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-foreground">Safe & Respectful</h3>
                  <p className="text-sm text-muted-foreground">
                    Report inappropriate behavior. We're committed to keeping conversations respectful
                  </p>
                </Card>

                <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm text-center animate-fade-in">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-foreground">One More Chance</h3>
                  <p className="text-sm text-muted-foreground">
                    Sometimes all we need is one more try to make a real connection
                  </p>
                </Card>
              </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
              <p>Built with the spirit of empathy and second chances. Be kind, be respectful, be human.</p>
            </footer>
          </div>
        ) : (
          // Room View
          <div className="min-h-screen bg-[var(--gradient-hero)] p-4">
            <div className="container mx-auto max-w-7xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div>
                    <h1 className="text-xl font-bold text-gradient">One More Try</h1>
                    <p className="text-xs text-muted-foreground">
                      {chatMode === 'video' ? 'Video conversation' : 'Text conversation'}
                      {isConnected ? ' • Connected to a stranger' : ' • Finding someone...'}
                    </p>
                  </div>
                </div>
                {selectedInterests.length > 0 && (
                  <div className="flex gap-2">
                    {selectedInterests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Video Area */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Main Video */}
                  <Card className="aspect-video bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Connecting you with someone...</p>
                        <p className="text-sm text-muted-foreground mt-2">Just a moment while we find your match</p>
                      </div>
                    </div>
                  </Card>

                  {/* Self Video Preview */}
                  <Card className="aspect-video max-w-xs bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-muted/20">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                          <span className="text-2xl font-bold text-primary">You</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Controls */}
                  <div className="flex justify-center gap-3">
                    {chatMode === 'video' && (
                      <>
                        <Button
                          variant={isAudioEnabled ? "secondary" : "destructive"}
                          size="lg"
                          className="rounded-full w-12 h-12"
                          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        >
                          {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant={isVideoEnabled ? "secondary" : "destructive"}
                          size="lg"
                          className="rounded-full w-12 h-12"
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        >
                          {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="default"
                      size="lg"
                      className="rounded-full px-6 h-12 glow"
                      onClick={handleSkip}
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      Next
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-full w-12 h-12"
                      onClick={() => setShowReportDialog(true)}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="rounded-full w-12 h-12"
                      onClick={handleDisconnect}
                    >
                      <Phone className="w-4 h-4 rotate-135" />
                    </Button>
                  </div>
                </div>

                {/* Chat Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="h-[600px] bg-card/50 border-border/50 backdrop-blur-sm flex flex-col">
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold">Chat</h2>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          Say hello. Every connection starts with one message.
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div key={idx} className="bg-secondary/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-primary">{msg.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {msg.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{msg.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1 bg-input border-border"
                        />
                        <Button onClick={sendMessage} className="glow">
                          Send
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Report Dialog */}
            <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Help us keep the community safe. What's the issue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Describe the issue..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleReport}
                    disabled={!reportReason.trim()}
                  >
                    Submit Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

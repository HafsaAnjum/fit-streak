
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Maximize2, Minimize2, Send, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hi there! I'm your FitStreak AI assistant. How can I help with your fitness journey today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const { user } = useAuth();
  
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    
    // Simulate AI response (in a real app, this would call an API)
    const responses = [
      "I can help you build a personalized workout plan based on your fitness goals. Would you like me to create one for you?",
      "Based on your activity data, I'd recommend focusing on cardio exercises for the next few days to improve your endurance.",
      "Your progress has been outstanding! You've improved your average steps by 12% over the last week.",
      "I'm your fitness assistant. I can help with workout plans, nutrition advice, and tracking your progress. What would you like to know?"
    ];
    
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const aiSuggestions = [
    "Create a workout plan", 
    "Track my calories", 
    "Analyze my activity",
    "Suggest exercises",
    "What's my progress?"
  ];
  
  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="fixed bottom-16 right-4 z-50 md:bottom-4 md:right-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button 
              onClick={toggleChat} 
              className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 p-0"
            >
              <Bot className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px",
              width: isMinimized ? "300px" : "350px"
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-16 right-4 z-50 shadow-xl rounded-2xl overflow-hidden md:bottom-4 md:right-6"
          >
            <Card className="border-2 border-primary/20 h-full bg-gradient-to-br from-card to-background">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 py-3 px-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-purple-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">FitStreak AI</h3>
                    <p className="text-xs text-muted-foreground">Your fitness assistant</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={toggleMinimize}
                  >
                    {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 hover:text-destructive"
                    onClick={toggleChat}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              
              {!isMinimized && (
                <>
                  <ScrollArea className="h-[380px] p-4">
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`max-w-[85%] p-3 rounded-xl ${
                              msg.sender === 'user' 
                              ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground' 
                              : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-right mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </motion.div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] p-3 rounded-xl bg-muted">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {messages.length === 1 && (
                    <div className="px-4 mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.map((suggestion, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setMessage(suggestion);
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <CardFooter className="p-3 border-t">
                    <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                      <Textarea 
                        placeholder="Type your message..." 
                        className="min-h-10 resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        disabled={isTyping}
                      />
                      <Button type="submit" size="icon" className="shrink-0" disabled={isTyping || !message.trim()}>
                        {isTyping ? <LoadingSpinner size={16} /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatButton;

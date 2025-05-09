
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, Maximize2, Minimize2, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isHtml?: boolean;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm FitStreak, your fitness assistant. You can ask for diet plans, day-by-day routines, or type workout keywords like 'cardio' or 'yoga' for exercise suggestions.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);
  
  // Plans database based on the provided HTML
  const plans = {
    normal: [
      "**Day 1 Normal Nutrition & Exercise:**\n- Diet: Oatmeal with berries, grilled chicken salad, fruit.\n- Exercise: Brisk walking 30 mins.",
      "**Day 2 Normal Nutrition & Exercise:**\n- Diet: Greek yogurt parfait, quinoa bowl, steamed veggies.\n- Exercise: Strength training 45 mins.",
      "**Day 3 Normal Nutrition & Exercise:**\n- Diet: Scrambled eggs, whole grain toast, mixed greens.\n- Exercise: Cycling 30 mins + core exercises.",
      "**Day 4 Normal Nutrition & Exercise:**\n- Diet: Lentil soup, whole grain roll, cottage cheese.\n- Exercise: Yoga 30 mins.",
      "**Day 5 Normal Nutrition & Exercise:**\n- Diet: Whole grain pancakes, turkey wrap, protein smoothie.\n- Exercise: HIIT 45 mins.",
      "**Day 6 Normal Nutrition & Exercise:**\n- Diet: Avocado toast with eggs, tuna salad.\n- Exercise: Swimming 30 mins.",
      "**Day 7 Normal Nutrition & Exercise:**\n- Diet: Smoothie bowl, stir-fried veggies with tofu.\n- Exercise: Hiking 60 mins.",
    ],
    weightgain: [
      "**Day 1 Weight Gain Nutrition & Exercise:**\n- Diet: Oatmeal with nuts and honey, whole milk smoothie.\n- Exercise: Cardio 30 mins + strength training 20 mins.",
      "**Day 2 Weight Gain Nutrition & Exercise:**\n- Diet: Protein smoothie with banana and peanut butter, turkey sandwich.\n- Exercise: HIIT 45 mins + stretching.",
      "**Day 3 Weight Gain Nutrition & Exercise:**\n- Diet: Eggs and cheese omelette, beef and sweet potato.\n- Exercise: Weight lifting full body 45 mins.",
      "**Day 4 Weight Gain Nutrition & Exercise:**\n- Diet: Greek yogurt with granola and almonds, grilled chicken.\n- Exercise: Rest day with light stretching.",
      "**Day 5 Weight Gain Nutrition & Exercise:**\n- Diet: Whole wheat pasta, meatballs, mixed vegetables.\n- Exercise: Strength training 50 mins.",
      "**Day 6 Weight Gain Nutrition & Exercise:**\n- Diet: Peanut butter toast, salmon with quinoa.\n- Exercise: Swimming or cycling 30 mins.",
      "**Day 7 Weight Gain Nutrition & Exercise:**\n- Diet: Smoothies with protein powder, nuts, and fruits.\n- Exercise: Hiking or outdoor activity 60 mins.",
    ],
    weightloss: [
      "**Day 1 Weight Loss Nutrition & Exercise:**\n- Diet: Leafy greens salad, grilled chicken breast, steamed vegetables.\n- Exercise: Brisk walk 30 mins + bodyweight circuit.",
      "**Day 2 Weight Loss Nutrition & Exercise:**\n- Diet: Smoothie with spinach, berries, chia seeds.\n- Exercise: HIIT 30 mins.",
      "**Day 3 Weight Loss Nutrition & Exercise:**\n- Diet: Egg white omelette, roasted veggies, quinoa.\n- Exercise: Cycling 30 mins + core workout.",
      "**Day 4 Weight Loss Nutrition & Exercise:**\n- Diet: Lentil soup, mixed greens, low-fat yogurt.\n- Exercise: Yoga 45 mins.",
      "**Day 5 Weight Loss Nutrition & Exercise:**\n- Diet: Grilled fish, brown rice, steamed broccoli.\n- Exercise: Strength training 40 mins.",
      "**Day 6 Weight Loss Nutrition & Exercise:**\n- Diet: Vegetable stir fry with tofu, side salad.\n- Exercise: Swimming 30 mins.",
      "**Day 7 Weight Loss Nutrition & Exercise:**\n- Diet: Mixed fruit bowl, nuts, herbal tea.\n- Exercise: Hiking or walking 60 mins.",
    ],
  };

  const workoutSuggestions = {
    cardio: [
      "Jumping jacks - 3 sets of 30 seconds",
      "Burpees - 3 sets of 10 reps",
      "High knees - 3 sets of 30 seconds",
      "Mountain climbers - 3 sets of 20 reps",
      "Jogging or running - 20 to 30 minutes",
    ],
    strength: [
      "Push-ups - 3 sets of 12-15 reps",
      "Squats - 3 sets of 15 reps",
      "Lunges - 3 sets of 12 reps per leg",
      "Dumbbell rows - 3 sets of 12 reps",
      "Planks - Hold for 30 to 60 seconds",
    ],
    yoga: [
      "Downward Dog - hold for 30 seconds",
      "Warrior II - hold for 30 seconds each side",
      "Child's Pose - hold for 1 minute",
      "Cobra Pose - hold for 30 seconds",
      "Cat-Cow Stretch - 10 rounds",
    ],
    hiit: [
      "30 seconds sprint, 30 seconds walk x 10 rounds",
      "Jump squats - 3 sets of 15 reps",
      "Mountain climbers - 3 sets of 20 reps",
      "Burpees - 3 sets of 10 reps",
      "Plank jacks - 3 sets of 30 seconds",
    ],
    swimming: [
      "Freestyle swimming - 20 minutes",
      "Backstroke - 15 minutes",
      "Breaststroke - 15 minutes",
      "Swimming laps with intervals - 10 rounds",
      "Treading water - 5 minutes",
    ],
    cycling: [
      "Steady pace cycling - 30 minutes",
      "Hill sprints - 5 intervals",
      "Interval cycling: 2 min fast, 2 min slow x 6",
      "Long distance cycling - 45 minutes",
      "Slow cadence high resistance - 15 minutes",
    ],
    normalWorkouts: [
      "Brisk walking - 30 minutes",
      "Bodyweight squats - 3 sets of 15 reps",
      "Light jogging - 20 minutes",
      "Yoga stretches - 20 minutes",
      "Core exercises (planks, crunches) - 10 mins",
    ],
  };

  // Function to scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const element = scrollAreaRef.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const formatBotMessage = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  };

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
    
    // Process the message and generate responses
    setTimeout(() => {
      const lowerText = message.toLowerCase();
      
      // Detect workout keywords mentioned
      const workoutTypes = Object.keys(workoutSuggestions).filter(
        (k) => k !== "normalWorkouts"
      );
      const mentionedWorkouts = workoutTypes.filter((workout) =>
        lowerText.includes(workout)
      );

      // Detect plan type
      let planKey: "normal" | "weightgain" | "weightloss" = "normal"; // default
      if (/(weight gain|gain weight|muscle gain)/.test(lowerText)) {
        planKey = "weightgain";
      } else if (/(weight loss|lose weight|fat burn)/.test(lowerText)) {
        planKey = "weightloss";
      } else if (/(normal|balanced|regular)/.test(lowerText)) {
        planKey = "normal";
      }

      // Day detection: supports "day 3" or "3 day"/"3-day" forms
      let dayNum = null;
      const dayMatch = lowerText.match(/day\s*(\d)/);
      if (dayMatch && dayMatch[1]) {
        dayNum = parseInt(dayMatch[1], 10);
      } else {
        const altDayMatch = lowerText.match(/(\d)\s*-\s*day|(\d)\s+day/);
        if (altDayMatch) {
          dayNum = parseInt(altDayMatch[1] || altDayMatch[2], 10);
        }
        if (!dayNum) {
          const altDayMatch2 = lowerText.match(/\b(\d)[-\s]?day\b/);
          if (altDayMatch2) {
            dayNum = parseInt(altDayMatch2[1], 10);
          }
        }
      }

      const responses: string[] = [];

      // Prepare diet + exercise plan response if dayNum available
      if (dayNum && dayNum >= 1 && dayNum <= 7) {
        const combined = plans[planKey]
          .slice(0, dayNum)
          .join("\n\n---\n\n");
        responses.push(combined);
      } else if (/(7 day|seven day|week)/.test(lowerText)) {
        const combined = plans[planKey].join("\n\n---\n\n");
        responses.push(combined);
      }

      // Prepare workout suggestions if any workout keyword detected
      if (mentionedWorkouts.length > 0) {
        mentionedWorkouts.forEach((workout) => {
          const workouts = workoutSuggestions[workout as keyof typeof workoutSuggestions];
          if (workouts) {
            const workoutList = workouts.map((w) => "• " + w).join("\n");
            const message = `Here are some ${
              workout.charAt(0).toUpperCase() + workout.slice(1)
            } workouts you can try:\n\n${workoutList}`;
            responses.push(message);
          }
        });
      }

      // Send responses
      if (responses.length > 0) {
        // Add each response as a separate message
        responses.forEach((response, index) => {
          setTimeout(() => {
            const aiResponse: Message = {
              id: `${Date.now() + index}`,
              content: response,
              sender: "ai",
              timestamp: new Date(),
              isHtml: true
            };
            setMessages(prev => [...prev, aiResponse]);
            
            // Only mark typing as complete after the last message
            if (index === responses.length - 1) {
              setIsTyping(false);
            }
          }, index * 300);
        });
      } else {
        // Basic fallback response
        const fallbackResponses = [
          "Please specify the plan type (normal, weight gain, weight loss) and day number (e.g., 'Day 3 weight loss plan' or '3 day weight loss plan').",
          "You can ask like: 'Give me day 5 normal plan', or 'Show me 7 day weight gain plan'.",
          "Type a question about fitness, nutrition or workouts and I will help!",
        ];
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: fallbackResponses[randomIndex],
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }
    }, 500);
  };

  const aiSuggestions = [
    "Show me a 3 day weight loss plan", 
    "Give me some cardio exercises", 
    "What's a good yoga routine?",
    "7 day weight gain meal plan",
    "HIIT workout suggestions"
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
            <div className="border-2 border-primary/20 h-full bg-gradient-to-br from-card to-background flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 py-3 px-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-purple-500">
                    <Bot className="h-4 w-4 text-white" />
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
              </div>
              
              {!isMinimized && (
                <>
                  <div className="flex-grow overflow-auto p-4" ref={scrollAreaRef}>
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
                              ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-br-sm' 
                              : 'bg-muted rounded-bl-sm'
                            }`}
                          >
                            {msg.isHtml ? (
                              <p 
                                className="text-sm" 
                                dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.content) }}
                              />
                            ) : (
                              <p className="text-sm whitespace-pre-line">{msg.content}</p>
                            )}
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
                  </div>
                  
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
                  
                  <div className="p-3 border-t">
                    <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                      <textarea 
                        placeholder="Type your message..." 
                        className="min-h-10 resize-none flex-1 px-3 py-2 rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        disabled={isTyping}
                        rows={1}
                      />
                      <Button type="submit" size="icon" className="shrink-0" disabled={isTyping || !message.trim()}>
                        {isTyping ? (
                          <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;

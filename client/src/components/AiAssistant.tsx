import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAiChat } from "@/hooks/use-ai";
import { useFilterContext } from "@/context/FilterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, X, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your job assistant. Ask me to find jobs, e.g., 'Show me remote React jobs'." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const { filters, setFilters } = useFilterContext();
  const { mutate: chat, isPending } = useAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    chat(
      { message: userMessage, currentFilters: filters },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
          
          if (data.action?.type === "UPDATE_FILTERS" && data.action.payload) {
            setFilters((prev) => ({ ...prev, ...data.action!.payload }));
          }
        },
        onError: () => {
          setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." }]);
        }
      }
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-[380px] h-[500px] z-50 rounded-2xl shadow-2xl bg-card border border-border flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold">Job Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">AI-Powered</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 text-primary-foreground"
              >
                <X size={20} />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground rounded-br-none" 
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                      <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="rounded-xl border-muted-foreground/20 focus-visible:ring-primary"
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  disabled={!inputValue.trim() || isPending}
                  className="rounded-xl shrink-0"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-8 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/30 flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>
    </>
  );
}

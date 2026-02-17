"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm the DressCodes AI Assistant. Ask me about our services, pricing, or laundry tips!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantMessage = { role: "assistant" as const, content: "" };
      
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantMessage.content += text;
        
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Configure fixed positioning for the chat widget */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Chat Window */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out transform origin-bottom-right",
            isOpen 
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          )}
        >
          <Card className="w-[350px] sm:w-[380px] shadow-2xl border-emerald-100 overflow-hidden flex flex-col h-[500px]">
            <CardHeader className="bg-emerald-600 text-white p-4 flex flex-row items-center justify-between space-y-0 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">DressCodes Assistant</CardTitle>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden relative bg-slate-50">
              <ScrollArea className="h-full w-full p-4">
                <div className="flex flex-col gap-4 pb-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className={cn("h-8 w-8 border", msg.role === "assistant" ? "bg-emerald-100 border-emerald-200" : "bg-slate-200 border-slate-300")}>
                        <AvatarFallback className={msg.role === "assistant" ? "text-emerald-700" : "text-slate-700"}>
                          {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                        {msg.role === "assistant" && <AvatarImage src="/bot-avatar.png" />} 
                      </Avatar>
                      
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        msg.role === "user" 
                          ? "bg-emerald-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                       <Avatar className="h-8 w-8 border bg-emerald-100 border-emerald-200">
                        <AvatarFallback className="text-emerald-700"><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              
              {/* Decorative background element */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/pattern.png')] bg-repeat" />
            </CardContent>

            <CardFooter className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-full border-slate-200 focus-visible:ring-emerald-500 bg-slate-50"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shrink-0 transition-transform active:scale-95"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        {/* Floating Action Button */}
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto",
            isOpen ? "bg-slate-800 hover:bg-slate-900 rotate-90 scale-0 opacity-0 absolute" : "bg-emerald-600 hover:bg-emerald-700 rotate-0 scale-100 opacity-100"
          )}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="sr-only">Open Chat</span>
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </Button>

        {/* Close Button when open (optional, users usually click the X in header, but this is a nice touch for consistent FAB behavior) */}
        <Button
           size="lg"
           className={cn(
             "h-14 w-14 rounded-full shadow-lg bg-slate-800 hover:bg-slate-900 transition-all duration-300 absolute pointer-events-auto",
             isOpen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90 pointer-events-none"
           )}
           onClick={() => setIsOpen(false)}
        >
          <X className="h-7 w-7 text-white" />
        </Button>

      </div>
    </>
  );
}

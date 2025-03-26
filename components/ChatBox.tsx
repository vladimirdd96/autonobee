"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { AILoading } from './ui/ai-loading';

interface Message {
  id: number;
  isUser: boolean;
  text: string;
  timestamp: Date;
}

export default function ChatBox() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, isUser: false, text: "Hello! I'm your AI content writing assistant. I have years of experience in creating engaging content and can help you with any content-related needs. How can I assist you today?", timestamp: new Date(Date.now() - 3600000) },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      isUser: true,
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response
      const aiMessage: Message = {
        id: messages.length + 2,
        isUser: false,
        text: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        isUser: false,
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background border border-grayDark rounded-lg overflow-hidden">
      <div className="flex-none p-4 border-b border-grayDark flex items-center">
        <Bot className="text-primary w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold text-accent">AI Content Writing Assistant</h2>
      </div>
      
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div 
            key={message.timestamp.toISOString()} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-background rounded-tr-none' 
                  : 'bg-grayDark text-accent rounded-tl-none'
              }`}
            >
              <p className="break-words whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && <AILoading />}
      </div>
      
      <div className="flex-none p-4 border-t border-grayDark">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow p-2 bg-grayDark text-accent rounded-l-lg focus:outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            className={`bg-primary text-background p-2 rounded-r-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 
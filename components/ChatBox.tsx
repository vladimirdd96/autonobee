"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  isUser: boolean;
  text: string;
  timestamp: Date;
}

export default function ChatBox() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, isUser: false, text: "Hello! How can I assist you today?", timestamp: new Date(Date.now() - 3600000) },
    { id: 2, isUser: true, text: "I need help creating content for my social media.", timestamp: new Date(Date.now() - 3500000) },
    { id: 3, isUser: false, text: "I'd be happy to help! What platforms are you focused on, and what kind of content do you want to create?", timestamp: new Date(Date.now() - 3400000) },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      isUser: true,
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        isUser: false,
        text: "I'm processing your request. Let me think about the best content strategy for your needs...",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
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
        <h2 className="text-lg font-semibold text-accent">AI Assistant</h2>
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
              <p className="break-words">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
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
          />
          <button 
            onClick={handleSendMessage}
            className="bg-primary text-background p-2 rounded-r-lg hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 
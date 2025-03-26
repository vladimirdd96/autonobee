import ChatBox from "@/components/ChatBox";
import Layout from "@/components/Layout";
import { Sparkles, MessageSquare, Wand2 } from 'lucide-react';

export default function Chat() {
  return (
    <Layout>
      <div className="min-h-screen">
        <div className="flex flex-col h-[calc(100vh-10rem)]">
          <div className="mb-8">
            <h1 className="text-3xl font-display text-accent mb-4">AI Content Assistant</h1>
            
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display text-accent mb-2">Your Expert Content Partner</h2>
                  <p className="text-accent/80 leading-relaxed">
                    Meet our advanced AI assistant, specifically trained to revolutionize your content creation journey. 
                    Whether you need expert advice on content strategy, help with editing and refinement, or creative 
                    suggestions to make your content stand out, this AI is your dedicated partner in content excellence.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-accent/70">
                      <MessageSquare className="w-4 h-4" />
                      <span>Natural conversation</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent/70">
                      <Wand2 className="w-4 h-4" />
                      <span>Smart suggestions</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent/70">
                      <Sparkles className="w-4 h-4" />
                      <span>Content expertise</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow h-[calc(100%-3rem)]">
            <ChatBox />
          </div>
        </div>
      </div>
    </Layout>
  );
} 
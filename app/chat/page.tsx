import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Sidebar />
      <div className="ml-64 p-6 pt-8 h-screen">
        <div className="flex flex-col h-full">
          <h1 className="text-3xl font-bold text-accent mb-6">Chat</h1>
          
          <div className="flex-grow">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
} 
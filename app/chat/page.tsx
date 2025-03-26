import ChatBox from "@/components/ChatBox";
import Layout from "@/components/Layout";

export default function Chat() {
  return (
    <Layout>
      <div className="min-h-screen">
        <div className="flex flex-col h-[calc(100vh-10rem)]">
          <h1 className="text-3xl font-bold text-accent mb-6">Chat</h1>
          
          <div className="flex-grow h-[calc(100%-3rem)]">
            <ChatBox />
          </div>
        </div>
      </div>
    </Layout>
  );
} 
import ChatBox from "@/components/ChatBox";
import Layout from "@/components/Layout";

export default function Chat() {
  return (
    <Layout>
      <div className="h-screen">
        <div className="flex flex-col h-full">
          <h1 className="text-3xl font-bold text-accent mb-6">Chat</h1>
          
          <div className="flex-grow">
            <ChatBox />
          </div>
        </div>
      </div>
    </Layout>
  );
} 
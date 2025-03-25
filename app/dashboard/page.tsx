import ContentCard from "@/components/ContentCard";
import GatedSection from "@/components/GatedSection";
import Sidebar from "@/components/Sidebar";
import TrendBox from "@/components/TrendBox";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { WavyBackground } from "@/components/aceternity/wavy-background";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import Link from "next/link";
import { 
  PenTool, 
  BarChart3, 
  Users, 
  Repeat, 
  Share, 
  Cable, 
  AlertTriangle, 
  FileEdit, 
  Calendar, 
  Bell, 
  TrendingUp, 
  Clock,
  Sparkles,
  Bot,
  Zap,
  Star,
  Timer
} from "lucide-react";

export default function Dashboard() {
  // Simulate wallet connection and token presence
  const hasToken = true; // Set to false to simulate restriction
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 pt-16">
      <div className="fixed top-0 left-0 right-0">
        <BackgroundBeams />
      </div>
      <MeteorEffect count={35} color="#f9b72d" className="z-20" />
      <Sidebar />
      <div className="ml-64 p-4 pt-6 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <h1 className="text-3xl font-bold">
              <AnimatedGradientText text="Dashboard" />
            </h1>
            <div className="absolute -top-8 left-0 w-screen h-[100vh] pointer-events-none z-0">
              {/* Single layer of sparkles with reduced density */}
              <div className="absolute top-0 left-0 w-full h-full">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={300}
                  className="w-full h-full"
                  particleColor="#f9b72d"
                />
              </div>
            </div>
          </div>
          
          {/* Wallet Status */}
          <div className="flex gap-4 items-center">
            <div className="text-accent px-3 py-1.5 bg-gradient-to-r from-background/50 to-grayDark/50 backdrop-blur-sm rounded-lg border border-primary/10">
              {hasToken ? (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Connected with $FORGE token</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span>Wallet not connected</span>
                </div>
              )}
            </div>
            
            {!hasToken && (
              <MovingBorder borderRadius="0.5rem" containerClassName="p-0.5">
                <button className="px-4 py-2 bg-gradient-to-r from-background to-background/80 text-primary rounded-md hover:bg-primary/10 transition-colors">
                  Connect Wallet
                </button>
              </MovingBorder>
            )}
            
            <div className="bg-gradient-to-r from-background/50 to-grayDark/50 backdrop-blur-sm text-accent px-3 py-1.5 rounded-lg border border-primary/10 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-accent/70" />
              <span className="text-sm">Last updated: Just now</span>
            </div>
          </div>
        </div>
        
        {/* Stats Overview - Simplified animation */}
        <div className="rounded-xl mb-6 py-4 px-3 bg-gradient-to-br from-background/50 to-grayDark/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="relative perspective-1000">
                  <div className="bg-gradient-to-br from-background/40 to-grayDark/40 backdrop-blur-sm p-4 rounded-lg border border-primary/10">
                    <div>
                      <div className="flex items-center mb-2">
                        {getStatIcon(stat.title)}
                        <h3 className="text-accent/70 text-xs uppercase ml-2">{stat.title}</h3>
                      </div>
                      <p className="text-2xl font-bold text-accent mb-1">{stat.value}</p>
                      <div className="flex items-center">
                        <span className={`text-xs flex items-center ${stat.isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.isIncreasing ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />} 
                          {stat.changePercent}%
                        </span>
                        <span className="text-xs text-accent/50 ml-2">vs last week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Content - Simplified hover effects */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-grayDark/30 via-background/30 to-background/40 backdrop-blur-sm rounded-xl border border-primary/10 p-4">
                <h2 className="text-lg font-bold text-accent mb-3 flex justify-between items-center">
                  <AnimatedGradientText text="Recent Content" />
                  <Link href="/content-creation" className="text-xs px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-md hover:from-primary/30 hover:to-primary/20 transition-all font-normal">
                    View All Content
                  </Link>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentContent.map((content, index) => (
                    <div key={index} className="group">
                      <div className="relative perspective-1000">
                        <div className="bg-gradient-to-br from-background/30 to-grayDark/30 border border-primary/10 rounded-xl overflow-hidden p-0 transition-transform duration-200 group-hover:scale-[1.02]">
                          <div className="w-full">
                            <ContentCard 
                              title={content.title}
                              content={content.content}
                              image={content.image}
                              date={content.date}
                              category={content.category}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Upcoming Schedule - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-grayDark/30 via-background/30 to-background/40 backdrop-blur-sm rounded-xl border border-primary/10 p-4 h-full">
                <h2 className="text-lg font-bold text-accent mb-3 flex justify-between items-center">
                  <AnimatedGradientText text="Today's Schedule" />
                  <button className="text-xs px-3 py-1 bg-gradient-to-r from-accent/20 to-accent/10 text-accent rounded-md hover:from-accent/30 hover:to-accent/20 transition-all font-normal">
                    Add Event
                  </button>
                </h2>
                <div className="space-y-3">
                  {upcomingSchedule.map((event, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gradient-to-r from-background/20 to-grayDark/20 rounded-lg border border-primary/5">
                      <div className="text-center min-w-14">
                        <div className="text-sm text-primary font-semibold">{event.time}</div>
                        <div className="text-xs text-accent/60">{event.duration}</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-accent">{event.title}</h4>
                        <p className="text-xs text-accent/70">{event.description}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <span className={`inline-block w-2 h-2 rounded-full ${event.statusColor}`}></span>
                          <span className="text-xs text-accent/60">{event.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-1">
                    <button className="text-xs text-primary hover:underline flex items-center justify-center mx-auto">
                      <Calendar className="w-3 h-3 mr-1" />
                      View Full Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        {/* Trends - Gated Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-accent mb-3 flex justify-between items-center">
            <AnimatedGradientText text="Content Trends" />
            <Link href="/analytics" className="text-xs px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-md hover:from-primary/30 hover:to-primary/20 transition-all font-normal">
              Full Analytics
            </Link>
          </h2>
          <GatedSection hasAccess={hasToken}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {trends.map((trend, index) => (
                <HoverGlowEffect key={index} containerClassName="md:col-span-2">
                  <div className="relative perspective-1000">
                    <div className="bg-gradient-to-br from-background/30 to-grayDark/30">
                      <div>
                        <TrendBox 
                          title={trend.title}
                          percentage={trend.percentage}
                          category={trend.category}
                          isIncreasing={trend.isIncreasing}
                        />
                      </div>
                    </div>
                  </div>
                </HoverGlowEffect>
              ))}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-grayDark/40 via-background/30 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <h3 className="text-accent text-sm font-semibold mb-2">Top Performing</h3>
                  <div className="space-y-2">
                    {topPerforming.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm text-accent font-medium truncate max-w-52">{item.title}</div>
                          <div className="text-xs text-accent/60">{item.views} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GatedSection>
        </div>
        
        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-grayDark/40 via-background/30 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
              <h2 className="text-lg font-bold text-accent mb-3">
                <AnimatedGradientText text="Activity Overview" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start bg-gradient-to-r from-background/20 to-grayDark/20 p-3 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mr-3">
                          <activity.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-accent text-sm">{activity.title}</h4>
                          <p className="text-xs text-accent/70">{activity.description}</p>
                          <p className="text-xs text-accent/50 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-3">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <div key={index} className={`flex items-start bg-gradient-to-r from-background/20 to-grayDark/20 p-3 rounded-lg ${notification.unread ? 'border-l-2 border-primary' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${notification.gradientBg || 'bg-gradient-to-br from-primary/30 to-primary/10'}`}>
                          <notification.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-accent text-sm">{notification.title}</h4>
                          <p className="text-xs text-accent/70">{notification.description}</p>
                          <p className="text-xs text-accent/50 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-grayDark/40 via-background/30 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
              <h3 className="text-sm font-semibold text-accent mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link href="/content-creation" className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-lg hover:from-primary/30 hover:to-primary/10 transition-all p-3 text-center group">
                  <div className="text-xl mb-1 flex justify-center">
                    <PenTool className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-xs">Create Content</div>
                </Link>
                <Link href="/analytics" className="bg-gradient-to-br from-accent/20 to-accent/5 text-accent rounded-lg hover:from-accent/30 hover:to-accent/10 transition-all p-3 text-center group">
                  <div className="text-xl mb-1 flex justify-center">
                    <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-xs">View Analytics</div>
                </Link>
                <button className="bg-gradient-to-br from-accent/20 to-accent/5 text-accent rounded-lg hover:from-accent/30 hover:to-accent/10 transition-all p-3 text-center group">
                  <div className="text-xl mb-1 flex justify-center">
                    <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-xs">Schedule Posts</div>
                </button>
                <button className="bg-gradient-to-br from-accent/20 to-accent/5 text-accent rounded-lg hover:from-accent/30 hover:to-accent/10 transition-all p-3 text-center group">
                  <div className="text-xl mb-1 flex justify-center">
                    <Share className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-xs">Social Share</div>
                </button>
              </div>
              <h3 className="text-sm font-semibold text-accent mb-3">Usage Stats</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-accent/70">Content Credits Used</span>
                    <span className="text-accent">{72}%</span>
                  </div>
                  <div className="w-full bg-accent/10 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-accent/70">Storage Space</span>
                    <span className="text-accent">{45}%</span>
                  </div>
                  <div className="w-full bg-accent/10 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-accent to-accent/80 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-accent/70">API Calls</span>
                    <span className="text-accent">{28}%</span>
                  </div>
                  <div className="w-full bg-accent/10 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-green-500 to-green-500/80 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Tools */}
        <h2 className="text-lg font-bold text-accent mb-3">
          <AnimatedGradientText text="Tools & Integrations" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Link href="/content-creation">
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                        <PenTool className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-accent mb-1">Content Creation</h3>
                      <p className="text-xs text-accent/70">AI content tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>
          </Link>

          <Link href="/analytics">
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-accent mb-1">Analytics</h3>
                      <p className="text-xs text-accent/70">Performance metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>
          </Link>

          <Link href="/team">
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-accent mb-1">Collaboration</h3>
                      <p className="text-xs text-accent/70">Team workspace</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>
          </Link>

          <HoverGlowEffect>
            <div className="relative perspective-1000">
              <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                <div className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                      <Repeat className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-accent mb-1">Repurposing</h3>
                    <p className="text-xs text-accent/70">Content transformation</p>
                  </div>
                </div>
              </div>
            </div>
          </HoverGlowEffect>
          
          <HoverGlowEffect>
            <div className="relative perspective-1000">
              <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                <div className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                      <Share className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-accent mb-1">Social Media</h3>
                    <p className="text-xs text-accent/70">Publishing tools</p>
                  </div>
                </div>
              </div>
            </div>
          </HoverGlowEffect>
          
          <HoverGlowEffect>
            <div className="relative perspective-1000">
              <div className="bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                <div className="w-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                      <Cable className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-accent mb-1">Integrations</h3>
                    <p className="text-xs text-accent/70">Connect services</p>
                  </div>
                </div>
              </div>
            </div>
          </HoverGlowEffect>
        </div>
      </div>
    </div>
  );
}

// Helper function to get icon based on stat title
function getStatIcon(title: string) {
  switch (title) {
    case 'Total AI Generations':
      return <Bot className="w-4 h-4 text-primary" />;
    case 'Active Bots':
      return <Zap className="w-4 h-4 text-primary" />;
    case 'Tokens Used':
      return <Sparkles className="w-4 h-4 text-primary" />;
    case 'Content Score':
      return <Star className="w-4 h-4 text-primary" />;
    case 'Days Active':
      return <Timer className="w-4 h-4 text-primary" />;
    default:
      return null;
  }
}

const stats = [
  { title: 'Total AI Generations', value: '1,240', changePercent: 12, isIncreasing: true },
  { title: 'Active Bots', value: '7', changePercent: 5, isIncreasing: true },
  { title: 'Tokens Used', value: '34.5K', changePercent: 3, isIncreasing: false },
  { title: 'Content Score', value: '92', changePercent: 8, isIncreasing: true },
  { title: 'Days Active', value: '18', changePercent: 100, isIncreasing: true },
];

const recentContent = [
  {
    title: 'Social Media Campaign Plan',
    content: 'A comprehensive social media strategy for Q2 with content calendar and posting guidelines.',
    image: '/images/ai-content.jpg',
    date: 'Today, 10:30 AM',
    category: 'Marketing'
  },
  {
    title: 'Weekly Performance Analysis',
    content: 'An analysis of the past week\'s performance metrics across all marketing channels.',
    image: '/images/ai-dashboard.jpg',
    date: 'Yesterday, 2:15 PM',
    category: 'Analytics'
  },
  {
    title: 'Product Launch Email Sequence',
    content: 'A 5-part email sequence for the upcoming product launch, targeting existing customers.',
    image: '/images/ai-writing.jpg',
    date: 'Mar 22, 2024',
    category: 'Email'
  },
  {
    title: 'Landing Page Copy Draft',
    content: 'Draft copy for the new product landing page, including headlines, features and benefits.',
    image: '/images/ai-content.jpg',
    date: 'Mar 20, 2024',
    category: 'Website'
  }
];

const upcomingSchedule = [
  {
    time: '11:00 AM',
    duration: '30 min',
    title: 'Weekly Team Meeting',
    description: 'Content strategy discussion with marketing team',
    status: 'Starting soon',
    statusColor: 'bg-yellow-500'
  },
  {
    time: '1:30 PM',
    duration: '45 min',
    title: 'Content Review',
    description: 'Review social media posts for approval',
    status: 'Scheduled',
    statusColor: 'bg-primary'
  },
  {
    time: '3:00 PM',
    duration: '60 min',
    title: 'Analytics Report',
    description: 'Prepare monthly performance report',
    status: 'Scheduled',
    statusColor: 'bg-accent/70'
  }
];

const trends = [
  {
    title: 'AI Usage',
    percentage: 28,
    category: 'System',
    isIncreasing: true
  },
  {
    title: 'Content Quality',
    percentage: 15,
    category: 'Performance',
    isIncreasing: true
  },
  {
    title: 'Response Time',
    percentage: 7,
    category: 'Performance',
    isIncreasing: false
  },
  {
    title: 'User Engagement',
    percentage: 32,
    category: 'Marketing',
    isIncreasing: true
  },
];

const topPerforming = [
  { title: 'How AI is Transforming Content Strategy', views: 2450 },
  { title: '10 Tips for Better Social Media Engagement', views: 1820 },
  { title: 'The Ultimate Guide to Email Marketing', views: 1340 }
];

const activities = [
  {
    icon: FileEdit,
    title: 'New Content Created',
    description: 'You created "Q2 Marketing Strategy" using AI Assistant',
    time: '2 hours ago'
  },
  {
    icon: Repeat,
    title: 'Content Repurposed',
    description: 'Blog post converted to 5 social media posts',
    time: 'Yesterday'
  },
  {
    icon: BarChart3,
    title: 'Report Generated',
    description: 'Monthly performance analytics report was generated',
    time: '2 days ago'
  }
];

const notifications = [
  {
    icon: Bell,
    title: 'New Comment',
    description: 'Sarah commented on your latest post',
    time: '30 minutes ago',
    unread: true,
    gradientBg: 'bg-gradient-to-br from-primary/30 to-primary/10'
  },
  {
    icon: TrendingUp,
    title: 'Performance Alert',
    description: 'Your post is performing 25% better than average',
    time: '2 hours ago',
    unread: true,
    gradientBg: 'bg-gradient-to-br from-green-500/30 to-green-500/10'
  },
  {
    icon: AlertTriangle,
    title: 'Content Due',
    description: 'Weekly newsletter content is due today',
    time: '5 hours ago',
    unread: false,
    gradientBg: 'bg-gradient-to-br from-accent/30 to-accent/10'
  }
]; 
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { ExpandableCardDemo } from "@/components/expandable-card-demo-grid";
import Image from "next/image";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { TextRevealCard } from "@/components/aceternity/text-reveal-card";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";

export default function Home() {
  return (
    <div className="bg-background text-accent">
      {/* Hero Section with Aurora Background and Meteor Effect - Extended by 30% height */}
      <AuroraBackground 
        position={{ x: 50, y: 50 }}
        primaryColor="hsl(47, 100%, 50%)"
        secondaryColor="hsl(0, 0%, 80%)"
        className="relative z-0"
      >
        <section className="pt-40 pb-32 md:pt-52 md:pb-40 relative">
          <MeteorEffect count={25} color="#f9b72d" className="z-0" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0 relative">
                <div className="relative">
                  <Spotlight
                    className="-top-40 left-0 md:left-96 md:-top-50 h-[1000%] w-[700%] lg:w-[100%]"
                    fill="#ffffff"
                  />
                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-display mb-6 leading-tight">
                    Craft Content with <AnimatedGradientText text="AI Precision" className="text-4xl md:text-5xl lg:text-6xl font-display" />
                  </h1>
                </div>
                <h2 className="text-2xl md:text-2xl font-display mb-6 text-accent animate-fade-in">
                  Elevate Every Word, Every Message
                </h2>
                <p className="text-lg mb-8 text-accent/80 max-w-lg animate-reveal">
                  Dive into the future of content creation. Harness the power of artificial intelligence to craft messages that resonate, engage, and convert.
                </p>
                <div className="flex flex-wrap gap-4">
                  <MovingBorder 
                    borderRadius="0.5rem" 
                    className="px-6 py-3"
                    containerClassName="w-fit"
                  >
                    <Link 
                      href="/dashboard" 
                      className="whitespace-nowrap"
                    >
                      Take Your Journey Today
                    </Link>
                  </MovingBorder>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="w-full h-[390px] md:h-[520px] relative">
                  <CardContainer className="inter-var">
                    <CardBody className="bg-transparent border-0 relative group/card transition-transform duration-300 ease-out">
                      <CardItem 
                        translateZ={100}
                        className="w-full h-full bg-gradient-to-br from-primary/40 to-transparent rounded-3xl overflow-hidden flex items-center justify-center border border-primary/20 backdrop-blur-sm"
                      >
                        <div className="relative w-4/5 h-4/5">
                          <div className="absolute w-40 h-40 bg-primary/40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
                          <div className="absolute w-32 h-32 bg-accent/50 rounded-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-float"></div>
                          <div className="absolute w-24 h-24 bg-primary/30 rounded-full bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 animate-bounce-slow"></div>
                          <div className="absolute w-16 h-16 bg-accent/60 rounded-full top-1/3 right-1/3 animate-spin-slow"></div>
                          <div className="absolute w-20 h-20 bg-primary/20 rounded-full bottom-1/3 left-1/3 animate-bounce-slow"></div>
                          <div className="absolute w-10 h-36 bg-accent/30 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-float"></div>
                          <div className="absolute w-36 h-10 bg-primary/40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-float"></div>
                        </div>
                      </CardItem>
                      <CardItem
                        translateZ={120}
                        className="absolute bottom-12 right-12 w-24 h-24 bg-primary rounded-full"
                      >
                        <div></div>
                      </CardItem>
                      <CardItem
                        translateZ={80}
                        className="absolute top-12 left-12 w-16 h-16 bg-accent/60 rounded-full"
                      >
                        <div></div>
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AuroraBackground>
      
      {/* Features Section with Expandable Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display mb-12 text-center">
            <AnimatedGradientText text="Key Features of Our AI Content Platform" />
          </h2>
          <ExpandableCardDemo />
        </div>
      </section>
      
      {/* Content Brilliance Section */}
      <section className="py-16 bg-primary/5 relative">
        <MeteorEffect count={10} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <TextRevealCard
            text="Discover AI-Powered Content Brilliance"
            revealText="The Future of Content Creation Is Here"
            className="mx-auto max-w-4xl text-3xl md:text-4xl font-display"
            revealClassName="text-primary"
          >
            <p className="text-lg text-accent/80 max-w-2xl mx-auto mt-8">
              Transform the future of your writing. Tap into the unparalleled precision of AI to create content that resonates with your audience, connects with readers, inspires your journey towards remarkable content.
            </p>
          </TextRevealCard>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <HoverGlowEffect>
              <CardContainer className="aspect-[16/9]">
                <CardBody className="h-full w-full bg-transparent">
                  <CardItem translateZ={50} className="w-full h-full rounded-xl overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image 
                        src="/images/ai-writing.jpg" 
                        alt="AI Writing" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </HoverGlowEffect>
            
            <HoverGlowEffect>
              <CardContainer className="aspect-[16/9]">
                <CardBody className="h-full w-full bg-transparent">
                  <CardItem translateZ={50} className="w-full h-full rounded-xl overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image 
                        src="/images/futuristic-tech.jpg" 
                        alt="Futuristic Technology" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </HoverGlowEffect>
          </div>
        </div>
      </section>
      
      {/* Mastery Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <HoverGlowEffect>
                <CardContainer>
                  <CardBody className="bg-transparent border-0">
                    <CardItem translateZ={50} className="w-full rounded-xl overflow-hidden">
                      <Image 
                        src="/images/ai-dashboard.jpg" 
                        alt="AI Dashboard" 
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display mb-4 text-primary">
                <AnimatedGradientText text="From Data to Dialogue: AI-Driven Mastery" />
              </h2>
              <p className="text-lg text-accent/80 mb-6 animate-fade-in">
                Witness the transformative power of AI. Watch as complex data becomes intuitive insights, empowering your decisions and elevating your storytelling abilities to new levels.
              </p>
              
              <div className="mt-8">
                <MovingBorder borderRadius="0.5rem" containerClassName="inline-block p-0.5 mb-3">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Advanced content analytics</span>
                  </div>
                </MovingBorder>
                
                <MovingBorder borderRadius="0.5rem" containerClassName="inline-block p-0.5 mb-3 ml-4">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Real-time insights</span>
                  </div>
                </MovingBorder>
                
                <MovingBorder borderRadius="0.5rem" containerClassName="inline-block p-0.5">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Intuitive visualization</span>
                  </div>
                </MovingBorder>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with Parallax Scroll */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display mb-12 text-center">
            <AnimatedGradientText text="Voices from Our Satisfied Customers" />
          </h2>
          <ParallaxScroll className="gap-8 py-4">
            {testimonials.map((testimonial, index) => (
              <HoverGlowEffect key={index} containerClassName="min-w-[350px] max-w-[350px]">
                <div className="bg-background/20 p-6 rounded-xl backdrop-blur-sm border border-accent/10 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span role="img" aria-label="User">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-accent">{testimonial.name}</h3>
                      <p className="text-xs text-accent/70">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-accent/80 text-sm break-words whitespace-normal">{testimonial.quote}</p>
                </div>
              </HoverGlowEffect>
            ))}
          </ParallaxScroll>
        </div>
      </section>
      
      {/* Team Collaboration Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <MeteorEffect count={8} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
            <div className="md:w-1/2">
              <HoverGlowEffect>
                <CardContainer>
                  <CardBody className="bg-transparent border-0">
                    <CardItem translateZ={50} className="w-full rounded-xl overflow-hidden">
                      <Image 
                        src="/images/team-collaboration.jpg" 
                        alt="Team Collaboration" 
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display mb-4 text-primary">
                <AnimatedGradientText text="Seamless Team Collaboration" />
              </h2>
              <p className="text-lg text-accent/80 mb-6 animate-fade-in">
                Enhance your team&apos;s productivity with our collaborative tools. Share templates, provide feedback, and work together in real-time to create exceptional content.
              </p>
              
              <TextRevealCard
                text="Unlock Team Potential"
                revealText="Scale Your Content Creation"
                className="max-w-md text-xl font-semibold mt-8"
                revealClassName="text-primary font-bold"
              >
                <p className="text-accent/80 text-sm mt-2">
                  Our enterprise features enable teams of any size to streamline their content creation process and maintain consistent brand voice across all channels.
                </p>
              </TextRevealCard>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display mb-6">
            <AnimatedGradientText text="Pricing Plans for Every Need" />
          </h2>
          <p className="text-lg text-accent/80 max-w-2xl mx-auto mb-12 animate-reveal">
            Choose the plan that best fits your content creation requirements. Scale up as your needs grow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <HoverGlowEffect key={index} containerClassName={plan.isPopular ? "transform -translate-y-4" : ""}>
                <div className="pricing-card relative bg-background/30 backdrop-blur-sm p-6 rounded-xl border border-accent/10">
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-background px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-display mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-display text-primary">{plan.price}</span>
                    <span className="text-accent/70 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-accent/80 text-sm mb-6">{plan.description}</p>
                  <ul className="space-y-2 mb-6 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-accent/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <MovingBorder borderRadius="0.5rem" containerClassName="p-0.5">
                    <button className="w-full py-2 px-4 rounded-md bg-background hover:bg-primary/10 text-primary transition-colors font-medium">
                      {plan.buttonText}
                    </button>
                  </MovingBorder>
                </div>
              </HoverGlowEffect>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative">
        <MeteorEffect count={15} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display mb-6">
              <AnimatedGradientText text="Ready to Transform Your Content Creation?" />
            </h2>
            <p className="text-lg text-accent/80 max-w-2xl mx-auto mb-8 animate-reveal">
              Join thousands of content creators and businesses who are leveraging the power of AI to boost their content strategy.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <HoverGlowEffect containerClassName="w-full md:w-auto">
                <CardContainer className="w-full py-0">
                  <CardBody className="bg-transparent w-full py-0">
                    <CardItem translateZ={20} className="w-full">
                      <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                        <h3 className="text-xl font-semibold text-primary mb-2">Unlimited Creativity</h3>
                        <p className="text-accent/80 text-sm">Generate content across multiple formats and channels with no limitations.</p>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
              
              <HoverGlowEffect containerClassName="w-full md:w-auto">
                <CardContainer className="w-full py-0">
                  <CardBody className="bg-transparent w-full py-0">
                    <CardItem translateZ={20} className="w-full">
                      <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                        <h3 className="text-xl font-semibold text-primary mb-2">24/7 Availability</h3>
                        <p className="text-accent/80 text-sm">Your AI writing assistant is always ready to help, whenever inspiration strikes.</p>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            
            <MovingBorder borderRadius="0.5rem" containerClassName="inline-block p-0.5">
              <Link 
                href="/sign-up" 
                className="px-8 py-4 bg-background text-primary rounded-md hover:bg-background/90 transition-colors font-medium text-lg inline-block"
              >
                Get Started Today
              </Link>
            </MovingBorder>
          </div>
        </div>
      </section>
    </div>
  );
}

const testimonials = [
  {
    avatar: "👩‍💼",
    name: "Sarah Johnson",
    title: "Marketing Director",
    quote: "AutonoBee has revolutionized our content strategy. We&apos;re creating twice the content in half the time, with even better results!"
  },
  {
    avatar: "👨‍💻",
    name: "David Chen",
    title: "Content Creator",
    quote: "As someone who writes daily, AutonoBee has become my secret weapon. The AI suggestions are uncannily good."
  },
  {
    avatar: "👩‍🎓",
    name: "Emma Rodriguez",
    title: "Freelance Writer",
    quote: "I&apos;ve tried many AI writing tools, but AutonoBee stands apart with its intuitive interface and powerful capabilities."
  },
  {
    avatar: "👨‍🚀",
    name: "Michael Lee",
    title: "Startup Founder",
    quote: "AutonoBee helped our small team punch above our weight with professional content that engages our audience effectively."
  },
  {
    avatar: "👩‍💻",
    name: "Jennifer Kim",
    title: "Digital Marketer",
    quote: "The analytics and optimization suggestions have improved our engagement metrics by over 45% in just two months."
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    period: "per month",
    description: "Perfect for individuals and small projects",
    features: [
      "1,000 AI generations per month",
      "5 saved templates",
      "Basic content analytics",
      "Email support"
    ],
    buttonText: "Get Started",
    isPopular: false
  },
  {
    name: "Professional",
    price: "$29",
    period: "per month",
    description: "Ideal for professionals and growing businesses",
    features: [
      "Unlimited AI generations",
      "25 saved templates",
      "Advanced content analytics",
      "Priority support",
      "SEO optimization tools"
    ],
    buttonText: "Try Professional",
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and large-scale content operations",
    features: [
      "Unlimited everything",
      "Team collaboration tools",
      "Custom AI training",
      "Dedicated account manager",
      "API access"
    ],
    buttonText: "Contact Sales",
    isPopular: false
  }
];

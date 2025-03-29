export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: "Content Creator Bee",
    role: "Content Creation",
    bio: "Generates engaging social media content and blog posts.",
    image: "/images/robots/content creator bee.png",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  },
  {
    name: "Analytics Expert Bee",
    role: "Data Analysis",
    bio: "Analyzes data and provides actionable insights.",
    image: "/images/robots/analytics expert bee.png",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  },
  {
    name: "Community Manager Bee",
    role: "Community Management",
    bio: "Engages with followers and manages social media presence.",
    image: "/images/robots/community manager bee.png",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  },
  {
    name: "Visual Designer Bee",
    role: "Visual Design",
    bio: "Creates stunning visuals and graphics for your content.",
    image: "/images/robots/visual designer.png",
    social: {
      twitter: "https://twitter.com",
      github: "https://github.com"
    }
  },
  {
    name: "AI Assistant Bee",
    role: "AI Assistant",
    bio: "Helps with various tasks using AI.",
    image: "/images/robots/community manager.png",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  }
]; 
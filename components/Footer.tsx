import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="py-10 border-t border-primary/10 backdrop-blur-sm bg-background/90">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 text-center md:text-left">
            <Logo />
            <p className="text-accent/60 mt-4 text-sm">
              AI-powered content creation platform tailored for your unique needs.
            </p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h4 className="font-display text-xl mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/content-creation" className="text-accent/70 hover:text-primary transition-colors">Content Creation</Link></li>
                <li><Link href="/chat" className="text-accent/70 hover:text-primary transition-colors">Chat</Link></li>
                <li><Link href="/trends" className="text-accent/70 hover:text-primary transition-colors">Trends</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="font-display text-xl mb-4">Analytics</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-accent/70 hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/analytics" className="text-accent/70 hover:text-primary transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="font-display text-xl mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-accent/70 hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/team" className="text-accent/70 hover:text-primary transition-colors">Team</Link></li>
                <li><Link href="/privacy" className="text-accent/70 hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-accent/70 hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-accent/50 text-sm">© 2024 AutonoBee. All rights reserved.</p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://x.com/autonobee" target="_blank" rel="noopener noreferrer" className="text-accent/70 hover:text-primary transition-colors">
              <span className="sr-only">X (formerly Twitter)</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
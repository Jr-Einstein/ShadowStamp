
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UploadCloud, FileSearch, Eye, Github, Database, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

export default function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2",
      scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container flex justify-between items-center px-4 h-16">
        <Link to="/" className="flex items-center gap-2 z-50">
          <Shield size={24} className="text-shadow" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-shadow-light to-shadow">
            ShadowStamp
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground/80 hover:text-foreground bg-transparent hover:bg-transparent focus:bg-transparent">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link to="/embed" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-shadow/20 to-shadow/5 p-6 no-underline outline-none focus:shadow-md">
                          <Shield className="h-6 w-6 text-shadow mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            ShadowStamp
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Advanced document security with invisible watermarks and blockchain verification
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/embed" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Watermarking</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            DCT/DWT techniques for invisible protection
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/blockchain" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Blockchain Registration</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tamper-proof proof of ownership
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/verify" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">AR Visualization</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Interactive 3D watermark experiences
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/embed" className="text-foreground/80 hover:text-foreground flex items-center gap-1.5">
            <UploadCloud size={18} />
            <span>Embed</span>
          </Link>
          <Link to="/verify" className="text-foreground/80 hover:text-foreground flex items-center gap-1.5">
            <FileSearch size={18} />
            <span>Verify</span>
          </Link>
          <Link to="/blockchain" className="text-foreground/80 hover:text-foreground flex items-center gap-1.5">
            <Database size={18} />
            <span>Blockchain</span>
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground flex items-center gap-1.5">
            <Eye size={18} />
            <span>About</span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2 z-50">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-foreground/70 hover:text-foreground"
          >
            <Github size={20} />
          </a>
          <Button variant="outline" className="ml-2 hidden md:flex">
            Sign In
          </Button>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 md:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="container pt-20 px-4 pb-6">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/embed" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UploadCloud size={18} />
              <span>Embed Watermark</span>
            </Link>
            <Link 
              to="/verify" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileSearch size={18} />
              <span>Verify Document</span>
            </Link>
            <Link 
              to="/blockchain" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Database size={18} />
              <span>Blockchain Registration</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Eye size={18} />
              <span>About</span>
            </Link>
            
            <hr className="border-border my-2" />
            
            <Button className="w-full">
              Sign In
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

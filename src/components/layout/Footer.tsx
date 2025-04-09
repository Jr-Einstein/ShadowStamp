
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Database, UploadCloud, FileSearch, Eye } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function Footer() {
  return (
    <footer className="bg-card py-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={24} className="text-shadow" />
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-shadow-light to-shadow">
                ShadowStamp
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Advanced watermarking technology using DCT/DWT techniques with blockchain verification 
              and AR visualization for tamper-proof document security.
            </p>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-foreground/70 hover:text-foreground">
                <Github size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground">
                <Linkedin size={20} />
              </a>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                <strong>Team WhiteHatLovers</strong><br />
                Securing digital content with invisible watermarking technology
              </p>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium text-lg mb-3">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/embed" className="text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                  <UploadCloud size={16} />
                  <span>Embed</span>
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                  <FileSearch size={16} />
                  <span>Verify</span>
                </Link>
              </li>
              <li>
                <Link to="/blockchain" className="text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                  <Database size={16} />
                  <span>Blockchain</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>About</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium text-lg mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <ContactForm />
          </div>
        </div>
        
        <div className="mt-10 pt-4 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; 2025 ShadowStamp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

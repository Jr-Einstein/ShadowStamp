
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, FileCheck, FileWarning, Lock, Eye, BarChart3, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveBackground from '@/components/InteractiveBackground';
import PiracyStatsChart from '@/components/PiracyStatsChart';
import ProjectPhases from '@/components/ProjectPhases';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <InteractiveBackground />
      
      {/* Hero Section */}
      <section className="relative watermark-bg pt-28 pb-16 px-4 flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-90"></div>
        
        <motion.div 
          className="container relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-shadow-light via-shadow to-shadow-dark"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ShadowStamp
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl font-light mb-3 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Team WhiteHatLovers
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl font-light mb-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Invisible AI-powered watermarks with blockchain verification and AR visualization for secure document protection
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button asChild size="lg" className="px-8">
              <Link to="/embed">
                Secure Your Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/verify">
                Verify Documents
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-shadow-light/10 to-shadow/5 border border-shadow/10">
                <div className="h-16 w-16 rounded-full bg-shadow/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-shadow" />
                </div>
                <h3 className="text-sm font-medium mb-2">Secure Watermarking</h3>
                <p className="text-xs text-muted-foreground">Invisible protection for your valuable documents</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-shadow-light/10 to-shadow/5 border border-shadow/10">
                <div className="h-16 w-16 rounded-full bg-shadow/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-shadow" />
                </div>
                <h3 className="text-sm font-medium mb-2">Blockchain Verification</h3>
                <p className="text-xs text-muted-foreground">Tamper-proof evidence on the blockchain</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-shadow-light/10 to-shadow/5 border border-shadow/10">
                <div className="h-16 w-16 rounded-full bg-shadow/10 flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-shadow" />
                </div>
                <h3 className="text-sm font-medium mb-2">AR Visualization</h3>
                <p className="text-xs text-muted-foreground">See your watermarks come to life with AR</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Security Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="security-border">
              <CardHeader className="pb-2">
                <Shield className="h-8 w-8 mb-2 text-shadow" />
                <CardTitle>Invisible Watermarking</CardTitle>
                <CardDescription>
                  DCT/DWT algorithms embed watermarks that are invisible to the human eye
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Our advanced algorithms embed watermarks in the frequency domain, making them resilient to common image manipulations while remaining imperceptible.
                </p>
              </CardContent>
            </Card>
            
            <Card className="security-border">
              <CardHeader className="pb-2">
                <FileCheck className="h-8 w-8 mb-2 text-shadow" />
                <CardTitle>Tamper Detection</CardTitle>
                <CardDescription>
                  Automatically detect if your documents have been modified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Our system can identify specific areas that have been tampered with, providing detailed forensic analysis of document alterations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="security-border">
              <CardHeader className="pb-2">
                <QrCode className="h-8 w-8 mb-2 text-shadow" />
                <CardTitle>AR Visualization</CardTitle>
                <CardDescription>
                  View extracted watermarks through immersive AR experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Unlock augmented reality content embedded in your documents, providing an innovative way to verify authenticity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Animation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How ShadowStamp Works</h2>
          
          <div className="relative">
            {/* Timeline line - Removed because of Wrong Indentation*/}
            {/* <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-shadow-light to-shadow/30 hidden md:block"></div> */}
            
            <motion.div 
              className="space-y-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
            >
              <motion.div 
                className="flex gap-6 items-center"
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
              >
                <div className="w-20 h-20 rounded-full bg-shadow/20 flex items-center justify-center shrink-0 relative z-10">
                  <Lock className="h-8 w-8 text-shadow" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Embed Your Watermark</h3>
                  <p className="text-muted-foreground">
                    Upload your document and choose your watermark type - text, image, or AR link.
                    Our advanced AI algorithms will embed the watermark invisibly using either DCT or DWT techniques.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex gap-6 items-center"
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
              >
                <div className="w-20 h-20 rounded-full bg-shadow/20 flex items-center justify-center shrink-0 relative z-10">
                  <BarChart3 className="h-8 w-8 text-shadow" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">2. Blockchain Registration</h3>
                  <p className="text-muted-foreground">
                    A unique fingerprint of your document is stored on the blockchain,
                    creating an immutable record that can be used to verify authenticity later.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex gap-6 items-center"
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
              >
                <div className="w-20 h-20 rounded-full bg-shadow/20 flex items-center justify-center shrink-0 relative z-10">
                  <Eye className="h-8 w-8 text-shadow" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">3. Verification & AR Experience</h3>
                  <p className="text-muted-foreground">
                    When it's time to verify, our system extracts the hidden watermark
                    and checks it against the blockchain record. If AR content is embedded,
                    it can be visualized in augmented reality.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Piracy Stats Chart */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The Growing Problem of Piracy</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Digital piracy costs industries billions annually. Our interactive chart shows the increasing financial impact and frequency of piracy incidents globally.
          </p>
          <PiracyStatsChart />
        </div>
      </section>
      
      {/* Project Phases */}
      <ProjectPhases />
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-shadow/5 border-y border-border">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Documents?</h2>
          <p className="text-muted-foreground mb-8">
            Start embedding invisible watermarks and protecting your digital assets today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/embed">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/blockchain">
                Blockchain Registration
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

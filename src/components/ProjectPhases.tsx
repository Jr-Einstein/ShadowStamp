
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Shield, QrCode, Link, Database, Eye } from 'lucide-react';

const phases = [
  {
    id: 1,
    title: "Phase 1: Core Watermarking",
    description: "Development of invisible DCT/DWT watermarking algorithms with text, image, and AR content support.",
    features: [
      "Invisible watermark embedding",
      "Multiple algorithm options (DCT/DWT)",
      "Tamper detection capability",
      "Password protection"
    ],
    icon: Shield,
    status: "completed"
  },
  {
    id: 2,
    title: "Phase 2: Blockchain Integration",
    description: "Secure document fingerprinting with blockchain registration and verification.",
    features: [
      "Document fingerprinting",
      "Blockchain registration",
      "Verification certificates",
      "Immutable timestamp proof"
    ],
    icon: Database,
    status: "completed"
  },
  {
    id: 3,
    title: "Phase 3: Advanced Visualization",
    description: "Integration of AR/3D visualization for watermark content and verification data.",
    features: [
      "3D watermark visualization",
      "Verification heat maps",
      "AR content embedding",
      "QR code generation"
    ],
    icon: Eye,
    status: "active"
  },
  {
    id: 4,
    title: "Phase 4: Enterprise Features",
    description: "Advanced features for enterprise use cases including batch processing and analytics.",
    features: [
      "Batch document processing",
      "Analytics dashboard",
      "API access for third-party integration",
      "Custom verification workflows"
    ],
    icon: Link,
    status: "upcoming"
  }
];

const ProjectPhases: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const phaseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="py-16 px-4">
      <motion.div 
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-shadow-light to-shadow">Project Roadmap</h2>
          <p className="text-muted-foreground mt-2">Development phases of Team WhiteHatLovers' ShadowStamp project</p>
        </div>

        <div className="relative space-y-16">
          {/* Phases */}
          {phases.map((phase, index) => (
            <motion.div 
              key={phase.id} 
              className="flex flex-col items-center"
              variants={phaseVariants}
            >
              {/* Phase content card */}
              <div className={`w-full max-w-3xl mx-auto bg-card p-6 rounded-lg border-2 ${
                phase.status === 'completed' 
                  ? 'border-green-500/20' 
                  : phase.status === 'active'
                    ? 'border-shadow/30' 
                    : 'border-muted'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-shadow/10 flex items-center justify-center shrink-0 border border-shadow/20">
                    <phase.icon className="h-8 w-8 text-shadow" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {phase.status === 'completed' ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : phase.status === 'active' ? (
                        <Circle size={16} className="text-shadow fill-shadow" />
                      ) : (
                        <Circle size={16} className="text-muted-foreground" />
                      )}
                      <h3 className={`text-xl font-bold ${
                        phase.status === 'completed' 
                          ? 'text-green-500' 
                          : phase.status === 'active'
                            ? 'text-shadow' 
                            : 'text-muted-foreground'
                      }`}>{phase.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 ml-4">
                  {phase.features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-2"
                      variants={featureVariants}
                      custom={i}
                    >
                      <ArrowRight size={14} className="text-shadow flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Connecting dot/arrow if not the last item */}
              {index < phases.length - 1 && (
                <div className="my-2 text-shadow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectPhases;

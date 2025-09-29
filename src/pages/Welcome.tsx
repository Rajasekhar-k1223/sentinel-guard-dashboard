import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Zap, Cloud, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner-new.jpg";
import sentinelLogo from "@/assets/sentinel-logo-new.png";

const Welcome = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Threat Detection",
      description: "AI-powered threat detection with real-time monitoring and response capabilities"
    },
    {
      icon: Lock,
      title: "Zero Trust Security",
      description: "Comprehensive security framework with continuous verification and validation"
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Round-the-clock surveillance of your digital infrastructure and assets"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Automated incident response and threat mitigation in real-time"
    },
    {
      icon: Cloud,
      title: "Cloud-Native",
      description: "Scalable cloud infrastructure with enterprise-grade security controls"
    },
    {
      icon: Bot,
      title: "AI-Driven Analytics",
      description: "Machine learning algorithms for predictive threat intelligence"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                <img src={sentinelLogo} alt="SentinelAI Logo" className="h-10 w-10" />
              </div>
              <span className="text-lg font-semibold text-primary">SentinelAI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Next-Generation
              <br />
              <span className="text-primary">Cybersecurity</span>
              <br />
              Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Protect your digital infrastructure with AI-powered threat detection, 
              real-time monitoring, and automated response capabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/login">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Comprehensive Security Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From threat detection to incident response, SentinelAI provides enterprise-grade 
              security tools powered by artificial intelligence and machine learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Secure Your Infrastructure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of organizations that trust SentinelAI to protect their digital assets.
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-6">
              <Link to="/login">
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
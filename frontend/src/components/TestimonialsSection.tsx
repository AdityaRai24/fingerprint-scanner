
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, SecureFinance",
      content: "BiometriVerify has transformed our customer onboarding process. We've reduced fraud by 98% while speeding up verification times.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Head of Security, GlobalID",
      content: "The accuracy of their fingerprint recognition is unmatched. Integration was seamless, and our customers love the quick experience.",
      avatar: "DC",
      rating: 5,
    },
    {
      name: "Michael Roberts",
      role: "Product Lead, TechNova",
      content: "We evaluated multiple biometric solutions and BiometriVerify outperformed them all. The system's adaptability to different use cases is impressive.",
      avatar: "MR",
      rating: 4,
    },
  ];

  const stats = [
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "<0.5s", label: "Verification Speed" },
    { value: "500+", label: "Enterprise Clients" },
    { value: "1B+", label: "Verifications Monthly" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </motion.h2>
        </div>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-xl p-6 text-center border border-muted hover:border-primary/30 transition-all duration-300"
              variants={itemVariants}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-gradient mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-foreground/70">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-xl p-6 border border-muted hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                  />
                ))}
              </div>
              
              <p className="text-foreground/80 mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button className="hero-button group">
            <span>Read more case studies</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

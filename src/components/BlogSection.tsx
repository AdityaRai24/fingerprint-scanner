
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Button } from './ui/button';

const BlogSection = () => {
  const blogPosts = [
    {
      title: "The Future of Biometric Authentication in Financial Services",
      excerpt: "Explore how biometric verification is transforming security protocols in banking and financial institutions.",
      category: "Industry",
      date: "May 8, 2023",
      author: "Alex Morgan",
      readTime: "5 min read",
    },
    {
      title: "Understanding Fingerprint Analysis Algorithms",
      excerpt: "A deep dive into the technologies powering modern fingerprint recognition systems and their evolution.",
      category: "Technology",
      date: "Apr 22, 2023",
      author: "Dr. Leila Chen",
      readTime: "8 min read",
    },
    {
      title: "Biometric Data Protection: Best Practices for Enterprises",
      excerpt: "Key strategies for securing biometric information while maintaining usability and compliance with regulations.",
      category: "Security",
      date: "Mar 15, 2023",
      author: "Sam Wilson",
      readTime: "6 min read",
    }
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
    <section id="blog" className="py-20 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-foreground/70 max-w-md">
              Stay updated with the latest trends and advancements in biometric verification technology.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Button className="hero-button group">
              <span>View all articles</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
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
          {blogPosts.map((post, index) => (
            <motion.div 
              key={index} 
              className="bg-card border border-muted hover:border-primary/30 rounded-xl overflow-hidden transition-all duration-300 group hover:-translate-y-1"
              variants={itemVariants}
            >
              {/* Placeholder for blog image */}
              <div className="h-48 bg-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                
                {/* Category tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-foreground/70 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-muted">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;

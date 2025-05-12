'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Fingerprint } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#process' },
    { name: 'Capture', href: '/capture' },
    { name: 'Search', href: '/search' },
  ];
  
  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Fingerprint className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-gradient">Biometric Verify</span>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </a>
            </li>
          ))}
          <Link href={session ? "/capture" : "/signup"}>
            <Button className="hero-button ml-4">Get Started</Button>
          </Link>
        </ul>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-background/95 z-40 md:hidden pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ul className="flex flex-col items-center space-y-6 p-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-lg font-medium text-foreground/80 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <Link href={session ? "/capture" : "/signup"}>
              <Button 
                className="hero-button w-full mt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Button>
            </Link>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavBar;

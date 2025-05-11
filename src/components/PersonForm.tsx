"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveUser } from "@/app/actions/saveUser";
import { toast } from "sonner";
import { UserCircle2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PersonFormProps {
  faceImage?: string;
  thumbImage?: string;
}

export default function PersonForm({ faceImage, thumbImage }: PersonFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      try {
        await saveUser({
          firstName,
          lastName,
          address,
          additionalInfo,
          faceImage,
          thumbImage,
        });
        setSuccess("Saved successfully!");
        setFirstName("");
        setLastName("");
        setAddress("");
        setAdditionalInfo("");
        toast.success("Person information saved successfully!");
      } catch (err) {
        toast.error("Failed to save person information.");
        console.error(err);
        setError("Failed to save.");
      }
    });
  };

  return (
    <Card className="h-full flex flex-col glass animate-fade-in border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCircle2 className="w-6 h-6 text-primary" />
            </div>
            <span>Person Information</span>
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form 
          onSubmit={handleSave} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-animated bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                required
              />
            </motion.div>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-animated bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                required
              />
            </motion.div>
          </div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-animated min-h-[80px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
              required
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Textarea
              placeholder="Additional Information"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="input-animated min-h-[100px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 relative overflow-hidden group"
              disabled={loading || !faceImage || !thumbImage}
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Save Information
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </motion.div>

          {success && (
            <motion.div 
              className="flex items-center text-green-500 bg-green-500/10 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div 
              className="flex items-center text-red-500 bg-red-500/10 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}
        </motion.form>
      </CardContent>
    </Card>
  );
}

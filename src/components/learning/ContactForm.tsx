"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agreeToPolicy: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreeToPolicy) {
      setError("Please agree to the Privacy Policy");
      return;
    }

    setSubmitting(true);

    // Simulate API call - replace with actual backend endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        agreeToPolicy: false,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="mt-6 rounded-[22px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center"
      onSubmit={handleSubmit}
    >
      <div className="p-6 md:p-8 bg-[#000237]/50 backdrop-blur-sm border-[5px] border-[#2D2D2D] rounded-[22px]">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-white text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-white/80">
              Thank you for contacting us. We&apos;ll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-white/90 text-sm mb-1 font-medium">
                Name<span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9] transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white/90 text-sm mb-1 font-medium">
                Email<span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9] transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-white/90 text-sm mb-1 font-medium">
                Subject<span className="text-red-400">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9] transition-all"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white/90 text-sm mb-1 font-medium">
                Message<span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#0058C9] transition-all resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-white/85 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToPolicy"
                checked={formData.agreeToPolicy}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 rounded border-2 border-[#2D2D2D] bg-white/90 text-[#0058C9] focus:ring-2 focus:ring-[#0058C9] cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <a
                  className="text-white underline font-medium hover:text-[#0058C9] transition-colors"
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border-2 border-red-500 text-white"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="mt-2 w-full text-white px-6 py-3.5 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </form>
  );
}


/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import BlockTitle from "@/components/learning/BlockTitle";
import ContactForm from "@/components/learning/ContactForm";
import Footer from "@/components/main/footer";
import SocialIcons from "@/components/learning/SocialIcons";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Full-width hero banner */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[url('/img/bg6.jpg')] bg-cover bg-center">
          {/* background texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(800px 280px at 50% 35%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%), radial-gradient(500px 180px at 15% 40%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%), radial-gradient(500px 180px at 85% 40%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%)",
            }}
          />

          <div className="relative max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-16 md:py-24 min-h-[240px] md:min-h-[320px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <BlockTitle text="Contact Us" className="mx-auto" />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-white/90 mt-4 text-lg md:text-xl max-w-[700px] mx-auto"
              >
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </motion.p>
            </motion.div>

            {/* decorative characters */}
            <motion.img
              src="/img/martian.png"
              alt=""
              className="pointer-events-none absolute left-4 md:left-10 bottom-0 w-[110px] md:w-[160px] opacity-95 drop-shadow-[0_12px_0_rgba(0,0,0,0.18)]"
              animate={{
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src="/img/ufo.png"
              alt=""
              className="pointer-events-none absolute right-4 md:right-10 bottom-2 w-[120px] md:w-[180px] opacity-95 drop-shadow-[0_12px_0_rgba(0,0,0,0.18)]"
              animate={{
                y: [0, -15, 0],
                rotate: [2, -2, 2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Mail,
              title: "Email Us",
              content: "hola@stgeorge.ec",
              link: "mailto:hola@stgeorge.et",
              color: "#0058C9",
            },
            {
              icon: Phone,
              title: "Call Us",
              content: "+523 99 123 4567",
              link: "tel:+523991234567",
              color: "#B4005A",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              content: "Baños, Ecuador",
              link: "https://maps.google.com",
              color: "#D97706",
            },
            {
              icon: Clock,
              title: "Working Hours",
              content: "Mon-Fri: 8AM-6PM",
              link: null,
              color: "#5B2AA6",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden"
              style={{ backgroundColor: item.color }}
            >
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-[#2D2D2D] flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/90 hover:text-white hover:underline text-sm"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-white/90 text-sm">{item.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact section */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-16">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center px-6 md:px-12 py-10 md:py-14">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Left info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-white text-2xl md:text-4xl font-extrabold">
                  Get in touch with us!
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-2">
                  We are working on offering you the best learning experience.
                </p>

                <ul className="mt-6 space-y-3 text-white/85 text-sm md:text-base leading-7">
                  {[
                    "If you want to get a free trial class",
                    "If you want to receive information about our methods and programs",
                    "If you want to be updated with our latest courses",
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="flex gap-3"
                    >
                      <span className="mt-2.5 inline-block w-2 h-2 rounded-full bg-[#0058C9]" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-6 p-5 rounded-[18px] border-2 border-[#2D2D2D] bg-white/10 backdrop-blur-sm"
                >
                  <p className="text-white/90 text-sm md:text-base">
                    For more information, contact us at:
                  </p>
                  <a
                    href="mailto:hola@stgeorge.ec"
                    className="text-white text-lg font-bold underline hover:text-[#0058C9] transition-colors mt-2 inline-block"
                  >
                    hola@stgeorge.ec
                  </a>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-6"
                >
                  <p className="text-white/90 text-sm mb-3">Follow us on social media:</p>
                  <SocialIcons size={24} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-8 rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden bg-[#000237]/35"
                >
                  <div className="relative h-[210px] md:h-[260px] flex items-end justify-center">
                    <img
                      src="https://stgeorge.ec/img/trabaja/work.png"
                      alt=""
                      className="w-[220px] md:w-[290px] object-contain translate-y-4"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Right form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-white text-2xl md:text-4xl font-extrabold">
                  Send us a message
                </h2>
                <p className="text-white/75 text-sm md:text-base mt-2">
                  Your email address will not be published. Required fields are marked with *.
                </p>

                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


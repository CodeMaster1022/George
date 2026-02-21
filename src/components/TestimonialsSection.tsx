"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  age: number;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  fullText: string;
  color: string;
  reviewUrl?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jennifer Gutierrez Chavez",
    age: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    rating: 5,
    title: "",
    text: "An excellent person with a unique teaching style. He has a lot of patience with us...",
    fullText: "An excellent person with a unique teaching style. He has a lot of patience with us. The course: Incredible, very good, and they are very welcoming.",
    color: "#5B2AA6",
    reviewUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xReFdGTkNTVWhVUkdVeGVsODNPVnBaZEZWSFdYYxAB!2m1!1s0x0:0x8f4057b52dfbbc99!3m1!1s2@1:CAIQACodChtycF9oOlQxWFNCSUhURGUxel83OVpZdFVHWXc%7C0dFB9BWJUj2%7C",
  },
  {
    id: 2,
    name: "Daniela Moya",
    age: 10,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    rating: 5,
    title: "You always make me happy!",
    text: "It was a very engaging and interesting experience. Thanks to Professor Dennis's inst...",
    fullText: "It was a very engaging and interesting experience. Thanks to Professor Dennis's instruction, we learned how to communicate effectively with tourists and provide better service, now that we have improved our English pronunciation and communication skills. Thank you to St. George for offering these courses, and we hope there will be many more.",
    color: "#B4005A",
    reviewUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pkU1lrVlFPRFJCY2psTVF6TkJjakpWUzA1eGRWRRAB!2m1!1s0x0:0x8f4057b52dfbbc99!3m1!1s2@1:CAIQACodChtycF9oOjdSYkVQODRBcjlMQzNBcjJVS05xdVE%7C0dFB03J0iGH%7C",
  },
  {
    id: 3,
    name: "karlita Carrillo",
    age: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cathan",
    rating: 5,
    title: "This teacher was amazing!",
    text: "Excellent teacher, very dedicated and patient when teaching. Teacher Denise always motivates her students, explains clearly, and creates a trusting environment that mak...",
    fullText: "Excellent teacher, very dedicated and patient when teaching. Teacher Denise always motivates her students, explains clearly, and creates a trusting environment that makes learning English easier and more enjoyable. Her commitment and passion are evident in every class. The English course was excellent, very dynamic and practical. It helped me improve my knowledge, gain more confidence when speaking, and stay motivated to continue learning. Highly recommended. ",
    color: "#D97706",
    reviewUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pkU1lrVlFPRFJCY2psTVF6TkJjakpWUzA1eGRWRRAB!2m1!1s0x0:0x8f4057b52dfbbc99!3m1!1s2@1:CAIQACodChtycF9oOjdSYkVQODRBcjlMQzNBcjJVS05xdVE%7C0dFB03J0iGH%7C",
  },
  {
    id: 4,
    name: "Ricardo Carrillo",
    age: 11,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    rating: 5,
    title: "Best English classes ever!",
    text: "Excellent English school. I've learned so much in a short time, from new expressions to basic differences like 'could' and 'would' as well as several useful adject...",
    fullText: "Excellent English school. I've learned so much in a short time, from new expressions to basic differences like 'could' and 'would' as well as several useful adjectives. The teacher, Natalia, has a very clear and effective teaching style and methodology. I highly recommend it here in Baños.",
    color: "#0058C9",
    reviewUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s5WmRYZEhhR1Z2UkhCSk9UbFNhbTFmTTNkRVZuYxAB!2m1!1s0x0:0x8f4057b52dfbbc99!3m1!1s2@1:CAIQACodChtycF9oOk9ZdXdHaGVvRHBJOTlSam1fM3dEVnc%7C0dAQEPChIRw%7C",
  },
  {
    id: 5,
    name: "Mayerlim Zavarce",
    age: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    rating: 5,
    title: "I improved so much!",
    text: "Thank you so much for your kind words! We are proud to have such a dedicated and passionate team of teachers. Knowing that we...",
    fullText: "Thank you so much for your kind words! We are proud to have such a dedicated and passionate team of teachers. Knowing that we have exceeded your expectations is our greatest motivation. We look forward to welcoming you back!",
    color: "#00A3D9",
    reviewUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pKVFpub3dVRnBCZFhWRFMzWndNazVsVUdac1ZYYxAB!2m1!1s0x0:0x8f4057b52dfbbc99!3m1!1s2@1:CAIQACodChtycF9oOjJTZnowUFpBdXVDS3ZwMk5lUGZsVXc%7C0d8rIu8qNd8%7C",
  },
  {
    id: 6,
    name: "Terésse Vizuete",
    age: 10,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    rating: 5,
    title: "Learning is so easy now!",
    text: "We are so proud to read your comment! Teacher Natalia is an exceptional professional, and knowing that her techniques are so effective for your learning is the best new...",
    fullText: "We are so proud to read your comment! Teacher Natalia is an exceptional professional, and knowing that her techniques are so effective for your learning is the best news for us. We will let her know! Thank you for trusting in our method and in her.",
    color: "#5B2AA6",
    reviewUrl: "https://www.google.com/maps/reviews/@-1.3940468,-78.419493,17z/data=!3m1!4b1!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT2s5T2NETnFTelZVV2tadFdIcFZPRFJYTkMxdGJFRRAB!2m1!1s0x0:0x8f4057b52dfbbc99?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const visibleTestimonials = TESTIMONIALS.slice(currentIndex, currentIndex + 4);

  const handleNext = () => {
    if (currentIndex + 4 < TESTIMONIALS.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-24">
        <div className="text-center mb-8">
          <h2 className="text-white md:text-6xl text-3xl">What learners say</h2>
          
          {/* Google Rating Section */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex items-center gap-3">
              {/* Google Logo */}
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              
              {/* Rating */}
              <span className="text-white text-2xl font-bold">5.0</span>
              
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="32" height="32" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              
              {/* Review Count */}
              {/* <span className="text-white/80 text-2xl">(239)</span> */}
            </div>
            
            {/* Leave Review Button */}
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJt1YjaiGR05ERmbz7LbVXQI8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#34A853] hover:bg-[#2d9248] text-white text-lg font-semibold rounded-full border-2 border-[#2D2D2D] transition-colors"
            >
              Leave us a review on Google
            </a>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                z: 50,
                transition: { duration: 0.3 }
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: 1000
              }}
              className="border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:border-[#0058C9] hover:shadow-2xl hover:shadow-[#0058C9]/50 transition-colors"
            >
              <div className="py-4 px-2 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <motion.div 
                  className="bg-white/95 text-[#212429] rounded-[18px] border-21 border-[#2D2D2D] p-6 min-h-[330px] flex flex-col"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Avatar - Clickable */}
                  <motion.a
                    href={testimonial.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center -mt-10 mb-4 cursor-pointer group"
                    whileHover={{ scale: 1.15, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full border-4 border-[#2D2D2D] overflow-hidden"
                      style={{ backgroundColor: testimonial.color }}
                      whileHover={{ 
                        borderColor: "#0058C9",
                        rotate: 360
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </motion.a>

                  {/* Name - Clickable */}
                  <motion.a
                    href={testimonial.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-lg font-bold text-[#212429] mb-1 cursor-pointer"
                    whileHover={{ 
                      color: "#0058C9",
                      scale: 1.05,
                      x: 5
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {testimonial.name}
                  </motion.a>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        whileHover={{ 
                          scale: 1.3,
                          rotate: 360,
                          transition: { duration: 0.4 }
                        }}
                      >
                        <Star
                          className="w-4 h-4"
                          fill={i < testimonial.rating ? "#FFD700" : "none"}
                          stroke={i < testimonial.rating ? "#FFD700" : "#D1D5DB"}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Text */}
                  <motion.p 
                    className="text-sm md:text-base leading-6 text-[#3b3f46] flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {testimonial.text}
                  </motion.p>

                  {/* Read More Button */}
                  <motion.button
                    onClick={() => setSelectedTestimonial(testimonial)}
                    className="mt-4 text-[#0058C9] text-sm font-semibold"
                    whileHover={{ 
                      x: 10,
                      color: "#0058C9",
                      scale: 1.05
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Read more →
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 disabled:bg-gray-500 disabled:cursor-not-allowed border-2 border-[#2D2D2D] flex items-center justify-center text-white transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-white text-sm">
            {currentIndex + 1} - {Math.min(currentIndex + 4, TESTIMONIALS.length)} of {TESTIMONIALS.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex + 4 >= TESTIMONIALS.length}
            className="w-12 h-12 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 disabled:bg-gray-500 disabled:cursor-not-allowed border-2 border-[#2D2D2D] flex items-center justify-center text-white transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] border-[5px] border-[#2D2D2D] p-8 max-w-[600px] w-full relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Avatar - Clickable */}
              <a
                href={selectedTestimonial.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center mb-4 cursor-pointer group"
              >
                <div
                  className="w-20 h-20 rounded-full border-4 border-[#2D2D2D] overflow-hidden transition-transform group-hover:scale-110"
                  style={{ backgroundColor: selectedTestimonial.color }}
                >
                  <img
                    src={selectedTestimonial.avatar}
                    alt={selectedTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>

              {/* Name - Clickable */}
              <a
                href={selectedTestimonial.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xl font-bold text-[#212429] mb-2 hover:text-[#0058C9] transition-colors cursor-pointer block"
              >
                {selectedTestimonial.name}
              </a>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    fill={i < selectedTestimonial.rating ? "#FFD700" : "none"}
                    stroke={i < selectedTestimonial.rating ? "#FFD700" : "#D1D5DB"}
                  />
                ))}
              </div>

              {/* Full Text */}
              <p className="text-base leading-7 text-[#3b3f46]">
                {selectedTestimonial.fullText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

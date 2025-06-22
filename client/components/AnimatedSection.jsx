"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export function AnimatedSection({ children, className = "", animation = "fadeInUp", delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation()

  const animationClasses = {
    fadeInUp: isVisible
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-8 transition-all duration-700 ease-out",
    fadeInLeft: isVisible
      ? "opacity-100 translate-x-0 transition-all duration-700 ease-out"
      : "opacity-0 -translate-x-8 transition-all duration-700 ease-out",
    fadeInRight: isVisible
      ? "opacity-100 translate-x-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-x-8 transition-all duration-700 ease-out",
    fadeIn: isVisible
      ? "opacity-100 transition-all duration-700 ease-out"
      : "opacity-0 transition-all duration-700 ease-out",
    scaleIn: isVisible
      ? "opacity-100 scale-100 transition-all duration-700 ease-out"
      : "opacity-0 scale-95 transition-all duration-700 ease-out",
    slideInUp: isVisible
      ? "opacity-100 translate-y-0 transition-all duration-1000 ease-out"
      : "opacity-0 translate-y-16 transition-all duration-1000 ease-out",
  }

  return (
    <div ref={ref} className={`${animationClasses[animation]} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export function AnimatedCard({ children, className = "", index = 0, delay = 100 }) {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 transition-all duration-700 ease-out"
          : "opacity-0 translate-y-8 scale-95 transition-all duration-700 ease-out"
      } ${className}`}
      style={{ transitionDelay: `${index * delay}ms` }}
    >
      {children}
    </div>
  )
}

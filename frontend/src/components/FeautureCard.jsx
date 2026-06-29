import React, {useEffect, useState, useRef} from "react";
import { C } from "./Button";

export const FeatureCard = ({ f, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`,
      }}
    >
      <div
        className="nb"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: 32,
          background: f.bg,
          border: `3px solid ${C.ink}`,
          boxShadow: isHovered ? `10px 10px 0px ${C.ink}` : `4px 4px 0px ${C.ink}`,
          transform: isHovered ? 'translate(-6px, -6px)' : 'translate(0px, 0px)',
          transition: 'all 0.2s ease-in-out',
          height: '100%',
          cursor: 'default',
        }}
      >
        <div 
          className="sg" 
          style={{ 
            fontSize: 30, 
            marginBottom: 16,
            display: 'inline-block',
            transform: isHovered ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {f.icon}
        </div>
        <h3 className="sg" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 10 }}>{f.title}</h3>
        <p style={{ fontSize: 15, color: "#444", lineHeight: 1.6 }}>{f.desc}</p>
      </div>
    </div>
  );
};
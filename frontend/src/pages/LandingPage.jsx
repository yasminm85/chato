import React, { useState, useEffect, useRef } from 'react';
import Btn from '../components/Button.jsx';
import HeroChatDemo from '../components/HeroChatDemo.jsx';
import { useNavigate } from 'react-router-dom';
import Star from '../assets/landingpage/asset_1.svg';
import Triangle from '../assets/landingpage/asset_2.svg';
import Hollow from '../assets/landingpage/asset_3.svg';
import Box from '../assets/landingpage/asset_4.svg';
import Moon from '../assets/landingpage/asset_7.svg';
import Moon2 from '../assets/landingpage/asset_8.svg';
import Rectangle from '../assets/landingpage/asset_5.svg';
import Rectangle2 from '../assets/landingpage/asset_6.svg';
import Circle from '../assets/landingpage/asset_9.svg';
import Round from '../assets/landingpage/asset_10.svg';
import Tr from '../assets/landingpage/asset_11.svg';
import { AiOutlineSignature } from 'react-icons/ai';
import { RiEmotionLine } from 'react-icons/ri';
import { RiGlobalLine } from 'react-icons/ri';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const containerRef = useRef(null);
  const howRef = useRef(null);
  const heroRef = useRef(null);

  useGSAP(
  () => {
    const tlIntro = gsap.timeline();

    tlIntro.fromTo(
      '.hero-deco-spin-left',
      { x: -200, opacity: 0, rotation: -45 }, 
      { x: 0, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 
      0,
    );

    tlIntro.fromTo(
      '.hero-deco-spin-right',
      { x: 200, opacity: 0, rotation: 45 },
      { x: 0, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.2)' },
      0,
    );

    tlIntro.fromTo(
      '.hero-title',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
      '-=0.5',
    );

    tlIntro.fromTo(
      '.hero-badge',
      { scale: 0 },
      { scale: 1, duration: 0.5, ease: 'back.out(2)' },
      '-=0.4',
    );

    tlIntro.fromTo(
      '.hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3',
    );

    tlIntro.fromTo(
      '.hero-btn',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.8)',
        stagger: 0.15,
      },
      '-=0.4',
    );

    const tlScrollSpin = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    tlScrollSpin.to(
      '.hero-deco-spin-left',
      { rotation: -40, ease: 'none' },
      0,
    );

    tlScrollSpin.to(
      '.hero-deco-spin-right',
      { rotation: 40, ease: 'none' },
      0,
    );

    gsap.to('.float-slow-1', {
      y: 15,
      rotation: 6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.float-slow-2', {
      y: -20,
      rotation: -8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.3,
    });
  },
  { scope: heroRef },
);

  useGSAP(
    () => {
      gsap.from('.chat-demo-container', {
        scale: 0.7,
        rotation: -10,
        y: 150,
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: howRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        },
      });

      gsap.from('.how-deco', {
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: howRef.current,
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
        },
      });
    },
    { scope: howRef },
  );

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.from('.why-chato-card-center', {
          opacity: 0,
          scale: 0.5,
          duration: 2.2,
          ease: 'back.out(1.7)',
        });

        tl.from(
          '.why-chato-card-left',
          {
            xPercent: 100,
            x: 32,
            opacity: 0,
            duration: 2.3,
            ease: 'power4.out',
          },
          '-=0.2',
        ).from(
          '.why-chato-card-right',
          {
            xPercent: -100,
            x: -32,
            opacity: 0,
            duration: 2.3,
            ease: 'power4.out',
          },
          '<',
        );
      });

      mm.add('(max-width: 767px)', () => {
        gsap.from(
          '.why-chato-card-left, .why-chato-card-center, .why-chato-card-right',
          {
            opacity: 0,
            y: 40,
            stagger: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div>
      <section
        id="about"
        ref={heroRef}
        className="relative h-screen bg-[#87CEEB] flex items-center justify-center overflow-hidden border-b-4 border-black">
        <div className="hero-deco-spin-left absolute top-[12%] right-[90%] w-[100px] md:w-[200px] z-0">
          <img
            src={Star}
            alt="Star"
            className="float-slow-1 w-full h-full"
          />
        </div>

        <div className="hero-deco-spin-left absolute bottom-[20%] left-[15%] w-[100px] md:w-[130px] z-0">
          <img
            src={Triangle}
            alt="Hollow Triangle"
            className="float-slow-2 w-full h-full"
          />
        </div>

        <div className="hero-deco-spin-right absolute top-[25%] right-[5%] w-[120px] md:w-[150px] z-0">
          <img
            src={Triangle}
            alt="Triangle"
            className="float-slow-2 w-full h-full"
          />
        </div>

        <div className="hero-deco-spin-right absolute bottom-[-10%] right-[-15%] w-[200px] md:w-[300px] z-0">
          <img
            src={Box}
            alt="Purple Box"
            className="float-slow-1 w-full h-full rotate-[-15deg]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-[800px] px-6 mt-[-5%]">
          <h1 className="hero-title font-sg font-extrabold text-black leading-tight text-[48px] md:text-[72px] mb-6 tracking-tight">
            Chat With The World <br />
            <span className="hero-badge bg-[#FFE04B] text-[#1933CC] px-4 py-1 inline-block mt-2 border-2 border-black shadow-[3px_3px_0_0_#000]">
              Perfectly
            </span>
          </h1>

          <p className="hero-desc font-dm text-[18px] md:text-[24px] text-black mb-10 leading-relaxed max-w-[650px] font-medium">
            Have fun conversations while our AI provides helpful, unobtrusive
            grammar tips
          </p>

          <div className="flex gap-6">
            <button className="hero-btn bg-[#B088F9] text-black font-sg font-bold text-[16px] px-8 py-3 rounded-md border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all duration-150"
            onClick={() => token ? navigate('/chat') : navigate('/signup')}>
              Try For Free
            </button>
            <button className="hero-btn bg-white text-black font-sg font-bold text-[16px] px-8 py-3 rounded-md border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all duration-150"
            onClick={() => token ? navigate('/chat') : navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      <section
        id="how"
        ref={howRef}
        className="bg-[#4ECDC4] py-20 px-10 border-b-4 border-black relative overflow-hidden">
        <img
          src={Moon}
          alt="deco"
          className="how-deco absolute top-[8%] left-[4%] w-[80px] z-0"
        />
        <img
          src={Moon}
          alt="deco"
          className="how-deco absolute top-[8%] left-[5%] w-[80px] opacity-90 z-0"
        />
        <img
          src={Moon2}
          alt="deco"
          className="how-deco absolute top-[8%] left-[6%] w-[80px] opacity-80 z-0"
        />
        <img
          src={Circle}
          alt="deco"
          className="how-deco absolute top-[8%] right-[3%] w-[200px] z-0"
        />
        <img
          src={Rectangle2}
          alt="deco"
          className="how-deco absolute top-[30%] left-[5%] w-[200px] rotate-12 opacity-80 z-0"
        />
        <img
          src={Rectangle}
          alt="deco"
          className="how-deco absolute top-[80%] left-[3%] w-[200px] rotate-12 opacity-80 z-0"
        />
        <img
          src={Star}
          alt="deco"
          className="how-deco absolute top-[80%] right-[3%] w-[200px] rotate-12 opacity-80 z-0"
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-sg font-extrabold text-[32px] md:text-[52px] text-black tracking-tight uppercase inline-block border-4 border-black bg-[#FFE04B] px-8 py-3 shadow-[6px_6px_0_0_#000]">
              How It Works?
            </h2>
          </div>

          <div className="w-full flex justify-center chat-demo-container">
            <div className="w-full max-w-[460px] border-4 border-black p-2 bg-white shadow-[10px_10px_0_0_#000] rotate-[1deg] hover:rotate-0 transition-transform duration-200">
              <HeroChatDemo />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        ref={containerRef}
        className="bg-[#DAF5F0] py-24 px-10 border-b-4 border-black relative overflow-hidden">
        <img
          src={Box}
          alt="Purple Box"
          className="absolute top-[-10%] left-[-18%] w-[200px] md:w-[300px] rotate-[-15deg] z-0"
        />
        <img
          src={Tr}
          alt="triangle"
          className="absolute top-[-10%] right-[-8%] w-[200px] md:w-[300px] rotate-[-15deg] z-0"
        />

        <img
          src={Round}
          alt="round"
          className="absolute bottom-[-10%] right-[-15%] w-[200px] md:w-[300px] rotate-[-15deg] z-0"
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-sg font-extrabold text-[32px] md:text-[52px] text-ink tracking-tight uppercase inline-block border-4 border-ink bg-yellow px-8 py-3 shadow-[6px_6px_0_0_#0D0C0C]">
              Why Chato?
            </h2>
            <p className="font-dm text-[16px] md:text-[18px] text-ink mt-6 max-w-[550px] mx-auto font-medium">
              Meet new people or catch up with friends, all while getting
              helpful AI tips to perfect your English
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="why-chato-card-left z-0">
              <div className="bg-white border-[3px] border-black rounded-[20px] p-8 shadow-[5px_5px_0_0_#000] flex flex-col items-start transition-all duration-200 hover:translate-y-[-4px] hover:shadow-[7px_7px_0_0_#000] h-full">
                <div className="w-12 h-12 rounded-[12px] border-[3px] border-black bg-[#B088F9] flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#000]">
                  <span className="text-[22px]">
                    <AiOutlineSignature />
                  </span>
                </div>
                <h3 className="font-sg font-extrabold text-[20px] text-black mb-2 tracking-tight">
                  AI Corrections
                </h3>
                <p className="font-dm text-[14px] text-gray-600 leading-relaxed font-medium">
                  Receive subtle, non-intrusive grammar tips mid-conversation
                  that help you improve naturally
                </p>
              </div>
            </div>

            <div className="why-chato-card-center z-10">
              <div className="bg-white border-[3px] border-black rounded-[20px] p-8 shadow-[5px_5px_0_0_#000] flex flex-col items-start transition-all duration-200 hover:translate-y-[-4px] hover:shadow-[7px_7px_0_0_#000] h-full">
                <div className="w-12 h-12 rounded-[12px] border-[3px] border-black bg-[#4ECDC4] flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#000]">
                  <span className="text-[22px]">
                    <RiEmotionLine />
                  </span>
                </div>
                <h3 className="font-sg font-extrabold text-[20px] text-black mb-2 tracking-tight">
                  Online Friends
                </h3>
                <p className="font-dm text-[14px] text-gray-600 leading-relaxed font-medium">
                  Easily see who is online and start chatting with your existing
                  friends instantly
                </p>
              </div>
            </div>

            <div className="why-chato-card-right z-0">
              <div className="bg-white border-[3px] border-black rounded-[20px] p-8 shadow-[5px_5px_0_0_#000] flex flex-col items-start transition-all duration-200 hover:translate-y-[-4px] hover:shadow-[7px_7px_0_0_#000] h-full">
                <div className="w-12 h-12 rounded-[12px] border-[3px] border-black bg-[#FFE04B] flex items-center justify-center mb-6 shadow-[2px_2px_0_0_#000]">
                  <span className="text-[22px]">
                    <RiGlobalLine />
                  </span>
                </div>
                <h3 className="font-sg font-extrabold text-[20px] text-black mb-2 tracking-tight">
                  Global Connection
                </h3>
                <p className="font-dm text-[14px] text-gray-600 leading-relaxed font-medium">
                  Connect with English speakers and learners from all over the
                  world. Expand your horizon and make global friends instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

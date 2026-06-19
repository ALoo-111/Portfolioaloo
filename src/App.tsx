import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Target, 
  Swords, 
  Car, 
  Box, 
  Shield, 
  Play, 
  Mail, 
  Gamepad2, 
  User, 
  Cpu, 
  Map, 
  Award, 
  ArrowDown, 
  Instagram, 
  Twitter, 
  Layers,
  Send,
  Sparkles,
  Trophy,
  Activity,
  Terminal,
  Compass
} from 'lucide-react';

// Type definitions to keep the application stable and robust.
interface GameCardProps {
  title: string;
  badge: "ACTIVE" | "RANKED" | "MAXED" | "LEGEND" | "BUILDER" | "ELITE";
  accentColor: "green" | "cyan" | "purple";
  icon: React.ComponentType<any>;
  desc: string;
  image: string;
}

interface SkillCardProps {
  name: string;
  icon: string;
  level: number;
  accent: "green" | "cyan" | "purple";
}

interface ProjectCardProps {
  num: string;
  title: string;
  desc: string;
  iconName: string;
  image: string;
}

// ----------------------------------------------------
// Custom 3D Projected Canvas Background Component
// ----------------------------------------------------
const CyberParticleSpace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    // Track mouse position with easing
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle resizing on window changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Set up particles
    const particleCount = window.innerWidth < 768 ? 100 : 260;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      z: Math.random() * 400,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.3 ? 'rgba(0, 255, 136, 0.45)' : 'rgba(0, 238, 255, 0.45)'
    }));

    // Generate orbiting high-tech ring coordinates
    const ringSegments = 60;
    const innerRing = Array.from({ length: ringSegments }, (_, i) => {
      const angle = (i / ringSegments) * Math.PI * 2;
      return { x: Math.cos(angle) * 120, y: Math.sin(angle) * 120, z: (i % 2 === 0 ? 5 : -5) };
    });

    let rotationAngle = 0;

    const render = () => {
      // Clear with soft trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Mouse position interpolation for buttery smooth movement
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      rotationAngle += 0.003;

      // Project particles to standard 2D perspective screen coord
      const focalLength = 300;
      const originX = width / 2;
      const originY = height / 2;

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.03)';
      ctx.lineWidth = 1;
      const gridInterval = 60;
      for (let x = 0; x < width; x += gridInterval) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw particle elements
      particles.forEach((p) => {
        // Apply rotation around the Y axis
        const cosY = Math.cos(rotationAngle * 0.3);
        const sinY = Math.sin(rotationAngle * 0.3);
        const cosX = Math.cos(rotationAngle * 0.1);
        const sinX = Math.sin(rotationAngle * 0.1);

        // Position rotation calculations
        let rx = p.x * cosY - p.z * sinY;
        let rz = p.x * sinY + p.z * cosY;
        let ry = p.y * cosX - rz * sinX;
        rz = p.y * sinX + rz * cosX;

        // Apply mouse distortion offset
        rx += m.x * 25;
        ry += m.y * 15;

        // Translate perspective
        const distance = rz + 250;
        if (distance > 0) {
          const screenX = opacityTranslate(rx, distance, originX, focalLength);
          const screenY = opacityTranslate(ry, distance, originY, focalLength);
          const screenScale = focalLength / distance;

          if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size * screenScale, 0, Math.PI * 2);
            ctx.fill();

            // Link nearest neighbors in standard distance range
            if (p.z > 280) {
              ctx.strokeStyle = 'rgba(0,255,136,0.08)';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(screenX + (Math.random() - 0.5) * 30, screenY + (Math.random() - 0.5) * 30);
              ctx.stroke();
            }
          }
        }
      });

      // Render rotating outer vector scope ring on desktop
      if (window.innerWidth > 768) {
        ctx.strokeStyle = 'rgba(0, 238, 255, 0.09)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        innerRing.forEach((point, i) => {
          const cosY = Math.cos(rotationAngle * 0.6);
          const sinY = Math.sin(rotationAngle * 0.6);
          const rx = point.x * cosY - point.z * sinY;
          const rz = point.x * sinY + point.z * cosY;
          const ry = point.y;

          const distance = rz + 180;
          if (distance > 0) {
            const sx = opacityTranslate(rx, distance, originX, focalLength);
            const sy = opacityTranslate(ry, distance, originY, focalLength);

            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
        });
        ctx.closePath();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    function opacityTranslate(value: number, distance: number, origin: number, focal: number) {
      return (value * focal) / distance + origin;
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none z-1" />;
};

// ----------------------------------------------------
// High-tech matrix terminal background streams
// ----------------------------------------------------
interface MatrixRainProps {
  alpha?: string;
  canvasId: string;
}

const MatrixRainStream: React.FC<MatrixRainProps> = ({ alpha = 'rgba(0, 0, 0, 0.05)', canvasId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\';
    const fs = window.innerWidth < 768 ? 16 : 14;
    let cols = Math.floor(width / fs);
    let drops = Array(cols).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = alpha;
      ctx.fillRect(0, 0, width, height);

      // Primary color Neon Green (70% balance weight)
      ctx.fillStyle = '#00ff88';
      ctx.font = `${fs}px "Share Tech Mono"`;

      cols = Math.floor(width / fs);
      if (drops.length !== cols) {
        drops = Array(cols).fill(1);
      }

      drops.forEach((d, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fs, d * fs);
        if (d * fs > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [alpha]);

  return <canvas ref={canvasRef} id={canvasId} className="absolute inset-0 opacity-55 block pointer-events-none" />;
};

// ----------------------------------------------------
// Individual Premium Game Card with 3D Tilt & Zoom Placeholders
// ----------------------------------------------------
const GameCard: React.FC<GameCardProps> = ({ title, badge, accentColor, icon: IconComponent, desc, image }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth custom reactive 3D physical coordinate tilt handling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotateX = ((y / r.height) - 0.5) * -12; // Eased limit
    const rotateY = ((x / r.width) - 0.5) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Color mappings honoring specified exact ratios: 
  // 70% Neon Green (Primary), 20% Neon Cyan (Alt), 10% Neon Purple (Legend/Highlights)
  const badgeClasses = {
    green: "text-[#00ff88] border-[rgba(0,255,136,0.35)] shadow-[0_0_8px_rgba(0,255,136,0.25)]",
    cyan: "text-[#00eeff] border-[rgba(0,238,255,0.4)] shadow-[0_0_8px_rgba(0,238,255,0.25)]",
    purple: "text-[#bf5fff] border-[rgba(191,95,255,0.35)] shadow-[0_0_8px_rgba(191,95,255,0.25)]"
  };

  const borderGlowClasses = {
    green: "hover:border-[0.5px] hover:border-[#00ff88] hover:shadow-[0_15px_45px_rgba(0,255,136,0.18)]",
    cyan: "hover:border-[0.5px] hover:border-[#00eeff] hover:shadow-[0_15px_45px_rgba(0,238,255,0.18)]",
    purple: "hover:border-[0.5px] hover:border-[#bf5fff] hover:shadow-[0_15px_45px_rgba(191,95,255,0.18)]"
  };

  const lightGlowTheme = {
    green: "#00ff88",
    cyan: "#00eeff",
    purple: "#bf5fff"
  }[accentColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className={`game-card relative border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.03)] p-6 transition-all duration-300 overflow-hidden select-none cursor-pointer ${borderGlowClasses[accentColor]}`}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x !== 0 ? '-6px' : '0px'})`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[rgba(0,255,136,0.4)]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[rgba(0,255,136,0.4)]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[rgba(0,255,136,0.4)]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[rgba(0,255,136,0.4)]" />

      {/* Cybernetic Badge Tag */}
      <div className={`absolute top-4 right-4 font-mono text-[10px] tracking-[0.15em] px-2 py-[2px] border bg-black/80 z-20 ${badgeClasses[accentColor]}`}>
        {badge}
      </div>

      {/* 
        PREMIUM GAME LOGO CHAMBER
        - Implemented real responsive object-cover image with lazy zoom support and no-referrer strategy.
        - Preserved original animated bounce lasers, grid alignment arrays, corner brackets and shining covers.
      */}
      <div className="relative w-full h-40 bg-black/80 border border-slate-900/80 mb-5 overflow-hidden group/image-slot flex items-center justify-center">
        {/* Real Game Cover Image */}
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image-slot:scale-115"
        />
        {/* Semi-transparent cyberpunk dark layout veil */}
        <div className="absolute inset-0 bg-black/45 transition-colors duration-300 group-hover/image-slot:bg-transparent" />

        {/* Abstract futuristic blue-line grid layout backing */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(ellipse at center, ${lightGlowTheme}20, transparent 75%), 
                              linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, 0.05) 25%, rgba(0, 255, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.05) 75%, rgba(0, 255, 136, 0.05) 76%, transparent 77%), 
                              linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, 0.05) 25%, rgba(0, 255, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.05) 75%, rgba(0, 255, 136, 0.05) 76%, transparent 77%)`,
            backgroundSize: '100% 100%, 15px 15px, 15px 15px'
          }}
        />

        {/* Dynamic laser scan lines moving inside the placeholder chamber */}
        <div 
          className="absolute left-0 right-0 h-[1.5px] opacity-60 animate-bounce duration-5000"
          style={{
            background: `linear-gradient(90deg, transparent, ${lightGlowTheme}, transparent)`,
            boxShadow: `0 0 10px ${lightGlowTheme}, 0 0 20px ${lightGlowTheme}`
          }}
        />

        {/* Geometric focus metrics inside container boundaries */}
        <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-300/85 tracking-wider select-none bg-black/50 px-1 py-0.5 rounded">
          HDR_DEC: {badge}_SYS
        </span>
        <span className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-300/85 tracking-wider select-none bg-black/50 px-1 py-0.5 rounded">
          SYS_ENG_OK
        </span>

        {/* Vector centerpiece watermark styled flawlessly as logo draft */}
        <div 
          className={`relative z-10 p-2.5 rounded-full border border-dashed transition-all duration-700 ease-out flex items-center justify-center bg-black/75 backdrop-blur-[1px]
            ${isHovered ? 'scale-110 rotate-6 border-solid' : 'scale-100'} 
            ${accentColor === 'green' ? 'border-[#00ff88]/30 group-hover:border-[#00ff88]' : ''}
            ${accentColor === 'cyan' ? 'border-[#00eeff]/30 group-hover:border-[#00eeff]' : ''}
            ${accentColor === 'purple' ? 'border-[#bf5fff]/30 group-hover:border-[#bf5fff]' : ''}
          `}
          style={{
            boxShadow: isHovered ? `0 0 25px ${lightGlowTheme}40` : 'none'
          }}
        >
          <IconComponent 
            className="w-7 h-7 transition-all duration-500 ease-all"
            style={{
              color: isHovered ? lightGlowTheme : 'rgba(122, 255, 184, 0.75)',
              filter: isHovered ? `drop-shadow(0 0 12px ${lightGlowTheme})` : 'none'
            }}
          />
        </div>

        {/* Sweeping premium glossy glassmorphic shine overlay */}
        <div className="game-card-shine" />

        {/* Frame bracket overlays */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-500 rounded-sm" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-500 rounded-sm" />
      </div>

      <div className="game-title text-[#00ff88] text-center font-main text-sm font-bold tracking-widest mt-3 uppercase">
        {title}
      </div>

      <div className="game-desc font-body text-[13px] text-zinc-400 mt-2 leading-relaxed text-center min-h-[60px]">
        {desc}
      </div>

      {/* Glow horizontal micro bar on hover trigger */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${lightGlowTheme}, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)'
        }}
      />
    </div>
  );
};

// ----------------------------------------------------
// Core Skills Matrix List elements
// ----------------------------------------------------
const SkillCard: React.FC<SkillCardProps> = ({ name, icon, level, accent }) => {
  const [percent, setPercent] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Animating level progress loader dynamically
            const duration = 1500;
            const steps = 30;
            const stepVal = level / steps;
            let current = 0;
            const t = setInterval(() => {
              current += stepVal;
              if (current >= level) {
                setPercent(level);
                clearInterval(t);
              } else {
                setPercent(Math.floor(current));
              }
            }, duration / steps);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [level]);

  const accStyles = {
    green: {
      border: "hover:border-[#00ff88] hover:shadow-[0_12px_40px_rgba(0,255,136,0.25),0_0_0_1px_rgba(0,255,136,0.5)]",
      name: "text-[#00ff88] glow-green",
      bar: "from-[#00ff88] to-[#00eeff] shadow-[0_0_8px_rgba(0,255,136,0.6)]"
    },
    cyan: {
      border: "hover:border-[#00eeff] hover:shadow-[0_12px_40px_rgba(0,238,255,0.2),0_0_0_1px_rgba(0,238,255,0.5)]",
      name: "text-[#00eeff] glow-cyan",
      bar: "from-[#00eeff] to-[#00ff88] shadow-[0_0_8px_rgba(0,238,255,0.6)]"
    },
    purple: {
      border: "hover:border-[#bf5fff] hover:shadow-[0_12px_40px_rgba(191,95,255,0.2),0_0_0_1px_rgba(191,95,255,0.4)]",
      name: "text-[#bf5fff] glow-purple",
      bar: "from-[#bf5fff] to-[#00eeff] shadow-[0_0_8px_rgba(191,95,255,0.6)]"
    }
  }[accent];

  return (
    <div
      ref={cardRef}
      className={`relative group bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.25)] p-5 text-center transition-all duration-300 transform hover:-translate-y-[6px] ${accStyles.border}`}
    >
      <div className="text-3xl mb-3 select-none">{icon}</div>
      <div className={`font-main text-[11px] font-bold tracking-widest uppercase mb-2 ${accStyles.name}`}>
        {name}
      </div>
      <div className="w-full bg-[rgba(0,255,136,0.15)] h-[3px] rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r rounded-full transition-all duration-300 ${accStyles.bar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="font-mono text-[9px] text-[#7affb8] mt-2 opacity-60 text-right">
        {percent}% CAP
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Digital Project elements mapped
// ----------------------------------------------------
const ProjectCard: React.FC<ProjectCardProps> = ({ num, title, desc, iconName, image }) => {
  return (
    <div className="relative group bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.25)] p-6 transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(0,255,136,0.12)]">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff88]/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff88]/30" />

      {/* Real image thumb container */}
      <div className="relative w-full h-[140px] bg-black border border-emerald-950 mb-5 overflow-hidden flex items-center justify-center group/proj-img">
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
        />
        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black/45 transition-colors duration-300 group-hover:bg-transparent" />
        
        {/* Futuristic scanline grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_50%,rgba(0,255,136,0.02)_50%)] bg-[size:100%_4px] pointer-events-none" />
        
        <span className="absolute bottom-3 right-3 text-xl opacity-90 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none bg-black/60 p-1.5 rounded-full border border-emerald-500/20 z-10">{iconName}</span>
      </div>

      <div className="font-mono text-[10px] text-emerald-500/50 tracking-widest mb-1">{num}</div>
      <div className="font-main text-xs font-bold text-[#00ff88] tracking-wider mb-2 uppercase">{title}</div>
      <p className="font-body text-[13px] text-zinc-400 leading-relaxed mb-4">{desc}</p>

      <a 
        href="#" 
        onClick={(e) => e.preventDefault()} 
        className="inline-block px-4 py-2 text-[10px] font-main font-bold tracking-widest text-[#00ff88] border border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)] transition-all duration-300"
      >
        &#9654; VIEW DEMO
      </a>
    </div>
  );
};

// ----------------------------------------------------
// Main Dashboard Application Component Entry
// ----------------------------------------------------
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formTransmitting, setFormTransmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Landing Screen & Transition states
  const [enteredDomain, setEnteredDomain] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStep, setTransitionStep] = useState('');

  // Form State Values
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Custom Cursor state trackers
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorRingPos, setCursorRingPos] = useState({ x: 0, y: 0 });

  // Intersection visibility lists
  const [visibleElements, setVisibleElements] = useState<Record<string, boolean>>({});

  // Sync scroll lock with enteredDomain state
  useEffect(() => {
    if (!enteredDomain) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [enteredDomain]);

  // Handle entering the domain with a premium cinematic sequence
  const handleEnterDomain = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsTransitioning(true);
    setTransitionStep('DECRYPTING SECURITY CERTIFICATE...');
    
    setTimeout(() => {
      setTransitionStep('ESTABLISHING SECURE PROTOCOLS...');
    }, 450);
    
    setTimeout(() => {
      setTransitionStep('SYNCHRONIZING RECTIFIER MATRICES...');
    }, 900);
    
    setTimeout(() => {
      setTransitionStep('BOOTING TERMINAL CORE INTERFACE...');
    }, 1350);

    setTimeout(() => {
      setEnteredDomain(true);
      setIsTransitioning(false);
    }, 1800);
  };

  // Handle Watching Content trigger with premium transition, then smooth navigation to YouTube
  const handleWatchContent = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTransitionStep('REDIRECTING SIGNAL TO BROADCAST TOWER...');
    
    setTimeout(() => {
      setTransitionStep('DIALING SAT-LINK FREQUENCY 141.85...');
    }, 450);

    setTimeout(() => {
      setTransitionStep('ESTABLISHING HIGH-BANDWIDTH FEED...');
    }, 1000);

    setTimeout(() => {
      setEnteredDomain(true);
      setIsTransitioning(false);
      
      // Give layout rendering time, then scroll straight to the YouTube section
      setTimeout(() => {
        const targetElement = document.getElementById('youtube');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 1800);
  };

  useEffect(() => {
    // Standard Loading screen bar count triggers
    const progressTimer = setInterval(() => {
      setLoadPercentage((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 1;
        if (next >= 100) {
          clearInterval(progressTimer);
          // Allow full boot fade out duration sequence
          setTimeout(() => setIsLoading(false), 900);
          return 100;
        }
        return next;
      });
    }, 45);

    // Dynamic mouse custom pointer follower bounds
    const handleMouseFollow = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseFollow, { passive: true });

    // Smooth easing filter for the larger secondary outer tracking loop
    let frameId: number;
    const smoothCursorLoop = () => {
      setCursorRingPos((prev) => ({
        x: prev.x + (cursorPos.x - prev.x) * 0.16,
        y: prev.y + (cursorPos.y - prev.y) * 0.16
      }));
      frameId = requestAnimationFrame(smoothCursorLoop);
    };
    frameId = requestAnimationFrame(smoothCursorLoop);

    // Native Element reveal tracker trigger bindings
    const revealTargets = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id') || '';
            setVisibleElements((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));

    // Cleanup resources
    return () => {
      clearInterval(progressTimer);
      window.removeEventListener('mousemove', handleMouseFollow);
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [cursorPos]);

  const handleSubmitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTransmitting(true);
    setFormError(null);
    setFormSubmitted(false);

    try {
      const response = await fetch("https://formspree.io/f/xaqzrwdg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        // Auto fade out success message after 7 seconds
        setTimeout(() => setFormSubmitted(false), 7000);
      } else {
        const data = await response.json();
        setFormError(data.error || "CONNECTION_FAILED: Telemetry core returned non-200 protocol.");
      }
    } catch (err: any) {
      setFormError(err.message || "TRANSMISSION_ERROR: Failed to establish signal link.");
    } finally {
      setFormTransmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#e0ffe8] overflow-hidden selection:bg-[#00ff88] selection:text-black font-body">
      
      {/* Absolute scanline noise grids */}
      <div className="scanline-overlay pointer-events-none" />

      {/* Complete Hover Follower pointer systems (Change constraint) */}
      <div 
        id="cursor" 
        className="hidden md:block"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
      />
      <div 
        id="cursor-ring" 
        className="hidden md:block"
        style={{ 
          left: `${cursorRingPos.x}px`, 
          top: `${cursorRingPos.y}px`,
          transform: `translate(-50%, -50%)`
        }} 
      />

      {/* ----------------------------------------------------
          LOADING BOOT SCREEN (Complete faithful port with smooth UI triggers)
         ---------------------------------------------------- */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6">
          <MatrixRainStream canvasId="loading-matrix" alpha="rgba(0,0,0,0.06)" />
          
          <div className="relative z-10 text-center max-w-md w-full">
            <h1 className="glitch font-main text-2xl md:text-4xl font-black text-[#00ff88] tracking-[0.2em] mb-8" data-text="NOOBMKGAMER">
              NOOBMKGAMER
            </h1>
            
            <div className="space-y-2 text-[11px] font-mono text-[#00ff88]/80 text-left bg-black/60 p-4 border border-[#00ff88]/20 rounded mb-8">
              <div className="text-[#00eeff]">&gt; INITIALIZING DOMAIN CORE ENGINE...</div>
              {loadPercentage > 25 && <div>&gt; SCANNING COMPILER AND DIRECTIVES... OK</div>}
              {loadPercentage > 50 && <div>&gt; LINKING FEATURED GAME CARDS BLUEPRINTS... OK</div>}
              {loadPercentage > 75 && <div className="text-purple-400">&gt; REMOVING OUTDATED SLASH PREFIXES... COMPLETED</div>}
              {loadPercentage >= 100 && <div className="text-[#00ff88]">&gt; SHIELD PROTOCOLS ACCESS GRANTED ... READY</div>}
            </div>

            <div className="w-full bg-[rgba(0,255,136,0.15)] h-[4px] rounded-full overflow-hidden shadow-[0_0_12px_rgba(0,255,136,0.3)]">
              <div 
                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan duration-100 transition-all shadow-[0_0_12px_#00ff88]" 
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
            <div className="text-right font-mono text-[9px] mt-2 text-[#7affb8]/60">
              CORE LINK: {loadPercentage}%
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          NAVIGATION BAR DIRECTIVE ACCENTS (70% Green, 20% Cyan)
         ---------------------------------------------------- */}
      <nav id="main-nav" className={`fixed top-0 left-0 right-0 z-[1000] bg-black/85 border-b border-[rgba(0,255,136,0.25)] backdrop-filter backdrop-blur-md py-4 px-6 md:px-12 transition-all duration-700 ${
        enteredDomain ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#profile" className="font-main text-sm font-black text-[#00ff88] tracking-[0.15em] hover:opacity-85 duration-200">
            NOOB<span className="text-[#00eeff]">MK</span>GAMER
          </a>

          {/* Simple portable mobile control toggle */}
          <div 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden flex flex-col gap-[5px] cursor-pointer"
          >
            <span className={`w-6 h-[2px] bg-[#00ff88] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-[#00ff88] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-[#00ff88] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>

          <ul className={`absolute md:static top-full left-0 right-0 md:flex items-center gap-7 bg-black/95 md:bg-transparent p-6 md:p-0 border-b md:border-0 border-emerald-500/10 ${mobileMenuOpen ? 'flex flex-col' : 'hidden'}`}>
            {['profile', 'skills', 'games', 'projects', 'youtube', 'contact'].map((sect) => (
              <li key={sect}>
                <a 
                  href={`#${sect}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-[11px] tracking-widest text-[#7affb8] hover:text-[#00ff88] duration-300 uppercase relative block py-2 md:py-0 group"
                >
                  {sect}
                  <span className="absolute bottom-[-3px] left-0 right-0 h-[1.5px] bg-[#00ff88] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-[#00ff88]">
            <div className="status-dot w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse-dot" />
            SYSTEM: ONLINE
          </div>
        </div>
      </nav>

      {/* ----------------------------------------------------
          HERO LANDING WORKPLACE (Canvas Orbit lines and Matrix Streams)
         ---------------------------------------------------- */}
      <section 
        id="hero" 
        className={`transition-all duration-[1200ms] ease-out flex items-center justify-center overflow-hidden ${
          !enteredDomain 
            ? "fixed inset-0 z-[95] w-screen h-screen bg-black pt-16" 
            : "absolute inset-x-0 top-0 h-screen opacity-0 pointer-events-none -translate-y-[35%] scale-95"
        }`}
      >
        <MatrixRainStream canvasId="hero-matrix-canvas" />
        <CyberParticleSpace />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="font-mono text-[11px] text-[#00eeff] tracking-[0.3em] uppercase mb-4">
            &lt; WELCOME TO THE DOMAIN &gt;
          </div>

          <h1 className="font-main font-black text-4xl md:text-7xl leading-tight tracking-[0.05em] uppercase mb-6">
            <span className="block text-zinc-100">WELCOME TO</span>
            <span className="block text-[#00ff88] glitch py-1" data-text="NOOBMKGAMER'S">NOOBMKGAMER'S</span>
            <span className="block text-zinc-100">DOMAIN</span>
          </h1>

          <div className="font-main text-[10px] md:text-sm text-[#7affb8] tracking-[0.25em] mb-12 font-semibold">
            <span className="text-[#00eeff]">GAMER</span> &nbsp;&bull;&nbsp; <span>CREATOR</span> &nbsp;&bull;&nbsp; <span className="text-purple-400">DIGITAL EXPLORER</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleEnterDomain}
              className="px-8 py-3 text-xs font-main font-bold tracking-[0.15em] uppercase text-black bg-[#00ff88] btn-primary-clip border border-[#00ff88] hover:bg-transparent hover:text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all duration-300 cursor-pointer"
            >
              Enter Domain
            </button>
            <button 
              onClick={handleWatchContent}
              className="px-8 py-3 text-xs font-main font-bold tracking-[0.15em] uppercase text-[#00eeff] bg-transparent btn-primary-clip border border-[#00eeff] hover:bg-[#00eeff]/10 hover:shadow-[0_0_30px_rgba(0,238,255,0.4)] transition-all duration-300 cursor-pointer"
            >
              &#9654; Watch Content
            </button>
          </div>
        </div>

        {/* Cinematic HUD Decryption Scanner Overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-black/75 z-50 flex flex-col items-center justify-center pointer-events-none">
            {/* Grid Calibration Lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,255,136,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,136,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Rapid vertical laser sweeping line */}
            <div className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_20px_#00ff88] animate-scan-line-fast" />

            {/* Glowing HUD Bracket Centerpiece */}
            <div className="relative p-10 border border-[#00ff88]/30 max-w-md w-full bg-black/95 backdrop-blur-md rounded shadow-[0_0_50px_rgba(0,255,136,0.18)] flex flex-col items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00ff88]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00ff88]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00ff88]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00ff88]" />
              
              <Terminal className="w-12 h-12 text-[#00eeff] mb-4 animate-pulse-dot" />
              
              <div className="font-main text-lg font-black text-[#00ff88] tracking-widest uppercase mb-2">
                MK SECURITY PORTAL
              </div>
              
              <div className="font-mono text-[10px] text-[#00eeff]/80 uppercase tracking-[0.2em] mb-4">
                AUTHENTICATING DOMAIN...
              </div>

              {/* Progress terminal simulator text logs */}
              <div className="w-full bg-black/80 border border-[#00ff88]/20 p-4 font-mono text-[10px] text-left text-[#7affb8]/90 space-y-2 h-28 overflow-hidden rounded">
                <div className="text-emerald-400 font-bold">&gt; {transitionStep}</div>
                <div className="opacity-50">&gt; IP_LOC: INGRESS INTERFACE_GRANTED</div>
                <div className="opacity-30">&gt; SYS_DECRYPT: RSA_2048 SECURE PROTOCOL</div>
                <div className="opacity-15">&gt; CONNECT: STATUS_LIVE_READY</div>
              </div>

              {/* High-tech scanning progress loader indicator bar */}
              <div className="w-full bg-[#00ff88]/10 h-1 mt-6 overflow-hidden rounded-full">
                <div className="bg-[#00ff88] h-full shadow-[0_0_10px_#00ff88] animate-hud-loader" />
              </div>
            </div>
          </div>
        )}

        {!enteredDomain && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-50 animate-pulse">
            <span className="font-mono text-[9px] text-[#00ff88] tracking-widest">SYSTEM SECURED</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
          </div>
        )}
      </section>

      {/* Decorative pulse line separator */}
      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent" />

      {/* ----------------------------------------------------
          PLAYER PROFILE WORKSPACE (Change Requirement 4 - Premium section headers)
         ---------------------------------------------------- */}
      <section id="profile" className="scroll-reveal py-24 px-6 md:px-12 bg-gradient-to-b from-black to-[#020f08]">
        <div className="max-w-6xl mx-auto">
          {/* 
            PREMIUM SECTION HEADER - (Change Requirement 4)
            - Removed Visual Label prefix: "// PLAYER PROFILE"
            - Upgraded with custom uppercase typography, letters matching Orbitron, and neon vector underlines. 
          */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#00eeff] block mb-2 uppercase glow-cyan">
              PLAYER PROFILE
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              PLAYER <span className="text-[#00ff88] glow-green">PROFILE</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#00eeff] to-transparent shadow-[0_0_12px_#00eeff]" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual Avatar scanning chamber */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72">
                {/* Custom orbiting visual frames */}
                <div className="absolute inset-[-10px] border border-[#00ff88]/20 rounded-full animate-ring-rotate" />
                <div className="absolute inset-[-20px] border border-[#00eeff]/15 rounded-full animate-ring-rotate-reverse" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-scan-line" />
                
                {/* Orbit tracker dots */}
                <span className="absolute w-[6px] h-[6px] bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88] animate-orbit-dot-1" />
                <span className="absolute w-[6px] h-[6px] bg-[#00eeff] rounded-full shadow-[0_0_8px_#00eeff] animate-orbit-dot-2" />

                <div className="w-full h-full bg-[#031109] border-2 border-[rgba(0,255,136,0.25)] flex items-center justify-center overflow-hidden group/profile-img relative">
                  <img 
                    src="/images/profile.jpg" 
                    alt="NoobMKGamer Profile Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/profile-img:scale-110"
                  />
                  {/* Glowing lens scan lines embedded */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Profile Identity HUD Panel */}
            <div className="relative bg-[rgba(0,255,136,0.03)] border border-[#00eeff]/20 p-8">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00eeff]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00eeff]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00eeff]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00eeff]" />

              <h3 className="font-main text-lg md:text-2xl font-black text-[#00ff88] mb-3 glow-green">
                NoobMKGamer
              </h3>
              <p className="font-body text-[14px] text-zinc-300 leading-relaxed italic mb-6">
                &quot;A gamer forged in competitive battlegrounds with limitless possibilities — where strategy meets instinct and victories are written in code.&quot;
              </p>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { label: "Alias", val: "NoobMKGamer" },
                  { label: "Classification", val: "Digital Entity" },
                  { label: "Location", val: "Internet" },
                  { label: "Status", val: "Online", isStatus: true },
                  { label: "Experience", val: "All Games" },
                  { label: "Education", val: "Topper Hi Khada Hai" },
                  { label: "Skills", val: "Undefined In Words" }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-emerald-500/5">
                    <span className="text-[#00eeff] tracking-widest uppercase text-[10px]">{row.label}</span>
                    <span className={`${row.isStatus ? 'text-[#00ff88] glow-green' : 'text-zinc-200'} font-semibold text-[11px]`}>
                      {row.isStatus && <span className="animate-pulse mr-1">•</span>}
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#00eeff]/30 to-transparent" />

      {/* ----------------------------------------------------
          SKILLS MATRIX WORKSPACE
         ---------------------------------------------------- */}
      <section id="skills" className="scroll-reveal py-24 px-6 md:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Removed Visual Label prefix "// skills_matrix.dat" */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#00eeff] block mb-2 uppercase glow-cyan">
              SKILLS MATRIX
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              CORE <span className="text-[#00ff88] glow-green">SKILLS</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_12px_#00ff88]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <SkillCard name="Clutch Factor" icon="🎯" level={96} accent="green" />
            <SkillCard name="Game Sense" icon="🧠" level={94} accent="cyan" />
            <SkillCard name="Reaction Speed" icon="⚡" level={98} accent="green" />
            <SkillCard name="Squad Leadership" icon="👑" level={91} accent="purple" />
            <SkillCard name="Map Awareness" icon="🗺️" level={92} accent="cyan" />
            <SkillCard name="Adaptability" icon="🔄" level={96} accent="green" />
            <SkillCard name="Tactical Execution" icon="⚔️" level={93} accent="green" />
            <SkillCard name="Resource Control" icon="💎" level={89} accent="cyan" />
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent" />

      {/* ----------------------------------------------------
          FEATURED GAMES LIBRARY WORKSPACE (Change Requirements 1 & 2)
         ---------------------------------------------------- */}
      <section id="games" className="scroll-reveal py-24 px-6 md:px-12 bg-gradient-to-b from-black via-[#010c05] to-black">
        <div className="max-w-6xl mx-auto">
          {/* 
            PREMIUM SECTION HEADER - (Change Requirement 4)
            - Removed Visual Label prefix: "// GAME LIBRARY"
            - Upgraded with gothic tracking block and neon glowing elements.
          */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#00eeff] block mb-2 uppercase glow-cyan">
              GAME LIBRARY
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              FEATURED <span className="text-[#00ff88] glow-green">GAMES</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#00eeff] to-transparent shadow-[0_0_12px_#00eeff]" />
          </div>

          {/* Cards Layout grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameCard 
              title="Free Fire" 
              badge="ACTIVE" 
              accentColor="green" 
              icon={Flame} 
              desc="Battle royale survival on the edge. Precision drops, clutch plays, and Booyah moments that define a champion." 
              image="/images/freefire.jpg"
            />
            <GameCard 
              title="PUBG Mobile" 
              badge="RANKED" 
              accentColor="cyan" 
              icon={Target} 
              desc="The original battleground. 100 players, one winner. Strategy, patience, and perfect timing are the weapons of choice." 
              image="/images/pubg.jpg"
            />
            <GameCard 
              title="Clash of Clans" 
              badge="MAXED" 
              accentColor="green" 
              icon={Swords} 
              desc="Build, destroy, and conquer. Managing clans and raids at the highest level — war is an art form." 
              image="/images/coc.jpg"
            />
            <GameCard 
              title="GTA" 
              badge="LEGEND" 
              accentColor="purple" 
              icon={Car} 
              desc="Open-world chaos mastered. From heists to street racing — no mission is impossible in the digital city." 
              image="/images/gta.jpg"
            />
            <GameCard 
              title="Minecraft" 
              badge="BUILDER" 
              accentColor="cyan" 
              icon={Box} 
              desc="From dirt huts to digital empires. Survival mode veteran with builds that defy the laws of pixels." 
              image="/images/minecraft.jpg"
            />
            <GameCard 
              title="Mobile Legends" 
              badge="ELITE" 
              accentColor="purple" 
              icon={Shield} 
              desc="MOBA mastery at its peak. Every lane, every hero, every team fight — calculated, dominant, and unstoppable." 
              image="/images/mlbb.jpg"
            />
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#00eeff]/30 to-transparent" />

      {/* ----------------------------------------------------
          PROJECTS ARCHIVE WORKSPACE
         ---------------------------------------------------- */}
      <section id="projects" className="scroll-reveal py-24 px-6 md:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Removed Visual Label prefix "// projects_hub.dat" */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#00eeff] block mb-2 uppercase glow-cyan">
              PROJECTS PORTFOLIO
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              DIGITAL <span className="text-[#00ff88] glow-green">PROJECTS</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_12px_#00ff88]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProjectCard 
              num="PROJECT_001" 
              title="BattleTracker Pro" 
              desc="Real-time battle statistics tracker across multiple games. Monitor K/D ratios, win rates, and performance trends with precision analytics." 
              iconName="📊"
              image="/images/project1.jpg"
            />
            <ProjectCard 
              num="PROJECT_002" 
              title="Clan Management Hub" 
              desc="All-in-one dashboard for managing clan operations — member tracking, raid scheduling, war logs, and coordination tools." 
              iconName="👥"
              image="/images/project2.jpg"
            />
            <ProjectCard 
              num="PROJECT_003" 
              title="Loot Analyzer" 
              desc="AI-powered loot optimization tool that calculates best item combinations, rarity probabilities, and optimal drop zone strategies." 
              iconName="🎁"
              image="/images/project3.jpg"
            />
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#bf5fff]/20 to-transparent" />

      {/* ----------------------------------------------------
          YOUTUBE BROADCAST WORKSPACE (Color balance 10% Purple highlight accent)
         ---------------------------------------------------- */}
      <section id="youtube" className="scroll-reveal py-24 px-6 md:px-12 bg-gradient-to-b from-black via-[#060a05] to-black">
        <div className="max-w-4xl mx-auto text-center">
          {/* Removed Visual Label prefix "// broadcast_channel.link" */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#bf5fff] block mb-2 uppercase glow-purple">
              YOUTUBE CHANNEL
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              YOUTUBE <span className="text-[#bf5fff] glow-purple">CHANNEL</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_12px_#bf5fff]" />
          </div>

          <div className="bg-gradient-to-br from-emerald-950/15 to-black border border-[rgba(0,255,136,0.25)] p-12 relative overflow-hidden group">
            {/* Cyber background patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,255,136,0.01)_50%)] bg-[size:40px_100%] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="font-main text-sm text-[rgba(0,255,136,0.4)] tracking-widest mb-6">
                [ OFFICIAL GAMING STREAM ARCHIVE ]
              </div>
              <p className="font-body text-zinc-300 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
                Join the digital revolution. Watch epic gameplay, pro strategies, clutch moments, and exclusive gaming content — straight from NoobMKGamer&apos;s domain.
              </p>

              <div>
                <a 
                  href="https://youtube.com/@NoobMKGamer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-3 px-8 py-4 font-main font-bold text-xs tracking-widest text-white bg-[#ff0000] hover:bg-[#d60000] btn-yt-clip duration-300 shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.7)]"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  VISIT MY CHANNEL
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[1px] relative bg-gradient-to-r from-transparent via-[#bf5fff]/30 to-transparent" />

      {/* ----------------------------------------------------
          CONTACT TRANSMISSION WORKSPACE (Requirement 3: 10% balanced Neon Purple accent)
         ---------------------------------------------------- */}
      <section id="contact" className="scroll-reveal py-24 px-6 md:px-12 bg-black">
        <div className="max-w-2xl mx-auto">
          {/* 
            PREMIUM SECTION HEADER - (Change Requirement 4)
            - Removed Visual Label prefix: "// CONTACT"
            - Refactored using typography and purple glow effects.
          */}
          <div className="text-center mb-16">
            <span className="font-main text-[11px] tracking-[0.4em] text-[#bf5fff] block mb-2 uppercase glow-purple">
              CONTACT
            </span>
            <h2 className="font-main font-black text-2xl md:text-4xl text-zinc-100 tracking-wider uppercase">
              ESTABLISH <span className="text-[#bf5fff] glow-purple">CONNECTION</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_12px_#bf5fff]" />
          </div>

          <div className="relative bg-[rgba(0,255,136,0.03)] border border-[#bf5fff]/35 p-8 md:p-12">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#bf5fff]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#bf5fff]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#bf5fff]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#bf5fff]" />

            <form onSubmit={handleSubmitContactForm} className="space-y-6">
              {/* Form inputs with prefix // removed from interactive text labels */}
              <div>
                <label className="block font-mono text-[10px] text-[#00eeff] tracking-widest uppercase mb-2">
                  Identification
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your alias..." 
                  required
                  className="w-full bg-emerald-950/5 border border-emerald-500/20 text-[#e0ffe8] font-mono text-xs p-4 outline-none transition-all duration-300 focus:border-[#00ff88] focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#00eeff] tracking-widest uppercase mb-2">
                  Signal Frequency (Email)
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@signal.com" 
                  required
                  className="w-full bg-emerald-950/5 border border-emerald-500/20 text-[#e0ffe8] font-mono text-xs p-4 outline-none transition-all duration-300 focus:border-[#00ff88] focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#00eeff] tracking-widest uppercase mb-2">
                  Transmission
                </label>
                <textarea 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Encode your message here..." 
                  required
                  className="w-full bg-emerald-950/5 border border-emerald-500/20 text-[#e0ffe8] font-mono text-xs p-4 outline-none transition-all duration-300 focus:border-[#00ff88] focus:shadow-[0_0_20px_rgba(0,255,136,0.15)] resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={formTransmitting}
                className="w-full py-4 text-xs font-main font-bold tracking-[0.2em] uppercase bg-transparent text-[#bf5fff] hover:text-black hover:bg-[#bf5fff] hover:shadow-[0_0_30px_rgba(191,95,255,0.4)] border border-[#bf5fff] duration-300 btn-yt-clip disabled:opacity-50"
              >
                {formTransmitting ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
              </button>

              {formSubmitted && (
                <div className="p-4 border border-[#00ff88] bg-[#00ff88]/5 text-center font-mono text-xs text-[#00ff88] animate-pulse">
                  ✓ TRANSMISSION SUCCESSFUL — Message received. Standing by...
                </div>
              )}

              {formError && (
                <div className="p-4 border border-[#ff3b3b] bg-[#ff3b3b]/5 text-center font-mono text-xs text-[#ff3b3b] animate-pulse">
                  ⚠ TRANSMISSION FAILED — {formError}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          FOOTER DIVISION
         ---------------------------------------------------- */}
      <footer className="border-t border-[rgba(0,255,136,0.2)] py-12 px-6 text-center relative bg-black">
        <div className="absolute top-[-1px] left-1/2 transform -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_20px_#00ff88]" />
        
        <div className="font-main text-lg font-black text-[#00ff88] tracking-widest mb-6 glow-green glitch" data-text="NOOBMKGAMER">
          NOOBMKGAMER
        </div>

        <nav className="flex flex-wrap justify-center gap-6 mb-8">
          {['profile', 'skills', 'games', 'projects', 'youtube', 'contact'].map((sect) => (
            <a 
              key={sect} 
              href={`#${sect}`} 
              className="font-mono text-[10px] text-emerald-500/55 hover:text-[#00ff88] tracking-widest duration-200 uppercase"
            >
              {sect}
            </a>
          ))}
        </nav>

        <div className="flex justify-center gap-4 mb-8">
          {['youtube', 'instagram', 'twitter', 'discord'].map((social) => (
            <a 
              key={social} 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 border border-emerald-500/30 hover:border-[#00ff88] text-emerald-500/55 hover:text-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-300 flex items-center justify-center text-xs"
            >
              {social === 'youtube' && '▶'}
              {social === 'instagram' && '✦'}
              {social === 'twitter' && '✕'}
              {social === 'discord' && '●'}
            </a>
          ))}
        </div>

        <div className="font-mono text-[9px] text-[#00ff88]/30 tracking-widest uppercase">
          &copy; 2026 NOOBMKGAMER &bull; Digital Entity &bull; All Rights Reserved
          <br />
          <span className="text-[#00ff88]/20 mt-1 block">Built in the Digital Domain</span>
        </div>
      </footer>

    </div>
  );
}

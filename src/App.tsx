import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  Flame,
  Target,
  Swords,
  Car,
  Box,
  Shield,
  Terminal
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

interface MagneticAnchorProps {
  children: React.ReactNode;
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 26, scale: 0.992, filter: 'blur(14px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
};

function useMotionEnvironment() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px)');
    const fine = window.matchMedia('(pointer: fine)');

    const apply = () => {
      setReducedMotion(!!motion.matches);
      setIsMobile(!!mobile.matches);
      setIsFinePointer(!!fine.matches);
    };

    apply();

    const onVis = () => setIsPageVisible(document.visibilityState === 'visible');
    onVis();

    motion.addEventListener?.('change', apply);
    mobile.addEventListener?.('change', apply);
    fine.addEventListener?.('change', apply);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      motion.removeEventListener?.('change', apply);
      mobile.removeEventListener?.('change', apply);
      fine.removeEventListener?.('change', apply);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return { reducedMotion, isPageVisible, isMobile, isFinePointer };
}

const MagneticAnchor: React.FC<MagneticAnchorProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.32 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.32 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.985 }}
      className={`magnetic-shell ${className}`}
    >
      {children}
    </motion.div>
  );
};

const PremiumThreeBackdrop: React.FC<{ reducedMotion?: boolean; isPageVisible?: boolean; isMobile?: boolean; isFinePointer?: boolean; }> = ({ reducedMotion = false, isPageVisible = true, isMobile = false, isFinePointer = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let frame = 0;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;

    const safeDispose = () => {
      if (renderer) {
        try {
          renderer.dispose();
        } catch {}
        if (renderer.domElement.parentElement === mount) {
          try {
            mount.removeChild(renderer.domElement);
          } catch {}
        }
        renderer = null;
      }
    };

    const boot = () => {
      try {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 60);
        camera.position.set(0, 0, 7.2);

        const pixelRatioCap = reducedMotion ? 1 : isMobile ? 1.2 : 1.5;
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile && window.devicePixelRatio <= 1.25,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.className = 'premium-three-canvas';
        mount.appendChild(renderer.domElement);

        scene.fog = new THREE.FogExp2(0x050714, isMobile ? 0.04 : 0.028);

        const group = new THREE.Group();
        scene.add(group);

        const heroGeo = new THREE.TorusKnotGeometry(0.9, 0.22, 220, 16);
        const orbGeo = new THREE.IcosahedronGeometry(0.72, 3);
        const shardGeo = new THREE.OctahedronGeometry(0.62, 1);

        const mkGlassMaterial = (color: string) =>
          new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.06,
            metalness: 0.12,
            transmission: 0.86,
            thickness: 1.2,
            ior: 1.55,
            transparent: true,
            opacity: 0.52,
            clearcoat: 1,
            clearcoatRoughness: 0.07
          });

        const matHero = mkGlassMaterial('#60a5fa');
        const matOrb = mkGlassMaterial('#a855f7');
        const matShard = mkGlassMaterial('#22d3ee');
        const matAccent = mkGlassMaterial('#ff72d2');

        const hero = new THREE.Mesh(heroGeo, matHero);
        hero.position.set(0, -0.1, 0);
        group.add(hero);

        const orb = new THREE.Mesh(orbGeo, matOrb);
        orb.position.set(-2.1, 0.85, -1.15);
        orb.scale.setScalar(0.92);
        group.add(orb);

        const shard = new THREE.Mesh(shardGeo, matShard);
        shard.position.set(2.35, -1.05, -0.65);
        shard.rotation.set(0.2, 0.3, 0.1);
        shard.scale.set(0.85, 1.15, 0.85);
        group.add(shard);

        const satellite = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 2), matAccent);
        satellite.position.set(0.9, 1.55, -2.0);
        satellite.scale.setScalar(0.88);
        group.add(satellite);

        const particleGeometry = new THREE.BufferGeometry();
        const count = reducedMotion ? 0 : isMobile ? 160 : 360;
        if (count > 0) {
          const positions = new Float32Array(count * 3);
          for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 14;
            positions[i + 1] = (Math.random() - 0.5) * 8;
            positions[i + 2] = (Math.random() - 0.5) * 10;
          }
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const particles = new THREE.Points(
            particleGeometry,
            new THREE.PointsMaterial({ color: '#eaf7ff', size: isMobile ? 0.016 : 0.018, transparent: true, opacity: 0.38, depthWrite: false })
          );
          scene.add(particles);
        }

        scene.add(new THREE.AmbientLight('#eaf7ff', 0.9));

        const key = new THREE.DirectionalLight('#dff3ff', 1.55);
        key.position.set(3.2, 2.4, 3.6);
        scene.add(key);

        const rim = new THREE.DirectionalLight('#22d3ee', 1.0);
        rim.position.set(-4.2, 1.1, -2.4);
        scene.add(rim);

        const fill = new THREE.PointLight('#ff72d2', isMobile ? 6.0 : 8.0, 28);
        fill.position.set(-1.1, -1.2, 3.2);
        scene.add(fill);

        const clock = new THREE.Clock();

        const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
        const onMove = (ev: PointerEvent) => {
          if (!isFinePointer || isMobile || reducedMotion) return;
          const nx = (ev.clientX / window.innerWidth - 0.5) * 2;
          const ny = (ev.clientY / window.innerHeight - 0.5) * 2;
          parallax.tx = nx;
          parallax.ty = ny;
        };
        window.addEventListener('pointermove', onMove, { passive: true });

        const resize = () => {
          if (!renderer) return;
          camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
          renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', resize);

        const animate = () => {
          if (disposed || !renderer) return;
          if (!isPageVisible) {
            frame = requestAnimationFrame(animate);
            return;
          }

          const t = clock.getElapsedTime();

          if (!isMobile && !reducedMotion && isFinePointer) {
            parallax.x += (parallax.tx - parallax.x) * 0.06;
            parallax.y += (parallax.ty - parallax.y) * 0.06;
            camera.position.x = parallax.x * 0.35;
            camera.position.y = -parallax.y * 0.22;
          }

          const spin = reducedMotion ? 0 : 0.14;
          group.rotation.y = t * spin;
          group.rotation.x = t * (spin * 0.32);
          hero.rotation.z = t * 0.06;
          orb.rotation.y = t * 0.09;
          shard.rotation.x = t * 0.07;
          satellite.position.y = 1.55 + Math.sin(t * 0.7) * 0.08;

          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);

        return () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('resize', resize);
          cancelAnimationFrame(frame);
          safeDispose();
          heroGeo.dispose();
          orbGeo.dispose();
          shardGeo.dispose();
          particleGeometry.dispose();
          matHero.dispose();
          matOrb.dispose();
          matShard.dispose();
          matAccent.dispose();
        };
      } catch {
        mount.classList.add('premium-three-fallback');
        return () => {};
      }
    };

    const cleanup = boot();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      try {
        cleanup?.();
      } catch {}
      safeDispose();
    };
  }, [reducedMotion, isPageVisible, isMobile, isFinePointer]);

  return <div ref={mountRef} className="premium-three-backdrop" aria-hidden="true" />;
};

const CyberParticleSpace: React.FC<{ reducedMotion?: boolean; isPageVisible?: boolean; isMobile?: boolean; }> = ({ reducedMotion = false, isPageVisible = true, isMobile = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const particleCount = isMobile ? 70 : 170;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 380,
      y: (Math.random() - 0.5) * 380,
      z: Math.random() * 420,
      size: Math.random() * 1.2 + 0.4,
      color: Math.random() > 0.5 ? 'rgba(96, 165, 250, 0.35)' : 'rgba(255, 114, 210, 0.28)'
    }));

    let rotationAngle = 0;
    let tick = 0;

    const render = () => {
      if (!isPageVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      tick++;
      if (isMobile && tick % 2 === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
      ctx.fillRect(0, 0, width, height);

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.045;
      m.y += (m.targetY - m.y) * 0.045;

      rotationAngle += 0.002;

      const focalLength = 300;
      const originX = width / 2;
      const originY = height / 2;

      particles.forEach((p) => {
        const cosY = Math.cos(rotationAngle * 0.22);
        const sinY = Math.sin(rotationAngle * 0.22);

        let rx = p.x * cosY - p.z * sinY;
        let rz = p.x * sinY + p.z * cosY;
        let ry = p.y;

        rx += m.x * 22;
        ry += m.y * 14;

        const distance = rz + 260;
        if (distance <= 0) return;

        const screenX = (rx * focalLength) / distance + originX;
        const screenY = (ry * focalLength) / distance + originY;
        const screenScale = focalLength / distance;

        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * screenScale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [reducedMotion, isPageVisible, isMobile]);

  return <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none z-1" />;
};

interface MatrixRainProps {
  alpha?: string;
  canvasId: string;
  reducedMotion?: boolean;
  isPageVisible?: boolean;
  isMobile?: boolean;
}

const MatrixRainStream: React.FC<MatrixRainProps> = ({ alpha = 'rgba(0, 0, 0, 0.05)', canvasId, reducedMotion = false, isPageVisible = true, isMobile = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

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
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\';
    const fs = isMobile ? 16 : 14;
    let cols = Math.floor(width / fs);
    let drops = Array(cols).fill(1);

    const intervalMs = isMobile ? 95 : 65;

    const interval = window.setInterval(() => {
      if (!isPageVisible) return;

      ctx.fillStyle = alpha;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255,255,255,0.42)';
      ctx.font = `${fs}px "Orbitron"`;

      cols = Math.floor(width / fs);
      if (drops.length !== cols) drops = Array(cols).fill(1);

      drops.forEach((d, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fs, d * fs);
        if (d * fs > height && Math.random() > 0.985) drops[i] = 0;
        drops[i]++;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [alpha, reducedMotion, isPageVisible, isMobile]);

  return <canvas ref={canvasRef} id={canvasId} className="absolute inset-0 opacity-55 block pointer-events-none" />;
};

const GameCard: React.FC<GameCardProps> = ({ title, badge, accentColor, icon: IconComponent, desc, image }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotateX = ((y / r.height) - 0.5) * -8;
    const rotateY = ((x / r.width) - 0.5) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const lightGlowTheme = {
    green: "#60a5fa",
    cyan: "#22d3ee",
    purple: "#a855f7"
  }[accentColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className={`game-card relative p-6 transition-all duration-300 overflow-hidden select-none cursor-pointer premium-surface-card`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x !== 0 ? '-4px' : '0px'})`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="absolute top-4 right-4 premium-badge">
        {badge}
      </div>

      <div className="relative w-full h-40 mb-5 overflow-hidden group/image-slot flex items-center justify-center premium-media-frame">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image-slot:scale-110"
        />
        <div className="absolute inset-0 premium-media-scrim" />

      
        <div
          className={`relative z-10 p-3 rounded-full transition-all duration-700 ease-out flex items-center justify-center premium-icon-disc ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}
          style={{
            boxShadow: isHovered ? `0 0 28px ${lightGlowTheme}40` : 'none'
          }}
        >
          <IconComponent
            className="w-7 h-7 transition-all duration-500 ease-all"
            style={{
              color: isHovered ? lightGlowTheme : 'rgba(255,255,255,0.78)',
              filter: isHovered ? `drop-shadow(0 0 12px ${lightGlowTheme})` : 'none'
            }}
          />
        </div>

        <div className="game-card-shine" />
      </div>

      <div className="game-title text-center font-main text-sm font-bold tracking-wide mt-3 uppercase">
        {title}
      </div>

      <div className="game-desc font-body text-[13px] text-white/70 mt-2 leading-relaxed text-center min-h-[60px]">
        {desc}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-500 premium-accent-line"
        style={{
          background: `linear-gradient(90deg, transparent, ${lightGlowTheme}, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)'
        }}
      />
    </div>
  );
};

const SkillCard: React.FC<SkillCardProps> = ({ name, icon, level, accent }) => {
  const [percent, setPercent] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const duration = 1400;
            const steps = 28;
            const stepVal = level / steps;
            let current = 0;
            const t = window.setInterval(() => {
              current += stepVal;
              if (current >= level) {
                setPercent(level);
                window.clearInterval(t);
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

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [level]);

  const accentColor = {
    green: '#60a5fa',
    cyan: '#22d3ee',
    purple: '#a855f7'
  }[accent];

  return (
    <div
      ref={cardRef}
      className="relative group p-5 text-center transition-all duration-300 transform hover:-translate-y-[4px] premium-surface-card"
    >
      <div className="text-3xl mb-3 select-none">{icon}</div>
      <div className="font-main text-[11px] font-bold tracking-widest uppercase mb-2 text-white/85">
        {name}
      </div>
      <div className="w-full bg-white/10 h-[3px] rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundImage: `linear-gradient(90deg, ${accentColor}, rgba(255,255,255,0.65))` }}
        />
      </div>
      <div className="text-[10px] text-white/55 mt-2 text-right">
        {percent}% CAP
      </div>
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ num, title, desc, iconName, image }) => {
  return (
    <div className="relative group p-6 transition-all duration-300 premium-surface-card">
      <div className="relative w-full h-[140px] mb-5 overflow-hidden flex items-center justify-center premium-media-frame group/proj-img">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 premium-media-scrim" />
        <span className="absolute bottom-3 right-3 text-xl opacity-90 select-none bg-white/10 p-1.5 rounded-full border border-white/15 z-10">{iconName}</span>
      </div>

      <div className="text-[10px] text-white/50 tracking-widest mb-1">{num}</div>
      <div className="font-main text-xs font-bold text-white/90 tracking-wide mb-2 uppercase">{title}</div>
      <p className="font-body text-[13px] text-white/70 leading-relaxed mb-4">{desc}</p>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-main font-bold tracking-widest text-white/90 border border-white/20 hover:border-white/35 hover:bg-white/5 transition-all duration-300 rounded-full"
      >
        &#9654; VIEW DEMO
      </a>
    </div>
  );
};

export default function App() {
  const { reducedMotion, isPageVisible, isMobile, isFinePointer } = useMotionEnvironment();

  const [isLoading, setIsLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formTransmitting, setFormTransmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [enteredDomain, setEnteredDomain] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStep, setTransitionStep] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const appRootRef = useRef<HTMLDivElement | null>(null);
  const cursorElRef = useRef<HTMLDivElement | null>(null);
  const cursorRingElRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enteredDomain) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [enteredDomain]);

  const handleEnterDomain = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsTransitioning(true);
    setTransitionStep('DECRYPTING SECURITY CERTIFICATE...');

    setTimeout(() => setTransitionStep('ESTABLISHING SECURE PROTOCOLS...'), 450);
    setTimeout(() => setTransitionStep('SYNCHRONIZING RECTIFIER MATRICES...'), 900);
    setTimeout(() => setTransitionStep('BOOTING TERMINAL CORE INTERFACE...'), 1350);

    setTimeout(() => {
      setEnteredDomain(true);
      setIsTransitioning(false);
    }, 1800);
  };

  const handleWatchContent = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTransitionStep('REDIRECTING SIGNAL TO BROADCAST TOWER...');

    setTimeout(() => setTransitionStep('DIALING SAT-LINK FREQUENCY 141.85...'), 450);
    setTimeout(() => setTransitionStep('ESTABLISHING HIGH-BANDWIDTH FEED...'), 1000);

    setTimeout(() => {
      setEnteredDomain(true);
      setIsTransitioning(false);
      setTimeout(() => {
        const targetElement = document.getElementById('youtube');
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1800);
  };

  useEffect(() => {
    if (reducedMotion || !isPageVisible) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.scroll-reveal',
        { y: 28, opacity: 0, scale: 0.992 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
      );
      gsap.to('.premium-aurora-field', {
        backgroundPosition: '60% 40%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    return () => {
      context.revert();
    };
  }, [reducedMotion, isPageVisible]);

  useEffect(() => {
    if (!enteredDomain) return;
    if (reducedMotion) return;
    if (isMobile || !isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const p = pointerRef.current;
      const r = ringRef.current;
      r.x += (p.x - r.x) * 0.16;
      r.y += (p.y - r.y) * 0.16;

      if (cursorElRef.current) cursorElRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      if (cursorRingElRef.current) cursorRingElRef.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      if (appRootRef.current) {
        appRootRef.current.style.setProperty('--spotlight-x', `${p.x}px`);
        appRootRef.current.style.setProperty('--spotlight-y', `${p.y}px`);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enteredDomain, reducedMotion, isMobile, isFinePointer]);

  useEffect(() => {
    if (!enteredDomain) return;
    if (reducedMotion) return;
    if (isMobile || !isFinePointer) return;

    let tiltTargets = Array.from(document.querySelectorAll<HTMLElement>('.game-card, #skills .grid > div, #projects .grid > div, #youtube .bg-gradient-to-br, #contact > div > div:last-child, #profile .grid > div:last-child'));

    const refreshTargets = () => {
      tiltTargets = Array.from(document.querySelectorAll<HTMLElement>('.game-card, #skills .grid > div, #projects .grid > div, #youtube .bg-gradient-to-br, #contact > div > div:last-child, #profile .grid > div:last-child'));
    };

    let latest: MouseEvent | null = null;
    let raf = 0;

    const applyTilt = () => {
      raf = 0;
      const event = latest;
      if (!event) return;
      tiltTargets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const isInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!isInside) return;
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        target.style.setProperty('--tilt-x', `${rotateX}deg`);
        target.style.setProperty('--tilt-y', `${rotateY}deg`);
        target.style.setProperty('--tilt-glow-x', `${event.clientX - rect.left}px`);
        target.style.setProperty('--tilt-glow-y', `${event.clientY - rect.top}px`);
      });
    };

    const onMove = (event: MouseEvent) => {
      latest = event;
      if (!raf) raf = requestAnimationFrame(applyTilt);
    };

    const resetTilt = () => {
      tiltTargets.forEach((target) => {
        target.style.setProperty('--tilt-x', '0deg');
        target.style.setProperty('--tilt-y', '0deg');
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', resetTilt, { passive: true });
    window.addEventListener('resize', refreshTargets);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', resetTilt);
      window.removeEventListener('resize', refreshTargets);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enteredDomain, reducedMotion, isMobile, isFinePointer]);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      if (!isPageVisible) return;

      setLoadPercentage((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 1;
        if (next >= 100) {
          window.clearInterval(progressTimer);
          setTimeout(() => setIsLoading(false), 900);
          return 100;
        }
        return next;
      });
    }, 55);

    return () => {
      window.clearInterval(progressTimer);
    };
  }, [isPageVisible]);

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

  const navSections = useMemo(() => ['profile', 'skills', 'games', 'projects', 'youtube', 'contact'], []);

  return (
    <motion.div
      ref={appRootRef}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`premium-app-shell relative min-h-screen text-white overflow-hidden selection:bg-white/20 selection:text-white font-body ${enteredDomain ? 'entered-domain' : ''}`}
    >
      <PremiumThreeBackdrop reducedMotion={reducedMotion} isPageVisible={isPageVisible} isMobile={isMobile} isFinePointer={isFinePointer} />
      <div className="premium-aurora-field" aria-hidden="true" />
      <div className="premium-depth-orbs" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="premium-noise-layer" aria-hidden="true" />
      <div className="mouse-spotlight" aria-hidden="true" />

      <div className="scanline-overlay pointer-events-none" />

      <div id="cursor" ref={cursorElRef} className="hidden md:block" />
      <div id="cursor-ring" ref={cursorRingElRef} className="hidden md:block" />

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 premium-boot-screen">
          <MatrixRainStream canvasId="loading-matrix" alpha="rgba(0,0,0,0.08)" reducedMotion={reducedMotion} isPageVisible={isPageVisible} isMobile={isMobile} />

          <div className="relative z-10 text-center max-w-md w-full">
            <h1 className="font-main text-2xl md:text-4xl font-black tracking-[0.18em] mb-8 premium-boot-title" data-text="NOOBMKGAMER">
              NOOBMKGAMER
            </h1>

            <div className="space-y-2 text-[11px] text-left premium-boot-panel rounded-xl mb-8">
              <div className="text-white/85">&gt; INITIALIZING DOMAIN CORE ENGINE...</div>
              {loadPercentage > 25 && <div className="text-white/70">&gt; SCANNING COMPILER AND DIRECTIVES... OK</div>}
              {loadPercentage > 50 && <div className="text-white/70">&gt; LINKING FEATURED GAME CARDS BLUEPRINTS... OK</div>}
              {loadPercentage > 75 && <div className="text-white/70">&gt; REMOVING OUTDATED SLASH PREFIXES... COMPLETED</div>}
              {loadPercentage >= 100 && <div className="text-white/85">&gt; SHIELD PROTOCOLS ACCESS GRANTED ... READY</div>}
            </div>

            <div className="w-full h-[4px] rounded-full overflow-hidden premium-progress-track">
              <div className="h-full premium-progress-fill" style={{ width: `${loadPercentage}%` }} />
            </div>
            <div className="text-right text-[10px] mt-3 text-white/50 tracking-wide">
              CORE LINK: {loadPercentage}%
            </div>
          </div>
        </div>
      )}

      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-[1000] py-4 px-6 md:px-12 transition-all duration-700 premium-nav ${
          enteredDomain ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#profile" className="font-main text-sm font-black tracking-[0.12em] hover:opacity-90 duration-200">
            NOOB<span className="text-white/85">MK</span>GAMER
          </a>

          <div
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-[5px] cursor-pointer premium-nav-toggle"
            role="button"
            aria-label="Toggle menu"
            tabIndex={0}
          >
            <span className={`w-6 h-[2px] bg-white/85 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-white/70 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white/85 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>

          <ul className={`absolute md:static top-full left-0 right-0 md:flex items-center gap-7 p-6 md:p-0 ${mobileMenuOpen ? 'flex flex-col' : 'hidden'} premium-nav-menu`}>
            {navSections.map((sect) => (
              <li key={sect}>
                <a
                  href={`#${sect}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] tracking-widest text-white/70 hover:text-white duration-300 uppercase relative block py-2 md:py-0 group"
                >
                  {sect}
                  <span className="absolute bottom-[-3px] left-0 right-0 h-[1.5px] bg-white/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-white/70">
            <div className="status-dot w-2 h-2 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.25)]" />
            SYSTEM: ONLINE
          </div>
        </div>
      </nav>

      <section
        id="hero"
        className={`transition-all duration-[1200ms] ease-out flex items-center justify-center overflow-hidden ${
          !enteredDomain
            ? "fixed inset-0 z-[95] w-screen h-screen pt-16"
            : "hidden"
        }`}
      >
        <MatrixRainStream canvasId="hero-matrix-canvas" reducedMotion={reducedMotion} isPageVisible={isPageVisible} isMobile={isMobile} />
        <CyberParticleSpace reducedMotion={reducedMotion} isPageVisible={isPageVisible} isMobile={isMobile} />

        <div className="relative z-10 text-center px-6 max-w-4xl premium-hero-panel">
          <div className="text-[11px] text-white/70 tracking-[0.3em] uppercase mb-4">
            &lt; WELCOME TO THE DOMAIN &gt;
          </div>

          <h1 className="font-main font-black text-4xl md:text-7xl leading-tight tracking-[0.02em] uppercase mb-6">
            <span className="block text-white/95">WELCOME TO</span>
            <span className="block text-white py-1">NOOBMKGAMER'S</span>
            <span className="block text-white/95">DOMAIN</span>
          </h1>

          <div className="font-main text-[10px] md:text-sm text-white/70 tracking-[0.22em] mb-12 font-semibold">
            <span className="text-white/85">GAMER</span> &nbsp;&bull;&nbsp; <span>CREATOR</span> &nbsp;&bull;&nbsp; <span className="text-white/85">DIGITAL EXPLORER</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <MagneticAnchor>
              <button
                onClick={handleEnterDomain}
                className="px-8 py-3 text-xs font-main font-bold tracking-[0.14em] uppercase text-white premium-btn premium-btn-primary"
              >
                Enter Domain
              </button>
            </MagneticAnchor>
            <MagneticAnchor>
              <button
                onClick={handleWatchContent}
                className="px-8 py-3 text-xs font-main font-bold tracking-[0.14em] uppercase text-white premium-btn premium-btn-secondary"
              >
                &#9654; Watch Content
              </button>
            </MagneticAnchor>
          </div>
        </div>

        {isTransitioning && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none premium-transition">
            <div className="relative p-10 max-w-md w-full premium-transition-panel">
              <Terminal className="w-12 h-12 text-white/85 mb-4" />

              <div className="font-main text-lg font-black text-white tracking-widest uppercase mb-2">
                MK SECURITY PORTAL
              </div>

              <div className="text-[10px] text-white/70 uppercase tracking-[0.2em] mb-4">
                AUTHENTICATING DOMAIN...
              </div>

              <div className="w-full p-4 text-[10px] text-left text-white/75 space-y-2 h-28 overflow-hidden rounded-lg premium-transition-log">
                <div className="text-white font-semibold">&gt; {transitionStep}</div>
                <div className="opacity-70">&gt; IP_LOC: INGRESS INTERFACE_GRANTED</div>
                <div className="opacity-55">&gt; SYS_DECRYPT: RSA_2048 SECURE PROTOCOL</div>
                <div className="opacity-40">&gt; CONNECT: STATUS_LIVE_READY</div>
              </div>

              <div className="w-full h-1 mt-6 overflow-hidden rounded-full premium-progress-track">
                <div className="premium-progress-fill premium-progress-anim" />
              </div>
            </div>
          </div>
        )}

        {!enteredDomain && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60">
            <span className="text-[9px] text-white/70 tracking-widest">SYSTEM SECURED</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
          </div>
        )}
      </section>

      <div className="premium-divider" />

      <motion.section variants={fadeUp} transition={{ duration: 0.7 }} id="profile" className="scroll-reveal py-24 px-6 md:px-12 premium-first-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              PLAYER <span className="text-white/90">PROFILE</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-72 h-72 premium-avatar-shell">
                <div className="w-full h-full overflow-hidden group/profile-img relative premium-media-frame">
                  <img
                    src="/images/profile.jpg"
                    alt="NoobMKGamer Profile Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/profile-img:scale-110"
                  />
                  <div className="absolute inset-0 premium-media-scrim" />
                </div>
              </div>
            </div>

            <div className="relative p-8 premium-surface-panel">
              <h3 className="font-main text-lg md:text-2xl font-black text-white mb-3">
                NoobMKGamer
              </h3>
              <p className="font-body text-[14px] text-white/75 leading-relaxed italic mb-6">
                &quot;A gamer forged in competitive battlegrounds with limitless possibilities — where strategy meets instinct and victories are written in code.&quot;
              </p>

              <div className="space-y-3 text-xs">
                {[
                  { label: "Alias", val: "NoobMKGamer" },
                  { label: "Classification", val: "Digital Entity" },
                  { label: "Location", val: "Internet" },
                  { label: "Status", val: "Online", isStatus: true },
                  { label: "Skills", val: "Undefined In Words" }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/55 tracking-widest uppercase text-[10px]">{row.label}</span>
                    <span className={`${row.isStatus ? 'text-white' : 'text-white/80'} font-semibold text-[11px]`}>
                      {row.isStatus && <span className="animate-pulse mr-1">•</span>}
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="premium-divider" />

      <section id="skills" className="scroll-reveal py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              CORE <span className="text-white/90">SKILLS</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
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

      <div className="premium-divider" />

      <section id="games" className="scroll-reveal py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              FEATURED <span className="text-white/90">GAMES</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameCard title="Free Fire" badge="ACTIVE" accentColor="green" icon={Flame} desc="Battle royale survival on the edge. Precision drops, clutch plays, and Booyah moments that define a champion." image="/images/freefire.jpg" />
            <GameCard title="PUBG Mobile" badge="RANKED" accentColor="cyan" icon={Target} desc="The original battleground. 100 players, one winner. Strategy, patience, and perfect timing are the weapons of choice." image="/images/pubg.jpg" />
            <GameCard title="Clash of Clans" badge="MAXED" accentColor="green" icon={Swords} desc="Build, destroy, and conquer. Managing clans and raids at the highest level — war is an art form." image="/images/coc.jpg" />
            <GameCard title="GTA" badge="LEGEND" accentColor="purple" icon={Car} desc="Open-world chaos mastered. From heists to street racing — no mission is impossible in the digital city." image="/images/gta.jpg" />
            <GameCard title="Minecraft" badge="BUILDER" accentColor="cyan" icon={Box} desc="From dirt huts to digital empires. Survival mode veteran with builds that defy the laws of pixels." image="/images/minecraft.jpg" />
            <GameCard title="Mobile Legends" badge="ELITE" accentColor="purple" icon={Shield} desc="MOBA mastery at its peak. Every lane, every hero, every team fight — calculated, dominant, and unstoppable." image="/images/mlbb.jpg" />
          </div>
        </div>
      </section>

      <div className="premium-divider" />

      <section id="projects" className="scroll-reveal py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              DIGITAL <span className="text-white/90">PROJECTS</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProjectCard num="PROJECT_001" title="BattleTracker Pro" desc="Real-time battle statistics tracker across multiple games. Monitor K/D ratios, win rates, and performance trends with precision analytics." iconName="📊" image="/images/project1.jpg" />
            <ProjectCard num="PROJECT_002" title="Clan Management Hub" desc="All-in-one dashboard for managing clan operations — member tracking, raid scheduling, war logs, and coordination tools." iconName="👥" image="/images/project2.jpg" />
            <ProjectCard num="PROJECT_003" title="Loot Analyzer" desc="AI-powered loot optimization tool that calculates best item combinations, rarity probabilities, and optimal drop zone strategies." iconName="🎁" image="/images/project3.jpg" />
          </div>
        </div>
      </section>

      <div className="premium-divider" />

      <section id="youtube" className="scroll-reveal py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              YOUTUBE <span className="text-white/90">CHANNEL</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/12 p-12 relative overflow-hidden group rounded-[28px] premium-surface-panel">
            <div className="relative z-10">
              <div className="font-main text-sm text-white/45 tracking-widest mb-6">
                [ OFFICIAL GAMING STREAM ARCHIVE ]
              </div>
              <p className="font-body text-white/75 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
                Join the digital revolution. Watch epic gameplay, pro strategies, clutch moments, and exclusive gaming content — straight from NoobMKGamer&apos;s domain.
              </p>

              <div>
                <a href="https://youtube.com/@NoobMKGamer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 font-main font-bold text-xs tracking-widest text-white premium-btn premium-btn-youtube">
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

      <div className="premium-divider" />

      <section id="contact" className="scroll-reveal py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-main font-black text-2xl md:text-4xl text-white tracking-wide uppercase premium-section-title">
              ESTABLISH <span className="text-white/90">CONNECTION</span>
            </h2>
            <div className="w-20 h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="relative p-8 md:p-12 premium-surface-panel">
            <form onSubmit={handleSubmitContactForm} className="space-y-6">
              <div>
                <label className="block text-[10px] text-white/65 tracking-widest uppercase mb-2">Identification</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your alias..." required className="w-full premium-input" />
              </div>
              <div>
                <label className="block text-[10px] text-white/65 tracking-widest uppercase mb-2">Signal Frequency (Email)</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@signal.com" required className="w-full premium-input" />
              </div>
              <div>
                <label className="block text-[10px] text-white/65 tracking-widest uppercase mb-2">Transmission</label>
                <textarea rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Encode your message here..." required className="w-full premium-input resize-none" />
              </div>

              <MagneticAnchor className="w-full">
                <button type="submit" disabled={formTransmitting} className="w-full py-4 text-xs font-main font-bold tracking-[0.2em] uppercase text-white premium-btn premium-btn-secondary disabled:opacity-50">
                  {formTransmitting ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
                </button>
              </MagneticAnchor>

              {formSubmitted && (
                <div className="p-4 border border-white/25 bg-white/6 text-center text-xs text-white/85 rounded-xl">
                  ✓ TRANSMISSION SUCCESSFUL — Message received. Standing by...
                </div>
              )}

              {formError && (
                <div className="p-4 border border-red-400/50 bg-red-400/10 text-center text-xs text-red-100 rounded-xl">
                  ⚠ TRANSMISSION FAILED — {formError}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 text-center relative">
        <div className="font-main text-lg font-black text-white tracking-widest mb-6 premium-footer-title">NOOBMKGAMER</div>

        <nav className="flex flex-wrap justify-center gap-6 mb-8">
          {navSections.map((sect) => (
            <a key={sect} href={`#${sect}`} className="text-[10px] text-white/55 hover:text-white tracking-widest duration-200 uppercase">
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
              className="w-10 h-10 border border-white/15 hover:border-white/30 text-white/55 hover:text-white transition-all duration-300 flex items-center justify-center text-xs rounded-full bg-white/5"
            >
              {social[0].toUpperCase()}
            </a>
          ))}
        </div>

        <div className="text-[9px] text-white/35 tracking-widest uppercase">
          &copy; 2026 NOOBMKGAMER &bull; Digital Entity &bull; All Rights Reserved
          <br />
          <span className="text-white/25 mt-1 block">Built in the Digital Domain</span>
        </div>
      </footer>

    </motion.div>
  );
}

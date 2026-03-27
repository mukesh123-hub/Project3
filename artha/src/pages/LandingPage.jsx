// ─────────────────────────────────────────────────────────────────────────────
//  ARTHA — AI Money Mentor  |  Landing Page
//  All animations from blueprint: Framer Motion page transitions, card stagger,
//  number counters (React Countup), Recharts radar preview, Lucide icons only.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimation, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView as useIOView } from 'react-intersection-observer'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import {
  Heart, Clock, FileText, BarChart3, Users,
  TrendingUp, CheckSquare, MessageSquare, ArrowRight,
  Zap, Activity, Target, PieChart, Upload, IndianRupee,
  Menu, X, Star, ChevronDown, Shield, Layers, Cpu, Sparkles,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
//  FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const V = {
  fadeUp: {
    hidden:  { opacity: 0, y: 44 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.82 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: -56 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  slideRight: {
    hidden:  { opacity: 0, x: 56 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  stagger: (d = 0.12) => ({
    hidden:  {},
    visible: { transition: { staggerChildren: d } },
  }),
  // Card hover spring
  cardHover: { scale: 1.015, y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } },
}

// ─────────────────────────────────────────────────────────────────────────────
//  CURSOR GLOW — follows mouse with spring lag
// ─────────────────────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 })
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <motion.div
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: 'spring', stiffness: 80, damping: 22, mass: 0.6 }}
      style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,39,42,0.055) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0, top: 0, left: 0,
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCROLL-REVEAL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Reveal({ children, variant = 'fadeUp', delay = 0, className = '', style = {} }) {
  const ref = useRef(null)
  const controls = useAnimation()
  const inView = useInView(ref, { once: true, margin: '-90px' })

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={V[variant]}
      transition={{ delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION LABEL + TITLE helper
// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ label, title, sub, center = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 640 : '100%', margin: center ? '0 auto' : 0 }}>
      <Reveal>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase',
          color: '#E8272A', marginBottom: 14,
        }}>
          {label}
        </p>
      </Reveal>
      <Reveal variant="fadeUp" delay={0.08}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(30px, 3.8vw, 46px)', fontWeight: 800,
          lineHeight: 1.12, letterSpacing: '-0.5px', marginBottom: sub ? 18 : 0,
        }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Reveal>
      {sub && (
        <Reveal variant="fadeUp" delay={0.16}>
          <p style={{ fontSize: 16, color: '#9A9AAD', lineHeight: 1.7, maxWidth: 520 }}>{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how' },
    { label: 'Tech Stack', href: '#tech' },
    { label: 'Demo', href: '#cta' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 68, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 48px',
          background: scrolled ? 'rgba(10,10,15,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s',
        }}
      >
        {/* Logo */}
        <motion.a href="/" whileHover={{ scale: 1.04 }} style={{
          fontFamily: "'Playfair Display', serif", fontSize: 26,
          fontWeight: 800, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ color: '#F0F0F5' }}>Artha</span>
          <motion.span
            style={{ color: '#E8272A' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >.</motion.span>
        </motion.a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {links.map((l) => (
            <motion.a
              key={l.label}
              href={l.href}
              whileHover={{ color: '#F0F0F5' }}
              style={{ color: '#9A9AAD', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
            >
              {l.label}
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(232,39,42,0.45)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: '#E8272A', color: '#fff',
            borderRadius: 9, padding: '10px 22px',
            fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 20px rgba(232,39,42,0.3)',
          }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Check My Score <ArrowRight size={14} />
        </motion.button>
      </motion.nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(10,10,15,0.97)', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
            }}
          >
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 20, right: 24, color: '#9A9AAD' }}>
              <X size={28} />
            </button>
            {links.map((l, i) => (
              <motion.a
                key={l.label} href={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#F0F0F5' }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────

// Mini floating card component
function FloatingCard({ children, style }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: style?.animDelay ?? 0 }}
      style={{
        position: 'absolute',
        background: 'rgba(17,17,24,0.92)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14, padding: '12px 18px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// Radar data for mini preview inside hero
const radarData = [
  { axis: 'Savings', value: 72 },
  { axis: 'Insurance', value: 55 },
  { axis: 'Debt', value: 80 },
  { axis: 'Invest', value: 60 },
  { axis: 'Goals', value: 68 },
  { axis: 'Tax', value: 74 },
]

function HeroSection() {
  const { scrollY } = useScroll()
  const heroY   = useTransform(scrollY, [0, 500], [0, 120])   // parallax
  const heroOp  = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', padding: '120px 24px 80px',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Background ambience ── */}
      {/* Main red radial glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
          width: 720, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(232,39,42,0.16) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      {/* Secondary left glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '-10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(232,39,42,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
      }} />

      {/* ── Floating Cards ── */}
      {/* Left: Health Score */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', top: '28%', left: '5%', display: 'none' }}
        className="hero-float-left"
      >
        <FloatingCard style={{ animDelay: 0 }}>
          {/* mini radar preview */}
          <div style={{ width: 72, height: 72 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={28}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <Radar dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.18} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#9A9AAD', marginBottom: 2 }}>Money Health</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#10B981', fontVariantNumeric: 'tabular-nums' }}>72<span style={{ fontSize: 13, color: '#9A9AAD' }}>/100</span></p>
            <p style={{ fontSize: 11, color: '#9A9AAD' }}>Good Standing</p>
          </div>
        </FloatingCard>
      </motion.div>

      {/* Right: SIP Target */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', top: '32%', right: '5%', display: 'none' }}
        className="hero-float-right"
      >
        <FloatingCard style={{ animDelay: 2 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(232,39,42,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="#E8272A" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#9A9AAD', marginBottom: 2 }}>FIRE SIP Needed</p>
            <p style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>₹18,400<span style={{ fontSize: 12, color: '#9A9AAD' }}>/mo</span></p>
            <p style={{ fontSize: 11, color: '#10B981' }}>↑ On track for age 45</p>
          </div>
        </FloatingCard>
      </motion.div>

      {/* Bottom: Tax Saved */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', bottom: '18%', right: '8%', display: 'none' }}
        className="hero-float-bottom"
      >
        <FloatingCard style={{ animDelay: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IndianRupee size={16} color="#10B981" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#9A9AAD' }}>Tax saved this FY</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#10B981', fontVariantNumeric: 'tabular-nums' }}>₹47,250</p>
          </div>
        </FloatingCard>
      </motion.div>

      {/* ── Hero content ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={V.stagger(0.14)}
        style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}
      >
        {/* Badge */}
        <motion.div variants={V.fadeUp} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <motion.span
            animate={{ boxShadow: ['0 0 0 0 rgba(232,39,42,0)', '0 0 0 8px rgba(232,39,42,0)', '0 0 0 0 rgba(232,39,42,0)'] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(232,39,42,0.12)',
              border: '1px solid rgba(232,39,42,0.3)',
              borderRadius: 100, padding: '6px 18px',
              fontSize: 12, fontWeight: 700, letterSpacing: '1.2px',
              textTransform: 'uppercase', color: '#E8272A',
            }}
          >
            <motion.span
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8272A', display: 'inline-block' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            ET × AI Challenge 2025
          </motion.span>
        </motion.div>

        {/* Main headline — Playfair Display per blueprint */}
        <motion.h1
          variants={V.fadeUp}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(46px, 7.5vw, 92px)',
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: '-2.5px', marginBottom: 26,
          }}
        >
          Making{' '}
          <motion.em
            style={{ fontStyle: 'normal', color: '#E8272A', position: 'relative', display: 'inline-block' }}
          >
            finance
            {/* underline animation */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', bottom: -4, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #E8272A, rgba(232,39,42,0.3))',
                borderRadius: 2, transformOrigin: 'left',
              }}
            />
          </motion.em>
          <br />
          as easy as<br />
          <span style={{ color: '#9A9AAD' }}>checking WhatsApp.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={V.fadeUp}
          style={{
            fontSize: 'clamp(16px, 2vw, 19px)', color: '#9A9AAD',
            lineHeight: 1.65, maxWidth: 560, margin: '0 auto 44px',
          }}
        >
          Artha is India's AI-powered personal finance mentor — free, instant,
          and available to every Indian with a smartphone. No jargon. No advisor fees.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={V.fadeUp}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -3, boxShadow: '0 14px 48px rgba(232,39,42,0.45)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: '#E8272A', color: '#fff',
              borderRadius: 11, padding: '16px 38px',
              fontSize: 16, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 6px 32px rgba(232,39,42,0.38)',
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Check My Money Health <ArrowRight size={17} />
          </motion.button>

          <motion.button
            whileHover={{ borderColor: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent', color: '#F0F0F5',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 11, padding: '15px 34px',
              fontSize: 15, fontWeight: 500,
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* ET RSS badge */}
        <motion.div
          variants={V.fadeUp}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(17,17,24,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100, padding: '8px 20px',
            fontSize: 12, color: '#9A9AAD',
            backdropFilter: 'blur(12px)',
          }}>
            <Zap size={12} color="#E8272A" />
            Powered by live{' '}
            <strong style={{ color: '#E8272A', fontWeight: 600 }}>Economic Times RSS</strong>
            {' '}— advice from today's market.
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} color="#9A9AAD" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATS STRIP  — React CountUp on scroll trigger
// ─────────────────────────────────────────────────────────────────────────────
function StatsStrip() {
  const { ref, inView } = useIOView({ triggerOnce: true, threshold: 0.4 })

  const stats = [
    { label: 'of Indians have no financial plan', suffix: '%', end: 95, color: '#E8272A', prefix: '' },
    { label: 'per year charged by human advisors', suffix: 'K+', end: 25, color: '#F0F0F5', prefix: '₹' },
    { label: 'minutes to get your full financial plan', suffix: '', end: 5, color: '#F0F0F5', prefix: '' },
    { label: 'free — every Indian with a smartphone', suffix: '', end: 100, color: '#10B981', prefix: '', isText: 'Free' },
  ]

  return (
    <section style={{
      background: '#111118',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '64px 48px',
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
      }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center', padding: '0 24px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}
          >
            {/* Number — Playfair Display per blueprint */}
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 800,
              lineHeight: 1, marginBottom: 12,
              color: s.color, fontVariantNumeric: 'tabular-nums',
            }}>
              {s.isText ? s.isText : (
                inView ? (
                  <CountUp
                    start={0} end={s.end} duration={1.8}
                    prefix={s.prefix} suffix={s.suffix}
                    useEasing={true} easingFn={(t, b, c, d) => {
                      // easeOut cubic
                      t /= d; t--; return c * (t * t * t + 1) + b
                    }}
                  />
                ) : `${s.prefix}0${s.suffix}`
              )}
            </p>
            <p style={{ fontSize: 13, color: '#9A9AAD', lineHeight: 1.5, fontWeight: 500 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  HOW IT WORKS — 3-step Collect → Compute → Advise
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01', icon: CheckSquare, title: 'Collect',
      desc: 'User fills a form or uploads a PDF. React captures all inputs and sends them to the Python backend as a structured JSON object.',
    },
    {
      num: '02', icon: Activity, title: 'Compute',
      desc: 'Python runs real financial formulas — SIP amounts, tax savings, XIRR calculations, overlap analysis, and health scores.',
    },
    {
      num: '03', icon: MessageSquare, title: 'Advise',
      desc: 'LLaMA 3.3 70B on Groq receives structured data + live ET context and writes advisor-quality, personalized narratives.',
    },
  ]

  return (
    <section id="how" style={{ padding: '110px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHead
          label="The Engine"
          title="Three steps.<br/>Every feature."
          sub="Artha follows one universal Collect → Compute → Advise pattern across all 5 modules. Build it once, scale it five times."
          center
        />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginTop: 64,
        }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.num} delay={i * 0.14}>
                <motion.div
                  whileHover={{ borderColor: 'rgba(232,39,42,0.3)', y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    background: '#111118',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, padding: '36px 30px',
                    position: 'relative', overflow: 'hidden',
                    cursor: 'default',
                  }}
                >
                  {/* Large background number */}
                  <span style={{
                    position: 'absolute', top: 16, right: 22,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 72, fontWeight: 900,
                    color: '#18181F', lineHeight: 1,
                    userSelect: 'none', pointerEvents: 'none',
                  }}>
                    {s.num}
                  </span>

                  {/* Top bar on hover */}
                  <motion.div
                    initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: 'linear-gradient(90deg, #E8272A, transparent)',
                      transformOrigin: 'left', borderRadius: '20px 20px 0 0',
                    }}
                  />

                  <div style={{
                    width: 50, height: 50, borderRadius: 13,
                    background: 'rgba(232,39,42,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 22,
                  }}>
                    <Icon size={22} color="#E8272A" strokeWidth={2} />
                  </div>

                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#9A9AAD', lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FEATURES GRID — all 5 modules with complexity badges
// ─────────────────────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, iconColor, iconBg, badgeLabel, badgeBg, badgeColor, title, desc, tags, wide = false, delay = 0, etRss = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal delay={delay} style={{ gridColumn: wide ? 'span 2' : 'span 1' }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -8, boxShadow: '0 28px 72px rgba(0,0,0,0.5)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          height: '100%',
          background: '#111118',
          border: `1px solid ${hovered ? 'rgba(232,39,42,0.28)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 22, padding: '32px 28px',
          position: 'relative', overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.3s',
        }}
      >
        {/* Animated top line on hover */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #E8272A 40%, transparent)',
            transformOrigin: 'left', borderRadius: '22px 22px 0 0',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            style={{
              width: 52, height: 52, borderRadius: 14,
              background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon size={23} color={iconColor} strokeWidth={2} />
          </motion.div>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
            padding: '4px 12px', borderRadius: 100,
            background: badgeBg, color: badgeColor,
          }}>
            {badgeLabel}
          </span>
        </div>

        {/* ET RSS badge */}
        {etRss && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(232,39,42,0.08)', border: '1px solid rgba(232,39,42,0.2)',
            borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 600,
            color: '#E8272A', marginBottom: 12, letterSpacing: '0.4px',
          }}>
            <Zap size={9} /> ET RSS LIVE
          </div>
        )}

        <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#9A9AAD', lineHeight: 1.7 }}>{desc}</p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 22 }}>
          {tags.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 500, color: '#9A9AAD',
              background: '#18181F', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 7, padding: '4px 11px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </Reveal>
  )
}

function FeaturesGrid() {
  const features = [
    {
      icon: Heart, iconColor: '#10B981', iconBg: 'rgba(16,185,129,0.12)',
      badgeLabel: 'Low · ~2 hrs', badgeBg: 'rgba(16,185,129,0.12)', badgeColor: '#10B981',
      title: 'Money Health Score',
      desc: '12 questions across 6 dimensions produce a score out of 100 and an AI-written action plan. Radar chart expands with a number counting up from zero — your financial vitals in 5 minutes.',
      tags: ['Radar Chart', 'React Countup', 'Score / 100', 'AI Action Plan'],
      delay: 0.1,
    },
    {
      icon: Clock, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)',
      badgeLabel: 'Medium · ~3 hrs', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#F59E0B',
      title: 'FIRE Path Planner', wide: true, etRss: true,
      desc: 'Financial Independence, Retire Early. Enter income, expenses, savings and life goals. Artha builds a month-by-month roadmap with SIP targets, asset allocation shifts, insurance gap analysis, and emergency fund targets — grounded in today\'s ET market data and RBI repo rate.',
      tags: ['Live ET RSS', 'Timeline Chart', 'Donut Allocation', 'SIP Calculator', 'CAGR 12%'],
      delay: 0.2,
    },
    {
      icon: FileText, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)',
      badgeLabel: 'Medium · ~3 hrs', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#F59E0B',
      title: 'Tax Wizard', wide: true, etRss: true,
      desc: 'Upload Form 16 PDF or enter salary manually. Artha runs old vs new regime calculations side-by-side, finds every missed deduction (80C, 80D, NPS, HRA), and tells you exactly what to do before March 31 — using Budget 2025 rules pulled live from ET.',
      tags: ['PDF Upload', 'Live ET RSS', 'Old vs New Regime', '80C / 80D / NPS', 'pdfplumber'],
      delay: 0.1,
    },
    {
      icon: BarChart3, iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.12)',
      badgeLabel: 'High · ~4 hrs', badgeBg: 'rgba(239,68,68,0.12)', badgeColor: '#EF4444',
      title: 'MF Portfolio X-Ray',
      desc: 'Upload your CAMS or KFintech PDF. Get true XIRR, overlap analysis across all holdings, expense ratio drag, benchmark comparison, and a full rebalancing plan — all in under 10 seconds.',
      tags: ['XIRR · pyxirr', 'Overlap Analysis', 'CAMS PDF', 'Expense Ratio'],
      delay: 0.2,
    },
    {
      icon: Users, iconColor: '#10B981', iconBg: 'rgba(16,185,129,0.12)',
      badgeLabel: 'Low · ~2 hrs', badgeBg: 'rgba(16,185,129,0.12)', badgeColor: '#10B981',
      title: "Couple's Money Planner",
      desc: "India's first AI joint financial planner. Both partners enter their data simultaneously. Artha optimizes HRA claims, routes 80C investments through the right bracket, and builds a combined net worth projection.",
      tags: ['Dual Income', 'HRA Optimizer', 'Joint Net Worth', '80C Routing'],
      delay: 0.3,
    },
  ]

  return (
    <section id="features" style={{ padding: '0 48px 110px', maxWidth: 1148, margin: '0 auto' }}>
      <SectionHead
        label="Five Modules"
        title="Everything a financial<br/>advisor would tell you."
        sub="Five complete AI-powered features — each with real math, live market data, and personalized advice."
      />

      <motion.div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginTop: 52,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={V.stagger(0.1)}
      >
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  TECH STACK SECTION — all libs from blueprint
// ─────────────────────────────────────────────────────────────────────────────
function TechStack() {
  const frontend = [
    { name: 'React 18', role: 'Core UI framework', color: '#61DAFB' },
    { name: 'shadcn/ui', role: 'Accessible components', color: '#ffffff' },
    { name: 'Framer Motion', role: 'All animations', color: '#BB2CC0' },
    { name: 'Lottie React', role: 'Loading states', color: '#F9A825' },
    { name: 'Recharts', role: 'Radar / Line / Donut', color: '#22C55E' },
    { name: 'Lucide React', role: 'Icon library', color: '#6366F1' },
    { name: 'React Dropzone', role: 'PDF uploads', color: '#E8272A' },
    { name: 'React Countup', role: 'Animated numbers', color: '#F59E0B' },
  ]

  const backend = [
    { name: 'Python 3.11', role: 'Backend language', color: '#3776AB' },
    { name: 'FastAPI', role: 'API framework', color: '#009485' },
    { name: 'pyxirr', role: 'XIRR calculation', color: '#F97316' },
    { name: 'pdfplumber', role: 'PDF extraction', color: '#8B5CF6' },
    { name: 'feedparser', role: 'ET RSS feeds', color: '#E8272A' },
    { name: 'Pydantic', role: 'Data validation', color: '#E92063' },
  ]

  const ai = [
    { name: 'Groq API', role: 'AI inference', color: '#F36F20' },
    { name: 'LLaMA 3.3 70B', role: 'Primary model', color: '#10B981' },
    { name: 'LLaMA 3.1 8B', role: 'PDF extraction', color: '#6EE7B7' },
    { name: 'ET RSS Feeds', role: 'Live market data', color: '#E8272A' },
  ]

  const LayerRow = ({ label, items, delay }) => (
    <Reveal delay={delay}>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            color: '#9A9AAD', background: '#18181F', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 6, padding: '4px 12px',
          }}>
            {label}
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {items.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{
                borderColor: 'rgba(232,39,42,0.3)',
                background: 'rgba(232,39,42,0.06)',
                y: -2,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                background: '#18181F',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'default', transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                <p style={{ fontSize: 11, color: '#9A9AAD' }}>{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  )

  return (
    <section id="tech" style={{
      background: '#111118',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '100px 48px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHead
          label="Tech Stack"
          title="Built with the best<br/>tools for the job."
          sub="Three layers work together seamlessly. The user never sees the complexity — only a conversation that feels like a knowledgeable friend."
        />

        <div style={{ marginTop: 56 }}>
          <LayerRow label="Layer 1 — Frontend" items={frontend} delay={0.1} />
          <LayerRow label="Layer 2 — Backend" items={backend} delay={0.2} />
          <LayerRow label="Layer 3 — AI" items={ai} delay={0.3} />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  DEMO STRATEGY — 5 minute pitch flow from blueprint
// ─────────────────────────────────────────────────────────────────────────────
function DemoSection() {
  const [activeMin, setActiveMin] = useState(1)

  const minutes = [
    { min: 1, label: 'The Hook', icon: Star, color: '#E8272A', desc: 'Open with the problem stat: 95% of Indians have no financial plan. Launch Artha live — the dark UI alone sets it apart from every other project.' },
    { min: 2, label: 'The Entry', icon: Heart, color: '#10B981', desc: 'Live-demo Money Health Score. Ask a judge to answer the 12 questions. Card-swipe animation, radar chart expanding, score counting up — they see their own score. Hooked.' },
    { min: 3, label: 'Core Feature', icon: TrendingUp, color: '#F59E0B', desc: 'Show pre-filled FIRE Planner. Point to the timeline, SIP amounts, asset allocation donut. Click Generate Roadmap — watch AI advice appear word by word. ET data referenced.' },
    { min: 4, label: 'Wow Moment', icon: Upload, color: '#8B5CF6', desc: 'Upload a prepared CAMS PDF. Lottie scan animation plays. In 8–10 seconds the full portfolio dashboard appears. Point to XIRR, overlap warnings, rebalancing suggestions.' },
    { min: 5, label: 'Vision Close', icon: Sparkles, color: '#E8272A', desc: 'Show Tax Wizard with Budget 2025 rules from ET\'s live feed. Close: Artha is not a chatbot — it is India\'s first AI advisor that does the math AND reads ET so your users don\'t have to.' },
  ]

  const active = minutes[activeMin - 1]
  const ActiveIcon = active.icon

  return (
    <section style={{ padding: '110px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHead
          label="Demo Strategy"
          title="Win the room<br/>in 5 minutes."
          sub="Judges see 20+ projects. You have 5 minutes. This is the exact sequence that makes Artha unforgettable."
          center
        />

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 32, marginTop: 60, alignItems: 'start',
        }}>
          {/* Left: minute selector */}
          <Reveal variant="slideLeft">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {minutes.map((m) => {
                const MIcon = m.icon
                const isActive = activeMin === m.min
                return (
                  <motion.button
                    key={m.min}
                    onClick={() => setActiveMin(m.min)}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: isActive ? '#18181F' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(232,39,42,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 14, padding: '16px 20px',
                      color: '#F0F0F5', textAlign: 'left',
                      cursor: 'pointer', transition: 'all 0.25s',
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: isActive ? `${m.color}22` : '#18181F',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${isActive ? `${m.color}44` : 'transparent'}`,
                      transition: 'all 0.25s',
                    }}>
                      <MIcon size={17} color={isActive ? m.color : '#9A9AAD'} strokeWidth={2} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: isActive ? m.color : '#9A9AAD', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                        Minute {m.min}
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{m.label}</p>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: m.color }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </Reveal>

          {/* Right: detail card */}
          <Reveal variant="slideRight">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMin}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: '#111118',
                  border: `1px solid ${active.color}33`,
                  borderRadius: 22, padding: '40px 36px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Glow */}
                <div style={{
                  position: 'absolute', top: -60, right: -60, width: 200, height: 200,
                  borderRadius: '50%', background: `radial-gradient(circle, ${active.color}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `${active.color}18`,
                  border: `1px solid ${active.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <ActiveIcon size={26} color={active.color} strokeWidth={2} />
                </div>

                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '2px',
                  textTransform: 'uppercase', color: active.color, marginBottom: 10,
                }}>
                  Minute {active.min} of 5
                </p>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 30, fontWeight: 800, marginBottom: 18, lineHeight: 1.2,
                }}>
                  {active.label}
                </h3>

                <p style={{ fontSize: 15, color: '#9A9AAD', lineHeight: 1.75 }}>{active.desc}</p>

                {/* Progress bar */}
                <div style={{ marginTop: 32, display: 'flex', gap: 6 }}>
                  {minutes.map((m) => (
                    <motion.div
                      key={m.min}
                      animate={{ background: m.min <= activeMin ? active.color : '#18181F' }}
                      style={{ height: 3, flex: 1, borderRadius: 3 }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="cta" style={{
      padding: '120px 48px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Bottom glow */}
      <div style={{
        position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400,
        background: 'radial-gradient(ellipse, rgba(232,39,42,0.18) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <Reveal>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: '#E8272A', marginBottom: 18,
        }}>
          Start Now — It's Free
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(36px, 5.5vw, 62px)',
          fontWeight: 900, lineHeight: 1.06,
          letterSpacing: '-1.5px', marginBottom: 20,
        }}>
          95% of Indians deserve<br />
          the advice the top 5% get.
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <p style={{ fontSize: 17, color: '#9A9AAD', marginBottom: 44 }}>
          No advisor. No fees. No jargon. Just Artha.
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: '0 20px 64px rgba(232,39,42,0.5)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          style={{
            background: '#E8272A', color: '#fff',
            borderRadius: 13, padding: '18px 54px',
            fontSize: 18, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 40px rgba(232,39,42,0.4)',
          }}
        >
          Check My Money Health <ArrowRight size={20} />
        </motion.button>

        <p style={{ fontSize: 13, color: '#9A9AAD', marginTop: 18 }}>
          Takes 5 minutes · Completely free · No signup required
        </p>
      </Reveal>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '32px 48px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, fontWeight: 800,
      }}>
        Artha<span style={{ color: '#E8272A' }}>.</span>
      </div>
      <p style={{ fontSize: 13, color: '#9A9AAD' }}>
        ET × AI Hackathon 2025 — Confidential Submission
      </p>
      <p style={{ fontSize: 13, color: '#9A9AAD' }}>
        Artha (अर्थ) — wealth, prosperity, purpose.
      </p>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE TRANSITION WRAPPER  (from blueprint: 0.4s easeOut on every route)
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ background: '#0A0A0F', minHeight: '100vh', position: 'relative' }}
    >
      <CursorGlow />
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <HowItWorks />
      <FeaturesGrid />
      <TechStack />
      <DemoSection />
      <CTASection />
      <Footer />

      {/* Responsive helpers — md breakpoint */}
      <style>{`
        @media (min-width: 900px) {
          .hero-float-left, .hero-float-right, .hero-float-bottom {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          nav { padding: 0 20px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 768px) {
          .stats-inner-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid    { grid-template-columns: 1fr !important; }
          .how-grid         { grid-template-columns: 1fr !important; }
          .demo-grid        { grid-template-columns: 1fr !important; }
          .tech-layer-row   { flex-direction: column !important; }
        }
      `}</style>
    </motion.div>
  )
}
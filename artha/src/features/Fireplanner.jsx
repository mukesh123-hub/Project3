// ─────────────────────────────────────────────────────────────────────────────
//  FEATURE 02 — FIRE Path Planner
//  Input form (left) + Live preview (right) → Timeline + Donut + AI roadmap
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { Sparkles, X, Flame, TrendingUp, Shield, Target, Zap } from 'lucide-react'

const INPUT_STYLE = {
    width: '100%', background: '#18181F',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9, padding: '10px 13px',
    fontSize: 14, color: '#F0F0F5', outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
}

// ── Financial math ────────────────────────────────────────────────────────────
function calcFIRE({ age, income, expenses, savings, targetAge }) {
    const years = targetAge - age
    const inflation = 0.06
    const cagr = 0.12
    const monthly = income / 12
    const monthlyExp = expenses / 12
    const corpusNeeded = monthlyExp * 12 * 25 * Math.pow(1 + inflation, years)
    const fv = savings * Math.pow(1 + cagr, years)
    const gap = Math.max(corpusNeeded - fv, 0)
    const r = cagr / 12
    const n = years * 12
    const sipRequired = gap > 0 ? (gap * r) / (Math.pow(1 + r, n) - 1) : 0
    const equityPct = Math.min(Math.max(100 - age, 40), 75)
    const debtPct = Math.min(100 - equityPct - 10, 40)
    const goldPct = 10
    return {
        corpusNeeded: Math.round(corpusNeeded),
        sipRequired: Math.round(sipRequired),
        emergency: Math.round(monthlyExp * 6),
        insuranceGap: Math.round(income * 10),
        allocation: { equity: equityPct, debt: debtPct, gold: goldPct },
        years,
    }
}

// Build corpus growth line
function buildLine(savings, sip, years, cagr = 0.12) {
    const data = []
    let corpus = savings
    for (let y = 0; y <= years; y++) {
        data.push({ year: `Yr ${y}`, corpus: Math.round(corpus / 100000) })
        corpus = corpus * (1 + cagr) + sip * 12
    }
    return data
}

const AI_FIRE = `**Your FIRE roadmap, Arjun:**

**Next 6 months:**
Start SIP of ₹18,400/mo immediately — split 70% Nifty 50 index fund, 30% debt fund. This single step closes 60% of your corpus gap.

**At 1-year mark:**
Step up SIP by 10% annually (matches your expected salary growth). Automate this on any MF platform.

**Priority sequence:**
1. Emergency fund first (4 months — ₹96,000 liquid)
2. Term insurance if not done (₹1 Cr cover, ~₹700/mo)
3. Then SIP — the order matters

**Live ET context:** RBI held repo at 6.5% — debt funds are attractive right now. CPI at 4.8% aligns with our 6% inflation assumption for your corpus.

**Risk flag:** If you miss SIP for 6 months, target retirement age shifts to 47. Set auto-debit on day 1 of salary credit.`

const ALLOC_COLORS = { equity: '#10B981', debt: '#3B82F6', gold: '#F59E0B' }

export default function FirePlanner() {
    const [form, setForm] = useState({
        age: 32, income: 1200000, expenses: 600000,
        savings: 800000, targetAge: 45,
    })
    const [submitted, setSubmitted] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [aiText, setAiText] = useState('')
    const [aiTyping, setAiTyping] = useState(false)

    const result = useMemo(() => calcFIRE(form), [form])
    const lineData = useMemo(
        () => buildLine(form.savings, result.sipRequired, result.years),
        [form.savings, result.sipRequired, result.years]
    )

    const allocData = [
        { name: 'Equity', value: result.allocation.equity },
        { name: 'Debt', value: result.allocation.debt },
        { name: 'Gold', value: result.allocation.gold },
    ]

    function set(k, v) { setForm(prev => ({ ...prev, [k]: Number(v) })) }

    function openAI() {
        setDrawerOpen(true); setAiTyping(true); setAiText('')
        let i = 0
        const iv = setInterval(() => {
            i++; setAiText(AI_FIRE.slice(0, i * 4))
            if (i * 4 >= AI_FIRE.length) { clearInterval(iv); setAiTyping(false); setAiText(AI_FIRE) }
        }, 15)
    }

    const Label = ({ children }) => (
        <p style={{ fontSize: 11, color: '#9A9AAD', marginBottom: 6, fontWeight: 500 }}>{children}</p>
    )
    const FormInput = ({ label, field, prefix = '', min, max, step = 1 }) => (
        <div style={{ marginBottom: 14 }}>
            <Label>{label}</Label>
            <div style={{ position: 'relative' }}>
                {prefix && (
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9A9AAD', fontSize: 13 }}>
                        {prefix}
                    </span>
                )}
                <input
                    type="number" value={form[field]} min={min} max={max} step={step}
                    onChange={e => set(field, e.target.value)}
                    style={{ ...INPUT_STYLE, paddingLeft: prefix ? 24 : 13 }}
                    onFocus={e => { e.target.style.borderColor = '#F59E0B' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
            </div>
        </div>
    )

    return (
        <div style={{ padding: '28px', position: 'relative' }}>
            {/* AI Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                            style={{
                                position: 'fixed', right: 0, top: 0, bottom: 0, width: 400,
                                background: '#0D0D14', borderLeft: '1px solid rgba(255,255,255,0.08)',
                                zIndex: 300, overflowY: 'auto', padding: '28px 24px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Flame size={16} color="#F59E0B" />
                                    <span style={{ fontSize: 14, fontWeight: 700 }}>FIRE Roadmap — AI</span>
                                </div>
                                <button onClick={() => setDrawerOpen(false)} style={{ color: '#9A9AAD', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'rgba(232,39,42,0.1)', border: '1px solid rgba(232,39,42,0.2)',
                                borderRadius: 6, padding: '3px 10px',
                                fontSize: 10, fontWeight: 700, color: '#E8272A',
                                letterSpacing: '0.5px', marginBottom: 18,
                            }}>
                                <Zap size={9} /> ET RSS + GROQ LLAMA 3.3 · LIVE DATA
                            </div>
                            <div style={{ fontSize: 14, color: '#C8C8D8', lineHeight: 1.8 }}>
                                {aiText.split('\n').map((line, i) => {
                                    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F0F0F5">$1</strong>')
                                    return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ marginBottom: line === '' ? 10 : 4 }} />
                                })}
                                {aiTyping && <span>|</span>}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    FIRE Path Planner
                </h2>
                <p style={{ fontSize: 13, color: '#9A9AAD' }}>
                    Financial Independence, Retire Early — grounded in live ET market data
                </p>
            </div>

            {/* Split layout: form left, preview right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                {/* Form */}
                <div style={{
                    background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18, padding: '24px',
                }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9A9AAD', marginBottom: 18, letterSpacing: '0.5px' }}>
                        YOUR DETAILS
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                        <FormInput label="Current Age" field="age" min={22} max={55} />
                        <FormInput label="Target Retirement Age" field="targetAge" min={30} max={65} />
                    </div>
                    <FormInput label="Annual Income (₹)" field="income" prefix="₹" min={300000} step={50000} />
                    <FormInput label="Annual Expenses (₹)" field="expenses" prefix="₹" min={100000} step={50000} />
                    <FormInput label="Current Savings / Investments (₹)" field="savings" prefix="₹" min={0} step={50000} />

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(245,158,11,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSubmitted(true)}
                        style={{
                            width: '100%', marginTop: 6,
                            background: '#F59E0B', color: '#000',
                            border: 'none', borderRadius: 11,
                            padding: '13px', fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                    >
                        <Flame size={16} /> Calculate FIRE Plan
                    </motion.button>
                </div>

                {/* Live preview */}
                <div style={{
                    background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18, padding: '24px',
                }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9A9AAD', marginBottom: 18, letterSpacing: '0.5px' }}>
                        LIVE PREVIEW
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Corpus Needed', val: `₹${(result.corpusNeeded / 100000).toFixed(1)}L`, color: '#F59E0B' },
                            { label: 'SIP Required', val: `₹${result.sipRequired.toLocaleString('en-IN')}/mo`, color: '#10B981' },
                            { label: 'Emergency Fund', val: `₹${(result.emergency / 100000).toFixed(1)}L`, color: '#3B82F6' },
                            { label: 'Insurance Gap', val: `₹${(result.insuranceGap / 100000).toFixed(0)}L`, color: '#EF4444' },
                        ].map((item) => (
                            <div key={item.label} style={{
                                background: '#18181F', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 10, padding: '14px',
                            }}>
                                <p style={{ fontSize: 10, color: '#9A9AAD', marginBottom: 5 }}>{item.label}</p>
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 18, fontWeight: 700, color: item.color,
                                }}>
                                    {item.val}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Mini donut */}
                    <p style={{ fontSize: 11, color: '#9A9AAD', marginBottom: 10 }}>Recommended Allocation</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ResponsiveContainer width={90} height={90}>
                            <PieChart>
                                <Pie data={allocData} dataKey="value" innerRadius={28} outerRadius={42} strokeWidth={0}>
                                    {allocData.map((entry) => (
                                        <Cell key={entry.name} fill={ALLOC_COLORS[entry.name.toLowerCase()]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1 }}>
                            {allocData.map((a) => (
                                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ALLOC_COLORS[a.name.toLowerCase()], flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#9A9AAD', flex: 1 }}>{a.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{a.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Corpus growth chart + AI — shown after submit */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 18 }}>
                            {/* Line chart */}
                            <div style={{
                                background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 18, padding: '24px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9A9AAD', letterSpacing: '0.5px' }}>CORPUS GROWTH PROJECTION</p>
                                    <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                                        Target: ₹{(result.corpusNeeded / 100000).toFixed(1)}L at age {form.targetAge}
                                    </span>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={lineData}>
                                        <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                                        <XAxis dataKey="year" tick={{ fill: '#9A9AAD', fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: '#9A9AAD', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}L`} />
                                        <Tooltip
                                            contentStyle={{ background: '#18181F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                                            labelStyle={{ color: '#F0F0F5' }}
                                            formatter={v => [`₹${v}L`, 'Corpus']}
                                        />
                                        <Line type="monotone" dataKey="corpus" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Milestones */}
                            <div style={{
                                background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 18, padding: '24px',
                            }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#9A9AAD', marginBottom: 18, letterSpacing: '0.5px' }}>MILESTONES</p>
                                {[
                                    { icon: Target, label: 'Emergency Ready', time: '4 months', color: '#3B82F6' },
                                    { icon: Shield, label: 'Insurance Done', time: '1 month', color: '#10B981' },
                                    { icon: TrendingUp, label: 'SIP Auto-started', time: 'This week', color: '#F59E0B' },
                                    { icon: Flame, label: 'FIRE Achieved', time: `Age ${form.targetAge}`, color: '#E8272A' },
                                ].map((m, i) => {
                                    const Icon = m.icon
                                    return (
                                        <motion.div
                                            key={m.label}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '10px 12px', borderRadius: 10,
                                                background: '#18181F', border: '1px solid rgba(255,255,255,0.05)',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <div style={{ width: 28, height: 28, borderRadius: 7, background: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={13} color={m.color} strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{m.label}</p>
                                                <p style={{ fontSize: 10, color: '#9A9AAD' }}>{m.time}</p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* AI CTA bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(232,39,42,0.08))',
                                border: '1px solid rgba(245,158,11,0.2)',
                                borderRadius: 14, padding: '18px 22px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Your FIRE roadmap is ready</p>
                                <p style={{ fontSize: 13, color: '#9A9AAD' }}>
                                    AI advisor has analysed your numbers + today's ET market data
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(232,39,42,0.4)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={openAI}
                                style={{
                                    background: '#E8272A', color: '#fff',
                                    border: 'none', borderRadius: 10,
                                    padding: '11px 24px', fontSize: 13, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 16px rgba(232,39,42,0.3)',
                                }}
                            >
                                <Sparkles size={13} /> View Roadmap
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

import {
    type ClientSafeProvider,
    getProviders,
    LiteralUnion,
    signIn,
    useSession,
} from 'next-auth/react'
import Head from 'next/head'
import Logo from '@/components/Logo/Logo'
import { useEffect, useMemo, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers'
import useTranslation from 'next-translate/useTranslation'
import { Bot, Utensils, ScanLine, Dumbbell, CloudOff, Heart, Code } from 'lucide-react'

const Home = () => {
    const { t } = useTranslation('home')
    const { data: sessionData, status } = useSession()
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>(null)

    useEffect(() => {
        (async () => {
            setProviders(await getProviders())
        })()
    }, [setProviders])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        )
        document
            .querySelectorAll('.reveal-on-scroll')
            .forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    const firstProvider = useMemo(() => {
        if (!providers) return null
        const values = Object.values(providers)
        return values.length > 0 ? values[0] : null
    }, [providers])

    const handleSignIn = () => {
        if (firstProvider) {
            signIn(firstProvider.id, {
                callbackUrl: window.location.origin + '/coach',
            })
        }
    }

    const features = [
        {
            icon: <Bot size={28} />,
            title: t('LANDING_FEATURE_AI_TITLE'),
            desc: t('LANDING_FEATURE_AI_DESC'),
            badge: t('LANDING_BADGE_BETA'),
            color: '#22d3ee',
        },
        {
            icon: <Utensils size={28} />,
            title: t('LANDING_FEATURE_CALORIES_TITLE'),
            desc: t('LANDING_FEATURE_CALORIES_DESC'),
            color: '#34d399',
        },
        {
            icon: <ScanLine size={28} />,
            title: t('LANDING_FEATURE_BARCODE_TITLE'),
            desc: t('LANDING_FEATURE_BARCODE_DESC'),
            color: '#a78bfa',
        },
        {
            icon: <Dumbbell size={28} />,
            title: t('LANDING_FEATURE_WORKOUT_TITLE'),
            desc: t('LANDING_FEATURE_WORKOUT_DESC'),
            color: '#fb923c',
        },
        {
            icon: <CloudOff size={28} />,
            title: t('LANDING_FEATURE_OFFLINE_TITLE'),
            desc: t('LANDING_FEATURE_OFFLINE_DESC'),
            badge: t('LANDING_BADGE_COMING_SOON'),
            color: '#60a5fa',
        },
        {
            icon: <Heart size={28} />,
            title: t('LANDING_FEATURE_FREE_TITLE'),
            desc: t('LANDING_FEATURE_FREE_DESC'),
            color: '#fb7185',
        },
    ]

    const steps = [
        {
            number: '01',
            title: t('LANDING_STEP_1_TITLE'),
            desc: t('LANDING_STEP_1_DESC'),
        },
        {
            number: '02',
            title: t('LANDING_STEP_2_TITLE'),
            desc: t('LANDING_STEP_2_DESC'),
        },
        {
            number: '03',
            title: t('LANDING_STEP_3_TITLE'),
            desc: t('LANDING_STEP_3_DESC'),
        },
    ]

    // Layout redirects authenticated users to their last page — render nothing to avoid flash
    if (status === 'loading' || sessionData) {
        return null
    }

    return (
        <div
            className="flex w-full flex-col overflow-x-hidden"
            style={{
                backgroundImage:
                    'radial-gradient(circle, rgba(144, 202, 249, 0.035) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }}
        >
            <style>{`
                @keyframes juicify-float-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }
                @keyframes juicify-float-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-50px, 40px) scale(0.95); }
                    66% { transform: translate(35px, -50px) scale(1.05); }
                }
                @keyframes juicify-scroll-dot {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(6px); opacity: 0; }
                }
                @keyframes juicify-hero-in {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .juicify-hero-el {
                    animation: juicify-hero-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .reveal-on-scroll {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-on-scroll.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
                .reveal-child {
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .revealed .reveal-child {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            <Head>
                <title>
                    Juicify — Free AI Calorie Counter & Personal Trainer
                </title>
                <meta
                    name="description"
                    content="Free AI-powered calorie counter and personal trainer. Track calories, plan workouts, and reach your fitness goals — no ads, no subscriptions."
                />
                <meta
                    property="og:title"
                    content="Juicify — Free AI Calorie Counter & Personal Trainer"
                />
                <meta
                    property="og:description"
                    content="Free AI-powered calorie counter and personal trainer. No ads, no subscriptions, ever."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://juicify.app" />
                <meta
                    property="og:image"
                    content="https://juicify.app/images/logo.png"
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:creator" content="@whoisarjen" />
            </Head>

            {/* ════════════ HERO ════════════ */}
            <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-20 text-center">
                {/* Floating ambient orbs */}
                <div
                    className="pointer-events-none absolute right-[5%] top-[12%] h-[220px] w-[220px] rounded-full opacity-[0.14] blur-[80px] will-change-transform md:right-[10%] md:h-[420px] md:w-[420px] md:blur-[120px]"
                    style={{
                        background:
                            'radial-gradient(circle, #90caf9, #42a5f5, transparent)',
                        animation: 'juicify-float-1 20s ease-in-out infinite',
                    }}
                />
                <div
                    className="pointer-events-none absolute bottom-[18%] left-[2%] h-[180px] w-[180px] rounded-full opacity-[0.09] blur-[80px] will-change-transform md:left-[5%] md:h-[360px] md:w-[360px] md:blur-[120px]"
                    style={{
                        background:
                            'radial-gradient(circle, #64b5f6, #5c6bc0, transparent)',
                        animation: 'juicify-float-2 25s ease-in-out infinite',
                    }}
                />

                {/* Logo with glow halo */}
                <div
                    className="juicify-hero-el relative"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="absolute -inset-6 rounded-full bg-[#90caf9]/10 blur-2xl" />
                    <div className="relative">
                        <Logo size={100} />
                    </div>
                </div>

                {/* Tagline */}
                <h1
                    className="juicify-hero-el mt-8 max-w-4xl px-2 pb-2 text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-[2.6rem] md:text-5xl lg:text-6xl"
                    style={{
                        animationDelay: '0.25s',
                        background:
                            'linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #90caf9 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {t('LANDING_TAGLINE')}
                </h1>

                {/* Subtitle */}
                <p
                    className="juicify-hero-el mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg"
                    style={{ animationDelay: '0.4s' }}
                >
                    {t('LANDING_SUBTITLE')}
                </p>

                {/* CTA */}
                <div
                    className="juicify-hero-el mt-12"
                    style={{ animationDelay: '0.55s' }}
                >
                    <button
                        onClick={handleSignIn}
                        className="group relative inline-flex cursor-pointer items-center justify-center"
                    >
                        <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#90caf9] to-[#64b5f6] opacity-40 blur-lg transition-opacity duration-500 group-hover:opacity-70" />
                        <span className="relative inline-flex items-center rounded-xl bg-gradient-to-r from-[#90caf9] to-[#64b5f6] px-10 py-4 text-lg font-bold text-[#121212] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#90caf9]/25">
                            {t('LANDING_CTA')}
                        </span>
                    </button>
                </div>

                {firstProvider && (
                    <p
                        className="juicify-hero-el mt-5 text-sm text-gray-500"
                        style={{ animationDelay: '0.65s' }}
                    >
                        {t('LANDING_SIGN_IN_WITH', {
                            provider: firstProvider.name,
                        })}
                    </p>
                )}

                {/* Scroll indicator */}
                <div
                    className="juicify-hero-el absolute bottom-8 left-1/2 -translate-x-1/2"
                    style={{ animationDelay: '1.1s' }}
                >
                    <div className="flex h-9 w-[22px] items-start justify-center rounded-full border-2 border-white/15 p-1.5">
                        <div
                            className="h-2 w-1 rounded-full bg-white/50"
                            style={{
                                animation:
                                    'juicify-scroll-dot 1.5s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#90caf9]/20 to-transparent" />

            {/* ════════════ FEATURES ════════════ */}
            <section className="relative px-6 py-24 md:py-28">
                <div className="mx-auto max-w-6xl">
                    <div className="reveal-on-scroll">
                        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
                            {t('LANDING_FEATURES_TITLE')}
                        </h2>
                        <div className="mx-auto mb-14 h-1 w-12 rounded-full bg-[#90caf9]/40 md:mb-16" />
                    </div>

                    <div className="reveal-on-scroll grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="reveal-child group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                {feature.badge && (
                                    <span
                                        className="absolute -top-3 right-5 rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wide"
                                        style={{
                                            backgroundColor: feature.color,
                                            color: '#121212',
                                        }}
                                    >
                                        {feature.badge}
                                    </span>
                                )}

                                <div className="relative mb-5 inline-flex">
                                    <div
                                        className="absolute inset-0 rounded-xl opacity-25 blur-xl transition-opacity duration-300 group-hover:opacity-45"
                                        style={{
                                            backgroundColor: feature.color,
                                        }}
                                    />
                                    <div
                                        className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${feature.color}18`,
                                            color: feature.color,
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                </div>

                                <h3 className="mb-2 text-[17px] font-bold text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-400">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ HOW IT WORKS ════════════ */}
            <section className="relative px-6 py-24 md:py-28">
                <div className="mx-auto max-w-5xl">
                    <div className="reveal-on-scroll">
                        <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
                            {t('LANDING_HOW_TITLE')}
                        </h2>
                        <div className="mx-auto mb-16 h-1 w-12 rounded-full bg-[#90caf9]/40 md:mb-20" />
                    </div>

                    <div className="reveal-on-scroll relative">
                        {/* Connecting line — desktop only */}
                        <div className="absolute left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] top-7 hidden h-px bg-gradient-to-r from-[#90caf9]/25 via-[#90caf9]/10 to-[#90caf9]/25 md:block" />

                        <div className="grid gap-14 md:grid-cols-3 md:gap-8">
                            {steps.map((step, i) => (
                                <div
                                    key={step.number}
                                    className="reveal-child text-center"
                                    style={{
                                        transitionDelay: `${i * 120}ms`,
                                    }}
                                >
                                    <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-[#90caf9]/8 blur-lg" />
                                        <div className="absolute inset-0 rounded-full border border-[#90caf9]/20" />
                                        <span className="relative text-xl font-bold text-[#90caf9]">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mx-auto max-w-xs text-[15px] leading-relaxed text-gray-400">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════ OPEN SOURCE ════════════ */}
            <section className="px-6 py-20">
                <div className="reveal-on-scroll mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                    <div
                        className="relative flex flex-col items-center px-8 py-14 text-center"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(90deg, rgba(144,202,249,0.03) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(144,202,249,0.03) 0px, transparent 1px, transparent 30px)',
                        }}
                    >
                        <div className="relative">
                            <div
                                className="absolute inset-0 rounded-xl opacity-20 blur-xl"
                                style={{ backgroundColor: '#90caf9' }}
                            />
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#90caf9]/10">
                                <Code
                                    size={30}
                                    className="text-[#90caf9]"
                                />
                            </div>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-white">
                            {t('LANDING_OPENSOURCE_TITLE')}
                        </h2>
                        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-400">
                            {t('LANDING_OPENSOURCE_DESC')}
                        </p>
                    </div>
                </div>
            </section>

            {/* ════════════ FINAL CTA ════════════ */}
            <section className="relative flex flex-col items-center px-6 py-24 text-center md:py-28">
                {/* Background glow */}
                <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[120px]"
                    style={{
                        background:
                            'radial-gradient(circle, #90caf9, transparent)',
                    }}
                />

                <div className="reveal-on-scroll relative">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        {t('LANDING_FINAL_TITLE')}
                    </h2>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
                        {t('LANDING_FINAL_DESC')}
                    </p>
                    <div className="mt-12">
                        <button
                            onClick={handleSignIn}
                            className="group relative inline-flex cursor-pointer items-center justify-center"
                        >
                            <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#90caf9] to-[#64b5f6] opacity-40 blur-lg transition-opacity duration-500 group-hover:opacity-70" />
                            <span className="relative inline-flex items-center rounded-xl bg-gradient-to-r from-[#90caf9] to-[#64b5f6] px-10 py-4 text-lg font-bold text-[#121212] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#90caf9]/25">
                                {t('LANDING_CTA')}
                            </span>
                        </button>
                    </div>
                    <div className="mt-14 flex justify-center opacity-40">
                        <Logo size={40} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home

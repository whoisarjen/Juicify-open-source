import {
    type ClientSafeProvider,
    getProviders,
    LiteralUnion,
    signIn,
    useSession,
} from 'next-auth/react'
import Logo from '@/components/Logo/Logo'
import { useEffect, useMemo, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers'
import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CodeIcon from '@mui/icons-material/Code'

const Home = () => {
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()
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
        if (sessionData) {
            window.location.reload()
        }
    }, [sessionData])

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

    const ctaButtonSx = {
        backgroundColor: '#90caf9',
        color: '#121212',
        fontWeight: 700,
        fontSize: '1.1rem',
        px: 5,
        py: 1.5,
        borderRadius: '12px',
        textTransform: 'none',
        '&:hover': { backgroundColor: '#64b5f6' },
    }

    const features = [
        {
            icon: <SmartToyIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_AI_TITLE'),
            desc: t('LANDING_FEATURE_AI_DESC'),
        },
        {
            icon: <RestaurantIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_CALORIES_TITLE'),
            desc: t('LANDING_FEATURE_CALORIES_DESC'),
        },
        {
            icon: <QrCodeScannerIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_BARCODE_TITLE'),
            desc: t('LANDING_FEATURE_BARCODE_DESC'),
        },
        {
            icon: <FitnessCenterIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_WORKOUT_TITLE'),
            desc: t('LANDING_FEATURE_WORKOUT_DESC'),
        },
        {
            icon: <CloudOffIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_OFFLINE_TITLE'),
            desc: t('LANDING_FEATURE_OFFLINE_DESC'),
        },
        {
            icon: <FavoriteIcon sx={{ color: '#90caf9', fontSize: 40 }} />,
            title: t('LANDING_FEATURE_FREE_TITLE'),
            desc: t('LANDING_FEATURE_FREE_DESC'),
        },
    ]

    const steps = [
        {
            number: '1',
            title: t('LANDING_STEP_1_TITLE'),
            desc: t('LANDING_STEP_1_DESC'),
        },
        {
            number: '2',
            title: t('LANDING_STEP_2_TITLE'),
            desc: t('LANDING_STEP_2_DESC'),
        },
        {
            number: '3',
            title: t('LANDING_STEP_3_TITLE'),
            desc: t('LANDING_STEP_3_DESC'),
        },
    ]

    return (
        <div className="flex w-full flex-col scroll-smooth">
            {/* Hero Section */}
            <section className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
                <Logo size={120} />
                <h1 className="mt-8 max-w-4xl text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                    {t('LANDING_TAGLINE')}
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-gray-400">
                    {t('LANDING_SUBTITLE')}
                </p>
                <div className="mt-10">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSignIn}
                        sx={ctaButtonSx}
                    >
                        {t('LANDING_CTA')}
                    </Button>
                </div>
                {firstProvider && (
                    <p className="mt-4 text-sm text-gray-500">
                        {t('LANDING_SIGN_IN_WITH', { provider: firstProvider.name })}
                    </p>
                )}
            </section>

            {/* Features Section */}
            <section className="px-4 py-24">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-16 text-center text-3xl font-bold text-white">
                        {t('LANDING_FEATURES_TITLE')}
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 transition hover:border-[#90caf9]/30"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="mb-2 text-lg font-bold text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="px-4 py-24">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-16 text-center text-3xl font-bold text-white">
                        {t('LANDING_HOW_TITLE')}
                    </h2>
                    <div className="grid gap-12 md:grid-cols-3">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="text-center"
                            >
                                <p className="mb-4 text-5xl font-bold text-[#90caf9]">
                                    {step.number}
                                </p>
                                <h3 className="mb-3 text-xl font-bold text-white">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Source Section */}
            <section className="px-4 py-20">
                <div className="mx-auto max-w-4xl rounded-2xl bg-[#1a1a1a] p-8 text-center">
                    <CodeIcon sx={{ color: '#90caf9', fontSize: 48 }} />
                    <h2 className="mt-4 text-2xl font-bold text-white">
                        {t('LANDING_OPENSOURCE_TITLE')}
                    </h2>
                    <p className="mt-4 text-gray-400">
                        {t('LANDING_OPENSOURCE_DESC')}
                    </p>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="flex flex-col items-center px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-white">
                    {t('LANDING_FINAL_TITLE')}
                </h2>
                <p className="mt-4 max-w-xl text-gray-400">
                    {t('LANDING_FINAL_DESC')}
                </p>
                <div className="mt-10">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSignIn}
                        sx={ctaButtonSx}
                    >
                        {t('LANDING_CTA')}
                    </Button>
                </div>
                <div className="mt-12">
                    <Logo size={48} />
                </div>
            </section>
        </div>
    )
}

export default Home

import {
    type ClientSafeProvider,
    LiteralUnion,
    signIn,
} from 'next-auth/react'
import Logo from '@/components/Logo/Logo'
import { type BuiltInProviderType } from 'next-auth/providers'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import SmartToyIcon from '@mui/icons-material/SmartToy'

interface LandingPageProps {
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null
}

const LandingPage = ({ providers }: LandingPageProps) => {
    const features = [
        {
            icon: <SmartToyIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'AI Personal Trainer',
            description: 'Built-in virtual trainer that analyzes your eating patterns and provides personalized recommendations in real-time.'
        },
        {
            icon: <RestaurantIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'Smart Nutrition Tracking',
            description: 'Comprehensive food diary with barcode scanning, macronutrient tracking, and a database of thousands of products.'
        },
        {
            icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'Workout Plans & Results',
            description: 'Create custom workout plans, track your results, and view detailed statistics to monitor your fitness progress.'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'Progress Analysis',
            description: 'Weekly progress checks with AI-powered adjustments to your diet and workout plan based on your results.'
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'Privacy First',
            description: 'No background syncing or data collection. Your information stays private and secure on your device.'
        },
        {
            icon: <MoneyOffIcon sx={{ fontSize: 40, color: '#90caf9' }} />,
            title: 'Free & Ad-Free',
            description: 'Enjoy all premium features completely free, with no annoying ads to disrupt your fitness journey.'
        },
    ]

    const benefits = [
        'No restrictive dieting - eat your favorite foods while hitting your goals',
        'Real-time body reaction analysis and personalized adjustments',
        'Offline functionality for privacy and convenience',
        'Comprehensive tutorial system to guide you every step',
        'Works with any fitness goal: weight loss, muscle building, or recomposition'
    ]

    return (
        <Box className="min-h-screen bg-black text-gray-300">
            {/* Hero Section */}
            <Container maxWidth="lg" className="py-12">
                <Box className="text-center mb-16">
                    <Box className="mb-8">
                        <Logo size={120} />
                    </Box>
                    <Typography 
                        variant="h2" 
                        className="font-bold mb-4 text-white"
                        sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                        Your AI Personal Trainer
                    </Typography>
                    <Typography 
                        variant="h5" 
                        className="mb-8 text-gray-400 max-w-3xl mx-auto"
                        sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                    >
                        The next-generation calorie counter and personal trainer that transforms the way you approach fitness and nutrition
                    </Typography>
                    
                    <Stack spacing={2} direction="column" alignItems="center">
                        {providers &&
                            Object.values(providers).map((provider) => (
                                <Button
                                    key={provider.name}
                                    variant="contained"
                                    size="large"
                                    onClick={() =>
                                        signIn(provider.id, {
                                            callbackUrl: 'http://juicify.app/coach',
                                        })
                                    }
                                    sx={{
                                        bgcolor: '#90caf9',
                                        color: 'black',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: '#64b5f6'
                                        }
                                    }}
                                >
                                    Get Started with {provider.name}
                                </Button>
                            ))}
                    </Stack>
                </Box>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" className="py-16">
                <Typography 
                    variant="h3" 
                    className="text-center font-bold mb-12 text-white"
                    sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                >
                    Why Choose Juicify?
                </Typography>
                
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    bgcolor: '#1e1e1e',
                                    color: '#e0e0e0',
                                    border: '1px solid #333'
                                }}
                            >
                                <CardContent className="p-6">
                                    <Box className="text-center mb-4">
                                        {feature.icon}
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        className="font-bold mb-3 text-white text-center"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        className="text-gray-400 text-center"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Benefits Section */}
            <Container maxWidth="lg" className="py-16">
                <Box className="text-center mb-12">
                    <Typography 
                        variant="h3" 
                        className="font-bold mb-6 text-white"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                    >
                        Transform Your Body, Transform Your Life
                    </Typography>
                    <Typography 
                        variant="h6" 
                        className="text-gray-400 mb-8 max-w-3xl mx-auto"
                    >
                        Juicify is designed to teach you how to achieve your fitness goals without restrictive diets or complicated rules.
                    </Typography>
                </Box>

                <Box className="max-w-2xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <Box key={index} className="flex items-start mb-4">
                            <Box className="w-2 h-2 rounded-full bg-primary-dark mt-2 mr-4 flex-shrink-0" />
                            <Typography variant="body1" className="text-gray-300">
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* Call to Action Section */}
            <Container maxWidth="lg" className="py-16">
                <Box className="text-center">
                    <Typography 
                        variant="h4" 
                        className="font-bold mb-4 text-white"
                        sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                    >
                        Ready to Start Your Journey?
                    </Typography>
                    <Typography 
                        variant="h6" 
                        className="mb-8 text-gray-400"
                    >
                        Join thousands of users who have transformed their bodies with Juicify
                    </Typography>
                    
                    <Stack spacing={2} direction="column" alignItems="center">
                        {providers &&
                            Object.values(providers).map((provider) => (
                                <Button
                                    key={provider.name}
                                    variant="outlined"
                                    size="large"
                                    onClick={() =>
                                        signIn(provider.id, {
                                            callbackUrl: 'http://juicify.app/coach',
                                        })
                                    }
                                    sx={{
                                        borderColor: '#90caf9',
                                        color: '#90caf9',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            borderColor: '#64b5f6',
                                            color: '#64b5f6',
                                            bgcolor: 'rgba(144, 202, 249, 0.1)'
                                        }
                                    }}
                                >
                                    Start Free with {provider.name}
                                </Button>
                            ))}
                    </Stack>
                </Box>
            </Container>

            {/* Footer */}
            <Box className="border-t border-gray-800 py-8">
                <Container maxWidth="lg">
                    <Typography 
                        variant="body2" 
                        className="text-center text-gray-500"
                    >
                        © 2024 Juicify.app - Your Personal Trainer in Your Pocket, Anytime, Anywhere.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default LandingPage
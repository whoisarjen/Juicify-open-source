import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { trpc } from '@/utils/trpc.utils'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { 
    Typography, 
    Card, 
    CardContent, 
    Grid, 
    Box, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    LinearProgress,
    Divider,
    Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const WorkoutStatisticsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('workout')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const username = router.query.login || ''
    const isOwner = sessionData?.user?.username == username

    const { data: statistics, isFetching } = trpc.workoutResult.getStatistics.useQuery(
        { username, year: selectedYear },
        { enabled: !!username }
    )

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

    const getWorkoutIntensityColor = (count: number) => {
        if (count === 0) return '#f5f5f5'
        if (count === 1) return '#d4edda'
        if (count === 2) return '#c3e6cb'
        if (count === 3) return '#b1dfbb'
        return '#28a745'
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            {isOwner ? (
                <NavbarOnlyTitle title="workout:WORKOUT_STATISTICS" />
            ) : (
                <NavbarProfile tab={2} />
            )}
            
            <Box className="mb-4">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>{t('YEAR')}</InputLabel>
                    <Select
                        value={selectedYear}
                        label={t('YEAR')}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {!isFetching && statistics && (
                <>
                    {/* Overview Cards */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">{t('TOTAL_WORKOUTS')}</Typography>
                                    </Box>
                                    <Typography variant="h3" color="primary" fontWeight="bold">
                                        {statistics.totalWorkouts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        in {statistics.year}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <LocalFireDepartmentIcon color="error" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Calories Burned</Typography>
                                    </Box>
                                    <Typography variant="h3" color="error.main" fontWeight="bold">
                                        {statistics.totalCaloriesBurned.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        total calories
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <CalendarMonthIcon color="success" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Weekly Average</Typography>
                                    </Box>
                                    <Typography variant="h3" color="success.main" fontWeight="bold">
                                        {statistics.averageWorkoutsPerWeek}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        workouts/week
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <CalendarMonthIcon color="info" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Monthly Average</Typography>
                                    </Box>
                                    <Typography variant="h3" color="info.main" fontWeight="bold">
                                        {statistics.averageWorkoutsPerMonth}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        workouts/month
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Year Comparison */}
                    {Object.keys(statistics.yearlyComparison).length > 0 && (
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Year-over-Year Comparison
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(statistics.yearlyComparison)
                                        .sort(([a], [b]) => Number(b) - Number(a))
                                        .map(([year, count]) => (
                                            <Grid item xs={12} sm={4} key={year}>
                                                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="h4" color="primary">
                                                        {count}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {year}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {count !== statistics.totalWorkouts && (
                                                            <span>
                                                                {count < statistics.totalWorkouts ? '↑' : '↓'} 
                                                                {Math.abs(statistics.totalWorkouts - count)} from current year
                                                            </span>
                                                        )}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Monthly Breakdown */}
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Monthly Breakdown
                    </Typography>
                    
                    {statistics.months.map((month, index) => (
                        <Accordion key={month.month} defaultExpanded={index < 3}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box display="flex" alignItems="center" width="100%">
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {month.monthName} {month.year}
                                    </Typography>
                                    <Box display="flex" gap={2} alignItems="center" sx={{ mr: 2 }}>
                                        <Chip 
                                            label={`${month.totalWorkouts} workouts`} 
                                            color={month.totalWorkouts > 0 ? "primary" : "default"}
                                            size="small"
                                        />
                                        <Chip 
                                            label={`${month.totalCaloriesBurned} cal`} 
                                            color="secondary"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* Weekly breakdown for this month */}
                                <Typography variant="subtitle1" gutterBottom>
                                    Weekly Breakdown
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    {month.weeks.map(week => (
                                        <Grid item xs={12} sm={6} md={3} key={week.week}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {week.week}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {week.workouts} workouts
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {week.caloriesBurned} calories
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={week.workouts > 0 ? Math.min((week.workouts / 7) * 100, 100) : 0}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ my: 2 }} />
                                
                                {/* Daily calendar view */}
                                <Typography variant="subtitle1" gutterBottom>
                                    Daily Activity
                                </Typography>
                                <Grid container spacing={1}>
                                    {month.dailyBreakdown.map(day => (
                                        <Grid item xs={12/7} key={day.date}>
                                            <Paper 
                                                sx={{ 
                                                    p: 1, 
                                                    textAlign: 'center', 
                                                    backgroundColor: getWorkoutIntensityColor(day.workouts),
                                                    minHeight: 60,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    border: day.workouts > 0 ? '2px solid #1976d2' : '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Typography variant="caption" display="block">
                                                    {new Date(day.date).getDate()}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    {day.dayName.slice(0, 3)}
                                                </Typography>
                                                {day.workouts > 0 && (
                                                    <>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {day.workouts}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {day.caloriesBurned}cal
                                                        </Typography>
                                                    </>
                                                )}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    {statistics.totalWorkouts === 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="body1" color="text.secondary" align="center">
                                    No workouts found for {statistics.year}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {isFetching && (
                <Card>
                    <CardContent>
                        <Typography variant="body1" align="center">
                            Loading detailed statistics...
                        </Typography>
                        <LinearProgress sx={{ mt: 2 }} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default WorkoutStatisticsPage
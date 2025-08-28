import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { trpc } from '@/utils/trpc.utils'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { BoxWorkoutLoader } from '@/containers/Workout/BoxWorkoutLoader'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

const WorkoutStatisticsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('workout')
    const theme = useTheme()

    const username = router.query.login || ''
    const isOwner = sessionData?.user?.username == username

    const { data: statistics, isFetching } = trpc.workoutResult.getStatistics.useQuery(
        { username },
        { enabled: !!username }
    )

    const getWorkoutIntensityStyles = (count: number) => {
        if (count === 0) return { backgroundColor: '#f5f5f5', color: '#9e9e9e', border: '1px solid #e0e0e0' }
        if (count === 1) return { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #90caf9' }
        if (count === 2) return { backgroundColor: '#bbdefb', color: '#1565c0', border: '1px solid #64b5f6' }
        if (count === 3) return { backgroundColor: '#90caf9', color: '#0d47a1', border: '1px solid #42a5f5' }
        return { backgroundColor: '#2196f3', color: '#ffffff', border: '1px solid #1976d2' }
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            {isOwner ? (
                <NavbarOnlyTitle title="workout:WORKOUT_STATISTICS" />
            ) : (
                <NavbarProfile tab={2} />
            )}

            <BoxWorkoutLoader isLoading={isFetching}>
                <>
                    {statistics && (
                        <>
                            {/* Date Range Header */}
                            {statistics.dateRange.earliest && statistics.dateRange.latest && (
                                <Card sx={{ mb: 2 }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {t('COMPLETE_HISTORY')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {statistics.dateRange.earliest} - {statistics.dateRange.latest}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {statistics.months.length} {t('ACTIVE_MONTHS')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Overview Stats */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6} md={3}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" display="block">
                                                {t('TOTAL_WORKOUTS')}
                                            </Typography>
                                            <Box display="flex" alignItems="baseline">
                                                <Typography variant="h4" color="primary.main" fontWeight="bold">
                                                    {statistics.totalWorkouts}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                    {t('TOTAL')}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={6} md={3}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" display="block">
                                                {t('CALORIES_BURNED')}
                                            </Typography>
                                            <Box display="flex" alignItems="baseline">
                                                <Typography variant="h4" color="error.main" fontWeight="bold">
                                                    {statistics.totalCaloriesBurned.toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                    cal
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={6} md={3}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" display="block">
                                                {t('WEEKLY_AVERAGE')}
                                            </Typography>
                                            <Box display="flex" alignItems="baseline">
                                                <Typography variant="h4" color="success.main" fontWeight="bold">
                                                    {statistics.averageWorkoutsPerWeek}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                    /week
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={6} md={3}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="overline" color="text.secondary" display="block">
                                                {t('MONTHLY_AVERAGE')}
                                            </Typography>
                                            <Box display="flex" alignItems="baseline">
                                                <Typography variant="h4" color="info.main" fontWeight="bold">
                                                    {statistics.averageWorkoutsPerMonth}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                    /month
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Year Comparison */}
                            {Object.keys(statistics.yearlyComparison).length > 1 && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {t('YEAR_COMPARISON')}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {Object.entries(statistics.yearlyComparison)
                                                .sort(([a], [b]) => Number(b) - Number(a))
                                                .map(([year, count]) => (
                                                    <Grid item xs={4} sm={3} md={2} key={year}>
                                                        <Box textAlign="center" p={2} border={1} borderColor="divider" borderRadius={1}>
                                                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                                                {count as number}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {year}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Monthly Breakdown */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                        {t('MONTHLY_BREAKDOWN')}
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {statistics.months.map((month) => (
                                            <Grid item xs={12} sm={6} lg={4} xl={3} key={month.month}>
                                                <Box border={1} borderColor="divider" borderRadius={2} p={2}>
                                                    {/* Month Header */}
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="medium">
                                                                {month.monthName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {month.year}
                                                            </Typography>
                                                        </Box>
                                                        <Box textAlign="right">
                                                            <Chip 
                                                                label={`${month.totalWorkouts} ${t('WORKOUTS')}`}
                                                                size="small"
                                                                color={month.totalWorkouts > 0 ? "primary" : "default"}
                                                            />
                                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                                                {month.totalCaloriesBurned} cal
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Daily Calendar Grid */}
                                                    <Box mb={2}>
                                                        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} mb={1}>
                                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                                                <Box key={day} textAlign="center" py={0.5}>
                                                                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                                                                        {day}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5}>
                                                            {month.dailyBreakdown.map(day => {
                                                                const styles = getWorkoutIntensityStyles(day.workouts)
                                                                return (
                                                                    <Box
                                                                        key={day.date}
                                                                        sx={{
                                                                            ...styles,
                                                                            aspectRatio: '1',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            borderRadius: 1,
                                                                            cursor: 'pointer',
                                                                            transition: 'transform 0.2s',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.05)',
                                                                            }
                                                                        }}
                                                                        title={`${day.date}: ${day.workouts} workouts, ${day.caloriesBurned} cal`}
                                                                    >
                                                                        <Typography variant="caption" fontWeight="medium">
                                                                            {new Date(day.date).getDate()}
                                                                        </Typography>
                                                                        {day.workouts > 0 && (
                                                                            <Typography variant="caption" fontWeight="bold" fontSize="0.65rem">
                                                                                {day.workouts}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                )
                                                            })}
                                                        </Box>
                                                    </Box>

                                                    {/* Weekly Summary */}
                                                    <Box>
                                                        {month.weeks.slice(0, 4).map(week => (
                                                            <Box key={week.week} display="flex" justifyContent="space-between" py={0.25}>
                                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                                    {week.week}
                                                                </Typography>
                                                                <Typography variant="caption" fontWeight="medium">
                                                                    {week.workouts}w
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>

                            {statistics.totalWorkouts === 0 && (
                                <Card>
                                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No workouts found in your history
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutStatisticsPage
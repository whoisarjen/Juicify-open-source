import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
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
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

const WorkoutStatisticsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('workout')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

    const username = router.query.login || ''
    const isOwner = sessionData?.user?.username == username

    const { data: allStatistics, isFetching } = trpc.workoutResult.getStatistics.useQuery(
        { username },
        { enabled: !!username }
    )

    // Filter data for selected year
    const statistics = allStatistics ? {
        ...allStatistics,
        months: allStatistics.months.filter(month => month.year === parseInt(selectedYear)),
        totalWorkouts: allStatistics.months
            .filter(month => month.year === parseInt(selectedYear))
            .reduce((sum, month) => sum + month.totalWorkouts, 0),
        totalCaloriesBurned: allStatistics.months
            .filter(month => month.year === parseInt(selectedYear))
            .reduce((sum, month) => sum + month.totalCaloriesBurned, 0),
    } : null

    // Get available years from data
    const availableYears = allStatistics 
        ? Array.from(new Set(allStatistics.months.map(month => month.year.toString())))
            .sort((a, b) => parseInt(b) - parseInt(a))
        : []

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
                <NavbarOnlyTitle title="home:WORKOUT_STATISTICS" />
            ) : (
                <NavbarProfile tab={2} />
            )}

            <BoxWorkoutLoader isLoading={isFetching}>
                <>
                    {allStatistics && availableYears.length > 0 && (
                        <>
                            {/* Year Selector Tabs */}
                            <TabContext value={selectedYear}>
                                <Box sx={{ width: '100%' }}>
                                    <TabList
                                        onChange={(_, newValue: string) => setSelectedYear(newValue)}
                                        value={selectedYear}
                                        indicatorColor="primary"
                                        textColor="inherit"
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        sx={{ marginBottom: '16px' }}
                                    >
                                        {availableYears.map(year => (
                                            <Tab label={year} value={year} key={year} />
                                        ))}
                                    </TabList>
                                </Box>

                                {availableYears.map(year => (
                                    <TabPanel key={year} value={year} sx={{ padding: '0 !important' }}>
                                        {/* Year Overview Stats */}
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Card>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Typography variant="overline" color="text.secondary" display="block">
                                                            {t('TOTAL_WORKOUTS')}
                                                        </Typography>
                                                        <Box display="flex" alignItems="baseline">
                                                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                                                {statistics?.totalWorkouts || 0}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                                in {year}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                <Card>
                                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                        <Typography variant="overline" color="text.secondary" display="block">
                                                            {t('CALORIES_BURNED')}
                                                        </Typography>
                                                        <Box display="flex" alignItems="baseline">
                                                            <Typography variant="h5" color="error.main" fontWeight="bold">
                                                                {(statistics?.totalCaloriesBurned || 0).toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                                cal
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* Monthly Breakdown for Selected Year */}
                                        {statistics && statistics.months.length > 0 ? (
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                                        {t('MONTHLY_BREAKDOWN')} {year}
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        {statistics.months
                                                            .sort((a, b) => b.month.localeCompare(a.month))
                                                            .map((month) => (
                                                            <Grid item xs={12} sm={6} key={month.month}>
                                                                <Box border={1} borderColor="divider" borderRadius={2} p={2}>
                                                                    {/* Month Header */}
                                                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                                            {month.monthName}
                                                                        </Typography>
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
                                                                    <Box mb={1}>
                                                                        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} mb={0.5}>
                                                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                                                                <Box key={day} textAlign="center" py={0.25}>
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
                                                                                            minHeight: '28px',
                                                                                            '&:hover': {
                                                                                                transform: 'scale(1.05)',
                                                                                            }
                                                                                        }}
                                                                                        title={`${day.date}: ${day.workouts} workouts, ${day.caloriesBurned} cal`}
                                                                                    >
                                                                                        <Typography variant="caption" fontWeight="medium" sx={{ fontSize: '0.7rem' }}>
                                                                                            {new Date(day.date).getDate()}
                                                                                        </Typography>
                                                                                        {day.workouts > 0 && (
                                                                                            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.6rem' }}>
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
                                                                        {month.weeks.slice(0, 5).map(week => (
                                                                            <Box key={week.week} display="flex" justifyContent="space-between" py={0.1}>
                                                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                                                                                    {week.week}
                                                                                </Typography>
                                                                                <Typography variant="caption" fontWeight="medium" sx={{ fontSize: '0.7rem' }}>
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
                                        ) : (
                                            <Card>
                                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {t('NO_WORKOUTS_FOUND')} {year}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabPanel>
                                ))}
                            </TabContext>
                        </>
                    )}

                    {allStatistics && availableYears.length === 0 && (
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                <Typography variant="body1" color="text.secondary">
                                    {t('NO_WORKOUTS_FOUND_HISTORY')}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutStatisticsPage
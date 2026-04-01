import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { trpc } from '@/utils/trpc.utils'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import { BoxWorkoutLoader } from '@/containers/Workout/BoxWorkoutLoader'

const WorkoutStatisticsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('home')
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
                            <div>
                                <div className="mb-4 flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                                    {availableYears.map(year => (
                                        <button
                                            key={year}
                                            className={`shrink-0 px-4 py-2 text-sm font-medium ${
                                                selectedYear === year
                                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                                    : 'text-gray-500'
                                            }`}
                                            onClick={() => setSelectedYear(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                {availableYears.filter(year => year === selectedYear).map(year => (
                                    <div key={year} className="p-0">
                                        {/* Year Overview Stats */}
                                        <div className="mb-4 grid grid-cols-2 gap-4">
                                            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                                <span className="text-xs uppercase tracking-wide text-gray-500">
                                                    {t('TOTAL_WORKOUTS')}
                                                </span>
                                                <div className="flex items-baseline">
                                                    <span className="text-xl font-bold text-blue-500">
                                                        {statistics?.totalWorkouts || 0}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        in {year}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                                <span className="text-xs uppercase tracking-wide text-gray-500">
                                                    {t('CALORIES_BURNED')}
                                                </span>
                                                <div className="flex items-baseline">
                                                    <span className="text-xl font-bold text-red-500">
                                                        {(statistics?.totalCaloriesBurned || 0).toLocaleString()}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        cal
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Breakdown for Selected Year */}
                                        {statistics && statistics.months.length > 0 ? (
                                            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                                                <h3 className="mb-4 text-lg font-semibold">
                                                    {t('MONTHLY_BREAKDOWN')} {year}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {statistics.months
                                                        .sort((a, b) => b.month.localeCompare(a.month))
                                                        .map((month) => (
                                                        <div key={month.month} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                                            {/* Month Header */}
                                                            <div className="mb-4 flex items-center justify-between">
                                                                <span className="text-base font-medium">
                                                                    {month.monthName}
                                                                </span>
                                                                <div className="text-right">
                                                                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${month.totalWorkouts > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                                        {month.totalWorkouts} {t('WORKOUTS')}
                                                                    </span>
                                                                    <span className="mt-1 block text-xs text-gray-500">
                                                                        {month.totalCaloriesBurned} cal
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Daily Calendar Grid */}
                                                            <div className="mb-2">
                                                                <div className="mb-1 grid grid-cols-7 gap-0.5">
                                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                                                        <div key={day} className="py-0.5 text-center text-xs font-medium text-gray-500">
                                                                            {day}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="grid grid-cols-7 gap-0.5">
                                                                    {month.dailyBreakdown.map(day => {
                                                                        const styles = getWorkoutIntensityStyles(day.workouts)
                                                                        return (
                                                                            <div
                                                                                key={day.date}
                                                                                style={styles}
                                                                                className="flex aspect-square min-h-[28px] cursor-pointer flex-col items-center justify-center rounded transition-transform hover:scale-105"
                                                                                title={`${day.date}: ${day.workouts} workouts, ${day.caloriesBurned} cal`}
                                                                            >
                                                                                <span className="text-[0.7rem] font-medium">
                                                                                    {new Date(day.date).getDate()}
                                                                                </span>
                                                                                {day.workouts > 0 && (
                                                                                    <span className="text-[0.6rem] font-bold">
                                                                                        {day.workouts}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                            {/* Weekly Summary */}
                                                            <div>
                                                                {month.weeks.slice(0, 5).map(week => (
                                                                    <div key={week.week} className="flex justify-between py-px">
                                                                        <span className="truncate text-[0.7rem] text-gray-500">
                                                                            {week.week}
                                                                        </span>
                                                                        <span className="text-[0.7rem] font-medium">
                                                                            {week.workouts}w
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg bg-white py-8 text-center shadow dark:bg-gray-800">
                                                <p className="text-gray-500">
                                                    {t('NO_WORKOUTS_FOUND')} {year}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {allStatistics && availableYears.length === 0 && (
                        <div className="rounded-lg bg-white py-12 text-center shadow dark:bg-gray-800">
                            <p className="text-gray-500">
                                {t('NO_WORKOUTS_FOUND_HISTORY')}
                            </p>
                        </div>
                    )}
                </>
            </BoxWorkoutLoader>
        </div>
    )
}

export default WorkoutStatisticsPage

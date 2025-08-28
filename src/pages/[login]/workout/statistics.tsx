import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { trpc } from '@/utils/trpc.utils'
import NavbarProfile from '@/containers/profile/NavbarProfile/NavbarProfile'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const WorkoutStatisticsPage = () => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()
    const { t } = useTranslation('workout')

    const username = router.query.login || ''
    const isOwner = sessionData?.user?.username == username

    const { data: statistics, isFetching } = trpc.workoutResult.getStatistics.useQuery(
        { username },
        { enabled: !!username }
    )

    const getWorkoutIntensityColor = (count: number) => {
        if (count === 0) return 'bg-gray-50 border-gray-200'
        if (count === 1) return 'bg-blue-100 border-blue-300'
        if (count === 2) return 'bg-blue-200 border-blue-400'
        if (count === 3) return 'bg-blue-300 border-blue-500'
        return 'bg-blue-500 border-blue-600'
    }

    const getTextColor = (count: number) => {
        if (count === 0) return 'text-gray-400'
        if (count <= 2) return 'text-gray-800'
        return 'text-white'
    }

    return (
        <div className="flex flex-1 flex-col gap-4 pb-16 md:pb-4">
            {isOwner ? (
                <NavbarOnlyTitle title="workout:WORKOUT_STATISTICS" />
            ) : (
                <NavbarProfile tab={2} />
            )}

            {!isFetching && statistics ? (
                <>
                    {/* Date Range Header */}
                    {statistics.dateRange.earliest && statistics.dateRange.latest && (
                        <div className="bg-white p-4 rounded-lg shadow mb-4">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900">Complete Workout History</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {statistics.dateRange.earliest} to {statistics.dateRange.latest}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {statistics.months.length} active months
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t('TOTAL_WORKOUTS')}</h3>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-xl md:text-2xl font-semibold text-primary-600">{statistics.totalWorkouts}</p>
                                <p className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500">total</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t('CALORIES_BURNED')}</h3>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-xl md:text-2xl font-semibold text-red-600">{statistics.totalCaloriesBurned.toLocaleString()}</p>
                                <p className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500">cal</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t('WEEKLY_AVERAGE')}</h3>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-xl md:text-2xl font-semibold text-green-600">{statistics.averageWorkoutsPerWeek}</p>
                                <p className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500">/week</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t('MONTHLY_AVERAGE')}</h3>
                            <div className="mt-2 flex items-baseline">
                                <p className="text-xl md:text-2xl font-semibold text-blue-600">{statistics.averageWorkoutsPerMonth}</p>
                                <p className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500">/month</p>
                            </div>
                        </div>
                    </div>

                    {/* Year Comparison */}
                    {Object.keys(statistics.yearlyComparison).length > 1 && (
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('YEAR_COMPARISON')}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                                {Object.entries(statistics.yearlyComparison)
                                    .sort(([a], [b]) => Number(b) - Number(a))
                                    .map(([year, count]) => (
                                        <div key={year} className="text-center p-3 border rounded-lg">
                                            <p className="text-xl md:text-2xl font-bold text-primary-600">{count as number}</p>
                                            <p className="text-sm text-gray-600">{year}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Monthly Grid */}
                    <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('MONTHLY_BREAKDOWN')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                            {statistics.months.map((month) => (
                                <div key={month.month} className="border rounded-lg p-3 md:p-4">
                                    {/* Month Header */}
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm md:text-base">{month.monthName}</h4>
                                            <p className="text-xs text-gray-500">{month.year}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-primary-600">{month.totalWorkouts} {t('WORKOUTS')}</p>
                                            <p className="text-xs text-gray-500">{month.totalCaloriesBurned} cal</p>
                                        </div>
                                    </div>

                                    {/* Daily Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                            <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
                                                {day}
                                            </div>
                                        ))}
                                        {month.dailyBreakdown.map(day => {
                                            const dayOfWeek = new Date(day.date).getDay()
                                            const isEmpty = day.workouts === 0
                                            return (
                                                <div
                                                    key={day.date}
                                                    className={`
                                                        aspect-square text-xs rounded-sm flex flex-col items-center justify-center
                                                        ${getWorkoutIntensityColor(day.workouts)}
                                                        ${getTextColor(day.workouts)}
                                                        border transition-all hover:scale-105 cursor-pointer
                                                        min-h-[28px] sm:min-h-[32px]
                                                    `}
                                                    title={`${day.date}: ${day.workouts} workouts, ${day.caloriesBurned} cal`}
                                                >
                                                    <span className="font-medium">{new Date(day.date).getDate()}</span>
                                                    {day.workouts > 0 && (
                                                        <span className="text-xs font-bold">{day.workouts}</span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Weekly Summary */}
                                    <div className="space-y-1">
                                        {month.weeks.slice(0, 4).map(week => (
                                            <div key={week.week} className="flex justify-between text-xs">
                                                <span className="text-gray-500 truncate">{week.week}</span>
                                                <span className="font-medium ml-1">{week.workouts}w</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {statistics.totalWorkouts === 0 && (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <p className="text-gray-500">No workouts found in your history</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500">{t('LOADING_STATISTICS')}</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full animate-pulse w-1/2"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WorkoutStatisticsPage
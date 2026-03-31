import { prisma } from '../db/client'
import { env } from '../../env/server.mjs'

const WITHINGS_TOKEN_URL = 'https://wbsapi.withings.net/v2/oauth2'
const WITHINGS_MEASURE_URL = 'https://wbsapi.withings.net/measure'
const WITHINGS_ACTIVITY_URL = 'https://wbsapi.withings.net/v2/measure'
const WITHINGS_SLEEP_URL = 'https://wbsapi.withings.net/v2/sleep'
const WITHINGS_WORKOUT_URL = 'https://wbsapi.withings.net/v2/measure'

interface WithingsTokenBody {
    userid: string
    access_token: string
    refresh_token: string
    expires_in: number
    scope: string
    token_type: string
}

export interface WithingsMeasureGroup {
    grpid: number
    date: number
    measures: Array<{
        value: number
        type: number
        unit: number
    }>
}

export interface WithingsActivity {
    date: string
    steps: number
    calories: number
    totalcalories: number
    distance: number
    elevation: number
    soft: number
    moderate: number
    intense: number
    hr_average: number
    hr_min: number
    hr_max: number
    hr_zone_0: number
    hr_zone_1: number
    hr_zone_2: number
    hr_zone_3: number
}

export interface WithingsWorkout {
    category: number
    startdate: number
    enddate: number
    data: {
        calories?: number
        intensity?: number
        steps?: number
        distance?: number
        elevation?: number
        hr_average?: number
        hr_min?: number
        hr_max?: number
        hr_zone_0?: number
        hr_zone_1?: number
        hr_zone_2?: number
        hr_zone_3?: number
        pause_duration?: number
        spo2_average?: number
        pool_laps?: number
        pool_length?: number
        strokes?: number
    }
}

export const WORKOUT_CATEGORY_MAP: Record<number, string> = {
    1: 'Walk',
    2: 'Run',
    3: 'Hiking',
    4: 'Skating',
    5: 'BMX',
    6: 'Bicycling',
    7: 'Swimming',
    8: 'Surfing',
    9: 'Kitesurfing',
    10: 'Windsurfing',
    11: 'Bodyboard',
    12: 'Tennis',
    13: 'Table Tennis',
    14: 'Squash',
    15: 'Badminton',
    16: 'Weights',
    17: 'Calisthenics',
    18: 'Elliptical',
    19: 'Pilates',
    20: 'Basketball',
    21: 'Soccer',
    22: 'Football',
    23: 'Rugby',
    24: 'Volleyball',
    25: 'Waterpolo',
    26: 'Horse Riding',
    27: 'Golf',
    28: 'Yoga',
    29: 'Dancing',
    30: 'Boxing',
    31: 'Fencing',
    32: 'Wrestling',
    33: 'Martial Arts',
    34: 'Skiing',
    35: 'Snowboarding',
    36: 'Other',
    37: 'No Activity',
    38: 'Rowing',
    188: 'Multi-Sport',
    191: 'Indoor Run',
    192: 'Indoor Cycling',
    193: 'Outdoor Run',
    194: 'Outdoor Cycling',
    272: 'HIIT',
    307: 'Indoor Walking',
    308: 'Strength Training',
}

export interface WithingsSleepSummary {
    date: string
    startdate: number
    enddate: number
    wakeupduration: number
    lightsleepduration: number
    deepsleepduration: number
    remsleepduration: number
    wakeupcount: number
    durationtosleep: number
    durationtowakeup: number
    hr_average: number
    hr_min: number
    hr_max: number
    rr_average: number
    rr_min: number
    rr_max: number
    breathing_disturbances_intensity: number
    snoring: number
    snoringepisodecount: number
    sleep_score: number
    total_sleep_time: number
    total_timeinbed: number
    sleep_efficiency: number
    sleep_latency: number
    waso: number
    out_of_bed_count: number
    nb_rem_episodes: number
}

export function parseWithingsValue(value: number, unit: number): number {
    return value * Math.pow(10, unit)
}

export const MEASTYPE_MAP: Record<number, string> = {
    1: 'weight',
    5: 'fatFreeMass',
    6: 'fatRatio',
    8: 'fatMass',
    9: 'diastolicBp',
    10: 'systolicBp',
    11: 'heartPulse',
    12: 'temperature',
    54: 'spo2',
    71: 'bodyTemperature',
    73: 'skinTemperature',
    76: 'muscleMass',
    77: 'waterMass',
    88: 'boneMass',
    91: 'pulseWaveVelocity',
    123: 'vo2Max',
}

export async function exchangeCodeForTokens(
    code: string,
    redirectUri: string,
): Promise<WithingsTokenBody> {
    const body = new URLSearchParams({
        action: 'requesttoken',
        grant_type: 'authorization_code',
        client_id: env.WITHINGS_CLIENT_ID!,
        client_secret: env.WITHINGS_CLIENT_SECRET!,
        code,
        redirect_uri: redirectUri,
    })

    const res = await fetch(WITHINGS_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(`Withings token exchange failed: status ${data.status}`)
    }

    return data.body as WithingsTokenBody
}

async function refreshAccessToken(account: {
    id: number
    refresh_token: string | null
    userId: number
}): Promise<string> {
    if (!account.refresh_token) {
        throw new Error('No refresh token available for Withings account')
    }

    const body = new URLSearchParams({
        action: 'requesttoken',
        grant_type: 'refresh_token',
        client_id: env.WITHINGS_CLIENT_ID!,
        client_secret: env.WITHINGS_CLIENT_SECRET!,
        refresh_token: account.refresh_token,
    })

    const res = await fetch(WITHINGS_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(
            `Withings token refresh failed: status ${data.status}`,
        )
    }

    const tokens = data.body as WithingsTokenBody

    await prisma.account.update({
        where: { id: account.id },
        data: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        },
    })

    return tokens.access_token
}

export async function getValidAccessToken(userId: number): Promise<string> {
    const account = await prisma.account.findFirst({
        where: { userId, provider: 'withings' },
    })

    if (!account) {
        throw new Error(`No Withings account found for user ${userId}`)
    }

    const now = Math.floor(Date.now() / 1000)
    if (account.expires_at && account.expires_at > now && account.access_token) {
        return account.access_token
    }

    return refreshAccessToken(account)
}

export async function getMeasurements(
    accessToken: string,
    startDate: number,
    endDate: number,
): Promise<WithingsMeasureGroup[]> {
    const body = new URLSearchParams({
        action: 'getmeas',
        category: '1',
        startdate: startDate.toString(),
        enddate: endDate.toString(),
    })

    const res = await fetch(WITHINGS_MEASURE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
        },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(`Withings getmeas failed: status ${data.status}`)
    }

    return (data.body?.measuregrps ?? []) as WithingsMeasureGroup[]
}

export async function getActivity(
    accessToken: string,
    startDateYmd: string,
    endDateYmd: string,
): Promise<WithingsActivity[]> {
    const body = new URLSearchParams({
        action: 'getactivity',
        startdateymd: startDateYmd,
        enddateymd: endDateYmd,
    })

    const res = await fetch(WITHINGS_ACTIVITY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
        },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(`Withings getactivity failed: status ${data.status}`)
    }

    return (data.body?.activities ?? []) as WithingsActivity[]
}

export async function getSleep(
    accessToken: string,
    startDateYmd: string,
    endDateYmd: string,
): Promise<WithingsSleepSummary[]> {
    const body = new URLSearchParams({
        action: 'getsummary',
        startdateymd: startDateYmd,
        enddateymd: endDateYmd,
    })

    const res = await fetch(WITHINGS_SLEEP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
        },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(`Withings getsleep failed: status ${data.status}`)
    }

    return (data.body?.series ?? []) as WithingsSleepSummary[]
}

export async function getWorkouts(
    accessToken: string,
    startDateYmd: string,
    endDateYmd: string,
): Promise<WithingsWorkout[]> {
    const body = new URLSearchParams({
        action: 'getworkouts',
        startdateymd: startDateYmd,
        enddateymd: endDateYmd,
    })

    const res = await fetch(WITHINGS_WORKOUT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
        },
        body,
    })

    const data = await res.json()
    if (data.status !== 0) {
        throw new Error(`Withings getworkouts failed: status ${data.status}`)
    }

    return (data.body?.series ?? []) as WithingsWorkout[]
}

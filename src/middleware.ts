import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({ req }) {
            return !!req.cookies.get('next-auth.session-token')
        },
    },
})

export const config = {
    matcher: [
        '/workout',
        '/statistics',
        '/barcode',
        '/coach',
        '/macronutrients',
        '/measurements',
        '/settings',
    ],
}

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html className="dark">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="description" content="Free AI-powered calorie counter and personal trainer. Track calories, plan workouts, and reach your fitness goals — no ads, no subscriptions." />
                    <meta name="theme-color" content="#121212" />
                    <link rel="alternate" hrefLang="en" href="https://juicify.app" />
                    <link rel="alternate" hrefLang="pl" href="https://juicify.app/pl" />
                    <link rel="alternate" hrefLang="x-default" href="https://juicify.app" />
                    <link rel="preconnect" href="https://www.googletagmanager.com" />
                    <link
                        rel="preload"
                        href="/fonts/quicksand/quicksand-v24-latin-ext-regular.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin=""
                    />
                    <link
                        rel="preload"
                        href="/fonts/quicksand/quicksand-v24-latin-ext-700.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin=""
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
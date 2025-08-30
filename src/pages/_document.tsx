import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
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
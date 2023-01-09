import { useEffect } from "react";

const ServiceWorker = ({ children }: { children: any }) => {
    const isServerSide = typeof window === 'undefined';

    useEffect(() => {
        if (!isServerSide && process.env.isProduction) {
            if (localStorage.getItem('version') !== process.env.APP_VERSION) {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function (registrations) {
                        for (let registration of registrations) {
                            registration.unregister()
                                .then(() => {
                                    localStorage.setItem('version', process.env.APP_VERSION || new Date().toISOString())
                                })
                                .finally(() => {
                                    window.location.reload()
                                })
                        }
                    }).catch(function (err) {
                        console.log('Service Worker registration failed: ', err);
                    });
                }
            }
        }
    }, [isServerSide])

    return children
}

export default ServiceWorker
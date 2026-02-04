import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every
 * web page during static rendering.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* 
          Disable body scrolling on web. This makes ScrollView components work as expected. 
        */}
                <ScrollViewStyleReset />

                {/* Add reCAPTCHA Enterprise script */}
                <script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY}`}></script>

                {/* Add any additional <head> elements here */}
            </head>
            <body>{children}</body>
        </html>
    );
}

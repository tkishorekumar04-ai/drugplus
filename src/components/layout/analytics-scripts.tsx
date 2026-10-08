"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { captureAttribution, track } from "@/lib/analytics";
import { CONSENT_EVENT, readConsent } from "./cookie-banner";

const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Loads third-party analytics only after the visitor accepts analytics cookies, and reports
 * SPA page views on client-side navigation. Attribution (UTM) capture is first-party and always on.
 */
export function AnalyticsScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(readConsent() === "all");
    const onConsent = () => setConsent(readConsent() === "all");
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    captureAttribution();
    track("page_view", { page_path: pathname, page_title: document.title });
  }, [pathname, searchParams]);

  if (!consent) return null;
  const gtagId = GA4 || ADS;

  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${GA4 ? `gtag('config','${GA4}',{send_page_view:false});` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}
          </Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
      {CLARITY && (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`}
        </Script>
      )}
    </>
  );
}

import Link from "next/link";
import Image from "next/image";

interface DownloadButtonsProps {
  variant?: "hero" | "cta" | "footer" | "default";
}

export default function DownloadButtons({ variant = "default" }: DownloadButtonsProps) {
  let containerClass = "download-buttons";
  let playClass = "btn btn-primary";
  let appClass = "btn";
  let playStyle = {};
  let appStyle = {};

  if (variant === "hero") {
    containerClass = "hero__actions";
    playClass = "btn btn-primary hero__play-btn";
    appClass = "btn hero__app-btn";
  } else if (variant === "cta") {
    containerClass = "cta-section__actions";
    playClass = "btn btn-white";
    appClass = "btn btn-ghost-white";
  } else if (variant === "footer") {
    containerClass = "footer__apps";
    playClass = "footer__app-btn footer__app-btn--dark";
    appClass = "footer__app-btn footer__app-btn--outline";
  } else if (variant === "default") {
    containerClass = "download-buttons-default";
    playClass = "btn btn-primary";
    appClass = "btn";
    playStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', color: '#fff', padding: '12px 24px', borderRadius: '12px' };
    appStyle = { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', padding: '12px 24px', borderRadius: '12px' };
  }

  return (
    <div className={containerClass} style={variant === "default" ? { display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' } : {}}>
      <Link
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Drifully on Google Play"
        className={playClass}
        style={playStyle}
      >
        <span>Get it on Google Play</span>
        <Image src="/icons/google-play.svg" alt="" width={18} height={18} />
      </Link>

      <Link
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Drifully on the App Store"
        className={appClass}
        style={appStyle}
      >
        <span>Download on App Store</span>
        <Image src="/icons/apple.svg" alt="" width={18} height={18} />
      </Link>
    </div>
  );
}

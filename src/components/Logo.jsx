import { Link } from "react-router-dom";

export default function Logo({ tone = "dark", compact = false }) {
  return (
    <Link to="/" className={`logo logo--${tone}`} aria-label="ShopBondhu home">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="none">
          <path
            d="M9.5 14.5h25l-1.9 19.1a4.6 4.6 0 0 1-4.6 4.1H16a4.6 4.6 0 0 1-4.6-4.1L9.5 14.5Z"
            fill="currentColor"
          />
          <path
            d="M16.5 16V12.8a5.5 5.5 0 0 1 11 0V16"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="18.4" cy="25" r="1.7" fill="#F6B44A" />
          <circle cx="25.6" cy="25" r="1.7" fill="#F6B44A" />
          <path
            d="M18.2 30c1.9 1.5 5.7 1.5 7.6 0"
            stroke="#F6B44A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="logo__word">
          Shop<span>Bondhu</span>
        </span>
      )}
    </Link>
  );
}

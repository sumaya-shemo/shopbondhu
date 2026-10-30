import { discountPercent, formatBDT } from "../lib/format";

export default function Price({ price, compareAt, size = "md", showSave = false }) {
  const off = discountPercent(price, compareAt);
  return (
    <span className={`price price--${size}`}>
      <span className="price__now">{formatBDT(price)}</span>
      {compareAt && compareAt > price && (
        <>
          <s className="price__was">{formatBDT(compareAt)}</s>
          {showSave && <span className="price__save">Save {off}%</span>}
        </>
      )}
    </span>
  );
}

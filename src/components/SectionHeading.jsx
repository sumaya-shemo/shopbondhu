import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ eyebrow, title, copy, link, linkLabel = "View all" }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

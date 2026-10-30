import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    setEmail("");
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__panel">
          <div className="newsletter__copy">
            <span className="eyebrow eyebrow--light">The Bondhu letter</span>
            <h2>A little inbox joy, once a week.</h2>
            <p>
              New finds, honest recommendations and early access to deals. Join 12,000+ shoppers — and
              get <strong>10% off</strong> your first order.
            </p>
            {done ? (
              <div className="newsletter__done" role="status">
                <span>
                  <Check size={18} />
                </span>
                <div>
                  <strong>You're on the list!</strong>
                  <p>Check your inbox for your 10% welcome code.</p>
                </div>
              </div>
            ) : (
              <>
                <form className="newsletter__form" onSubmit={submit} noValidate>
                  <Mail size={18} aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    aria-invalid={Boolean(error)}
                  />
                  <button className="btn btn--accent" type="submit">
                    Subscribe <ArrowRight size={16} />
                  </button>
                </form>
                {error && (
                  <p className="form-error form-error--light" role="alert">
                    {error}
                  </p>
                )}
                <p className="newsletter__fine">No spam, ever. Unsubscribe in one click.</p>
              </>
            )}
          </div>
          <div className="newsletter__art" aria-hidden="true">
            <span className="newsletter__blob newsletter__blob--one" />
            <span className="newsletter__blob newsletter__blob--two" />
            <div className="newsletter__card">
              <span>WELCOME GIFT</span>
              <strong>10% OFF</strong>
              <small>your first ShopBondhu order</small>
              <span className="newsletter__code">BONDHU10</span>
            </div>
            <span className="newsletter__spark">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}

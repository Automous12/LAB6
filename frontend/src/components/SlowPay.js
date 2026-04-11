import React, { useState } from "react";

const PREFILL = {
  name:    "Demo User",
  email:   "demo@slowpay.com",
  phone:   "9999900000",
  address: "123 Demo Street, Mumbai — 400001",
  cardNum: "4242 4242 4242 4242",
  expiry:  "12/26",
  cvv:     "123",
};

function SlowPay({ total, onSuccess, onCancel, onOrderCreated }) {
  const [step, setStep] = useState("details"); // details | processing | result
  const [succeeded, setSucceeded] = useState(false);
  const [form, setForm] = useState({ ...PREFILL });

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const handlePay = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2200));      // fake network delay

    const ok = Math.random() > 0.2;                    // 80% success
    if (ok) {
      try {
        await onOrderCreated({
          name:    form.name,
          email:   form.email,
          address: form.address,
          phone:   form.phone,
        });
        setSucceeded(true);
      } catch {
        setSucceeded(false);
      }
    } else {
      setSucceeded(false);
    }
    setStep("result");
  };

  const inr = `₹${(total * 83).toFixed(0)}`;

  /* ── Processing ── */
  if (step === "processing") return (
    <div className="sp-overlay">
      <div className="sp-modal">
        <SlowPayHeader amount={inr} />
        <div className="sp-center">
          <div className="sp-spinner" />
          <h3>Processing Payment</h3>
          <p>Please wait, do not close this window…</p>
          <div className="sp-big-amount">{inr}</div>
        </div>
        <SlowPayFooter />
      </div>
    </div>
  );

  /* ── Result ── */
  if (step === "result") return (
    <div className="sp-overlay">
      <div className="sp-modal">
        <SlowPayHeader amount={inr} />
        <div className="sp-center">
          {succeeded ? (
            <>
              <div className="sp-circle sp-circle-ok">✓</div>
              <h3>Payment Successful!</h3>
              <p>{inr} paid via SlowPay</p>
            </>
          ) : (
            <>
              <div className="sp-circle sp-circle-err">✕</div>
              <h3>Payment Declined</h3>
              <p>Your card was not accepted. Please try again.</p>
            </>
          )}
        </div>
        {succeeded ? (
          <div className="sp-actions">
            <button className="btn btn-primary btn-lg sp-btn" onClick={onSuccess}>
              Continue →
            </button>
          </div>
        ) : (
          <div className="sp-actions">
            <button className="btn btn-primary btn-lg sp-btn" onClick={() => setStep("details")}>
              Try Again
            </button>
            <button className="btn btn-outline sp-btn" onClick={onCancel}>Cancel</button>
          </div>
        )}
        <SlowPayFooter />
      </div>
    </div>
  );

  /* ── Details form ── */
  return (
    <div className="sp-overlay">
      <div className="sp-modal sp-scrollable">
        <SlowPayHeader amount={inr} />

        <div className="sp-body">
          <p className="sp-section">Shipping Details</p>
          <Field label="Full Name"         {...field("name")}    placeholder="Full Name" />
          <Field label="Email"             {...field("email")}   placeholder="Email" type="email" />
          <Field label="Phone"             {...field("phone")}   placeholder="Phone" />
          <Field label="Delivery Address"  {...field("address")} placeholder="Address" />

          <p className="sp-section" style={{ marginTop: 20 }}>Card Details</p>
          <Field label="Card Number"  {...field("cardNum")} placeholder="Card Number" />
          <div className="sp-row">
            <Field label="Expiry" {...field("expiry")} placeholder="MM/YY" />
            <Field label="CVV"    {...field("cvv")}    placeholder="CVV" />
          </div>
          <Field label="Name on Card" value={form.name} readOnly placeholder="Name on Card" />
        </div>

        <div className="sp-actions">
          <button className="btn btn-primary btn-lg sp-btn" onClick={handlePay}>
            Pay {inr}
          </button>
          <button className="btn btn-outline sp-btn" onClick={onCancel}>Cancel</button>
        </div>
        <SlowPayFooter />
      </div>
    </div>
  );
}

/* sub-components */
const SlowPayHeader = ({ amount }) => (
  <div className="sp-header">
    <span className="sp-logo">SlowPay</span>
    <span className="sp-amount">{amount}</span>
  </div>
);

const SlowPayFooter = () => (
  <div className="sp-footer">🔒 Powered by SlowPay</div>
);

const Field = ({ label, ...props }) => (
  <div className="sp-field">
    <label>{label}</label>
    <input {...props} />
  </div>
);

export default SlowPay;
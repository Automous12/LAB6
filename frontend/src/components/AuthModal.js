import React, { useState, useRef } from "react";
import { sendOtp, verifyOtp } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AuthModal({ onClose, onSuccess, message }) {
  const [step,    setStep]    = useState("phone");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const { login } = useAuth();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await sendOtp(phone);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await verifyOtp(phone, otp.join(""));
      login(res.data.user, res.data.token);
      onSuccess?.(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const handleOtpInput = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-icon">🔐</div>
        <h2 className="modal-title">
          {step === "phone" ? "Login / Sign Up" : "Verify OTP"}
        </h2>
        <p className="modal-sub">
          {message
            ? message
            : step === "phone"
            ? "Enter your phone number to continue"
            : `Enter the OTP sent to +91 ${phone}`}
        </p>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp}>
            <div className="modal-input-wrap">
              <span className="modal-prefix">+91</span>
              <input
                className="modal-input"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
            {error && <div className="modal-error">{error}</div>}
            <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 16 }} disabled={loading || phone.length < 10}>
              {loading ? "Sending…" : "Send OTP →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="modal-hint">Hint: use <strong>0000</strong> for this demo</p>
            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  className="otp-box"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <div className="modal-error">{error}</div>}
            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 16 }}
              disabled={loading || otp.join("").length < 4}
            >
              {loading ? "Verifying…" : "Verify & Login"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => { setStep("phone"); setOtp(["","","",""]); setError(""); }}
            >
              ← Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
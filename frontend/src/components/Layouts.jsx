import React from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: C.paper,
        borderBottom: `3px solid ${C.ink}`,
      }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}>
        <button
          className="sg"
          onClick={() => navigate('/landing')}
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-.03em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: C.ink,
          }}>
          Chato
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/login')}
            className="sg"
            style={{
              fontSize: 14,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.ink,
            }}>
            Sign In
          </button>
          <Btn
            sz="sm"
            onClick={() => navigate('/signup')}>
            Get Started →
          </Btn>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        background: C.ink,
        borderTop: `3px solid ${C.ink}`,
        padding: '40px 40px',
      }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
        <span
          className="sg"
          style={{ fontSize: 20, fontWeight: 800, color: C.paper }}>
          Chato
        </span>
        <span
          className="dm"
          style={{ fontSize: 12, color: '#666' }}>
          © 2026 Chato. Fun conversations worldwide.
        </span>
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(
            (t) => (
              <a
                key={t}
                href="#"
                className="dm"
                style={{ fontSize: 12, color: '#666' }}
                onMouseOver={(e) => (e.target.style.color = C.yellow)}
                onMouseOut={(e) => (e.target.style.color = '#666')}>
                {t}
              </a>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}

export function AuthHeader({ altText, altAction, altLabel }) {
  const navigate = useNavigate();
  return (
    <header style={{ borderBottom: `2px solid ${C.ink}`, padding: '0 40px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 54,
        }}>
        <Link
          to="/"
          className="sg"
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-.03em',
            textDecoration: 'none',
            color: C.ink,
          }}>
          Chato
        </Link>{' '}
        <div
          className="dm"
          style={{ fontSize: 13, color: '#555' }}>
          {altText}{' '}
          <button
            onClick={() => navigate(altAction)}
            style={{
              color: C.blue,
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'DM Mono',
              fontSize: 13,
            }}>
            {altLabel}
          </button>
        </div>
      </div>
    </header>
  );
}

export function AuthFooter() {
  return (
    <footer style={{ borderTop: `2px solid ${C.gray}`, padding: '20px 40px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
        <span
          className="sg"
          style={{ fontSize: 16, fontWeight: 700 }}>
          Chato
        </span>
        <span
          className="dm"
          style={{ fontSize: 11, color: '#999' }}>
          © 2026 Chato. Connect and chat.
        </span>
        <nav style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Support'].map((t) => (
            <a
              key={t}
              href="#"
              className="dm"
              style={{ fontSize: 11, color: '#999' }}>
              {t}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

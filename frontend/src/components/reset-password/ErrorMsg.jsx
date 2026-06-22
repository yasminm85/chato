export const ErrorMsg = ({ error, msg }) => (
  <>
    {error && <div style={{ color: 'red', fontSize: 13, background: '#ffe6e6', padding: 10, borderRadius: 4, marginBottom: 16 }}>{error}</div>}
    {msg && <div style={{ color: 'green', fontSize: 13, background: '#e6ffe6', padding: 10, borderRadius: 4, marginBottom: 16 }}>{msg}</div>}
  </>
);
export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2332', marginBottom: '2rem' }}>Privacy Policy</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#374151', lineHeight: 1.8 }}>
        <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>
        <p>PediatricianSalary.com is committed to protecting your privacy. This policy explains what information we collect and how we use it.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Information We Collect</h2>
        <p>Salary submissions contain no personal identifiers. We do not ask for your name or email as part of a salary submission. IP addresses are used only to enforce rate limits and are not stored permanently.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>How We Use Data</h2>
        <p>Salary data is reviewed and, if approved, published in aggregated and anonymized form. No individual submission can be traced back to a specific person.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Cookies</h2>
        <p>We use only essential cookies required for the site to function. We do not use advertising or tracking cookies.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Contact</h2>
        <p>Questions? Email <a href="mailto:support@pediatriciansalary.com" style={{ color: '#1e5f8e' }}>support@pediatriciansalary.com</a></p>
      </div>
    </div>
  )
}

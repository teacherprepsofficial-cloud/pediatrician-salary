export default function TermsPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2332', marginBottom: '2rem' }}>Terms of Use</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#374151', lineHeight: 1.8 }}>
        <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>
        <p>By using PediatricianSalary.com, you agree to these terms.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Accuracy of Data</h2>
        <p>Salary data is submitted by users and is not independently verified beyond basic review. We make no warranties regarding the accuracy or completeness of any salary information.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Submissions</h2>
        <p>By submitting salary data, you confirm that the information is accurate to the best of your knowledge and that you are not submitting false or misleading information.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>No Professional Advice</h2>
        <p>Nothing on this site constitutes professional, legal, or financial advice. Salary data is for informational purposes only.</p>
        <h2 style={{ fontWeight: 700, color: '#1a2332' }}>Contact</h2>
        <p>Questions? Email <a href="mailto:thejacksonhennessy@gmail.com" style={{ color: '#1e5f8e' }}>thejacksonhennessy@gmail.com</a></p>
      </div>
    </div>
  )
}

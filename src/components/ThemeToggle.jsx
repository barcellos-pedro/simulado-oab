export default function ThemeToggle({ theme, onChange }) {
  return <div className="theme-toggle" aria-label="Tema">
    {['light', 'dark', 'system'].map((item) => (
      <button key={item} className={theme === item ? 'active' : ''} onClick={() => onChange(item)}
        title={{ light: 'Claro', dark: 'Escuro', system: 'Sistema' }[item]}>
        {{ light: '☀', dark: '☾', system: '◐' }[item]}
      </button>
    ))}
  </div>
}

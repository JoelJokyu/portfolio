export function ModeSwitch({ mode, onChange }: { mode: 'professional' | 'terminal'; onChange: () => void }) {
  return <button className={`mode-switch ${mode === 'terminal' ? 'on-terminal' : ''}`} onClick={onChange} aria-label={`Switch to ${mode === 'professional' ? 'Terminal' : 'Professional'} mode`}><span aria-hidden="true">{mode === 'professional' ? '>_' : '↗'}</span><span>{mode === 'professional' ? 'Terminal' : 'Professional'}</span></button>;
}

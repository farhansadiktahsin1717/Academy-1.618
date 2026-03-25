import PropTypes from 'prop-types'
import Icon from './Icon'

function ThemeToggle({ onToggleTheme, theme }) {
  const isDark = theme === 'dark'

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      onClick={onToggleTheme}
      type="button"
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
      <span>{isDark ? 'Light' : 'Dark'} Mode</span>
    </button>
  )
}

ThemeToggle.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
}

export default ThemeToggle

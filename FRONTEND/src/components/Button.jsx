export const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-opacity-90 active:scale-95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    ghost: 'text-accent hover:bg-primary dark:hover:bg-gray-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

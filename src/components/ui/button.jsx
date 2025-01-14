import PropTypes from 'prop-types';

export const Button = ({ children, onClick, className = '', variant = 'default', style = {} }) => {
  const baseClasses = "font-bold py-2 px-4 rounded transition-colors duration-200";
  const variantClasses = {
    default: "bg-blue-500 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline']),
  style: PropTypes.object
};

import PropTypes from 'prop-types';

export const Card = ({ children }) => {
  return <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded">{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired
};

export const CardHeader = ({ children }) => {
  return <div className="font-bold mb-2">{children}</div>;
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired
};

export const CardTitle = ({ children }) => {
  return <h3 className="text-lg">{children}</h3>;
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired
};

export const CardContent = ({ children }) => {
  return <div>{children}</div>;
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired
};

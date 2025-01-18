import React from 'react';

export const Alert = ({ children }) => {
  return <div className="border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 px-4 py-3 rounded relative">{children}</div>;
};

export const AlertTitle = ({children}) => {
    return <strong className="font-bold text-gray-800 dark:text-gray-100">{children}</strong>
}

export const AlertDescription = ({children}) => {
    return <span className="block sm:inline text-gray-700 dark:text-gray-200">{children}</span>
}

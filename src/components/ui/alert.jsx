import React from 'react';

export const Alert = ({ children }) => {
  return <div className="border border-red-400 bg-red-100 px-4 py-3 rounded relative">{children}</div>;
};

export const AlertTitle = ({children}) => {
    return <strong className="font-bold">{children}</strong>
}

export const AlertDescription = ({children}) => {
    return <span className="block sm:inline">{children}</span>
}
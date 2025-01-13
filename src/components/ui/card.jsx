import React from 'react';

export const Card = ({ children }) => {
  return <div className="border p-4 rounded">{children}</div>;
};

export const CardHeader = ({ children }) => {
  return <div className="font-bold mb-2">{children}</div>;
};

export const CardTitle = ({ children }) => {
    return <h3 className="text-lg">{children}</h3>
};

export const CardContent = ({ children }) => {
    return <div>{children}</div>
}
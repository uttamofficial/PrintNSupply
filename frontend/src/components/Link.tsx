import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ children, href, className = '', ...props }: LinkProps) {
  return (
    <a 
      href={href} 
      className={`text-gray-600 hover:text-blue-600 transition-colors ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
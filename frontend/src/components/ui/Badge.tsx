import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'outline' | 'solid';
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'solid', ...rest }) => {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs';
  const variantClass = variant === 'outline' ? 'bg-transparent border border-current' : '';
  return (
    <span className={`${base} ${variantClass} ${className}`} {...rest}>
      {children}
    </span>
  );
};

export default Badge;

import React, { type ReactNode } from 'react';

type Props = {
  content: ReactNode;
  path?: string;
  className?: string;
  onClick?: () => void;
}

const NavbarLink = (props: Props) => {
  const {
    content,
    path,
    className,
    onClick,
  } = props;

  if (onClick) return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium ${className || ''}`}
    >
      {content}
    </button>
  )

  return (
    <a
      href={path}
      className={`px-4 py-2 rounded-lg font-medium ${className || ''}`}
    >
      {content}
    </a>
  );
};

export default NavbarLink;

import React from "react";

interface IContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<IContainerProps> = ({ className = "", children }) => {
  return (
    <div
      className={`max-w-7xl w-full px-10 h-full mx-auto flex flex-col ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};

export default Container;

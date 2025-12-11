import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type ProtectedLinkProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const ProtectedLink = ({ onClick, children, className }: ProtectedLinkProps) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      const proceed = window.confirm("You must be logged in. Go to login?");
      if (proceed) navigate("/login");
      return;
    }
    onClick();
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default ProtectedLink;

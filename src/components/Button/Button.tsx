import React, { SyntheticEvent } from "react";

import "./Button.scss";

export interface IButtonComponent {
  text: string;
  variant?: "normal" | "warning" | "error";
  onClick?: (e: SyntheticEvent) => void;
}

const Button = ({
  text,
  variant = "normal",
  onClick = () => {},
}: IButtonComponent) => {
  return (
    <div className={["Button", variant].join(" ")} onClick={onClick}>
      {text}
    </div>
  );
};

export default React.memo(Button);

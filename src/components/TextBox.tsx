// TextBox.tsx
import React from "react";

interface TextBoxProps {
  content: string;
}

const TextBox: React.FC<TextBoxProps> = ({ content }) => {
  return <div className="text-box-content">{content}</div>;
};

export default TextBox;

import React from "react";
import styles from "./Icone.module.css";

export const Icone = (props) => {
  const {
    className = '',
    style = {},
    elementoIcone
  } = props;

  if (!elementoIcone) {
    return;
  }

  return (
    <span
      className = {`${styles.icone} ${className}`}
      style = {style}
    >
      {elementoIcone}
    </span>
  )
}
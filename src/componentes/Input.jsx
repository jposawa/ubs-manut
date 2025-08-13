import styles from "./Input.module.css";

export const Input = ({
  label,
  className,
  mesmaLinha = false,
  ...props
}) => {
  return (
    <label className={`${styles.containerInput} ${!!mesmaLinha ? styles.inlineContainer : ""} ${className}`}>
      {!label ? null : <span>{label}</span>}
      <input {...props} />
    </label>
  );
}
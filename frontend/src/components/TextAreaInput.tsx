interface TAProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export default function TextAreaInput({ label, className, ...props }: TAProps) {
  return (
    <label style={{ fontWeight: 600, display: "block" }}>
      {label}
      <textarea {...props} className={className} />
    </label>
  );
}

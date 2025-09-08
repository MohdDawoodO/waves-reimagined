export default function EmailTemplate({
  text,
  linkText,
  tokenLink,
  code,
}: {
  text: string;
  linkText?: string | undefined;
  tokenLink?: string | undefined;
  code?: number | undefined;
}) {
  const codeNumbers = code?.toString().split("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{text}</h2>
      {tokenLink && linkText && (
        <a
          href={tokenLink}
          style={{
            color: "oklch(0.78 0.13 38.18)",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          {linkText}
        </a>
      )}
      {code && <h2>{code}</h2>}
    </div>
  );
}

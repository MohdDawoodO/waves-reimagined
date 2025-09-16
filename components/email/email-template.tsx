export default function EmailTemplate({
  text,
  linkText,
  tokenLink,
  code,
}: {
  text: string;
  linkText?: string | undefined;
  tokenLink?: string | undefined;
  code?: string | undefined;
}) {
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

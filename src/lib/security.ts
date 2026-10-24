export function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isValidEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== "string") return false;
  // Strict email regex rejecting CRLF or control characters to prevent header injection
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim()) && !email.includes("\r") && !email.includes("\n");
}

export function sanitizeString(
  input: string | undefined | null,
  maxLength: number = 255
): string {
  if (!input) return "";
  return String(input)
    .trim()
    .slice(0, maxLength)
    .replace(/[\r\n\t]/g, " ");
}

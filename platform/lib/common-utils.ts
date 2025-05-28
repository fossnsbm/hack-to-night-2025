export function isValidEmail(email: string): boolean {
  const emailRegex = /.+@students\.nsbm\.ac\.lk$/;
  return emailRegex.test(email.trim().toLowerCase());
}

export function validateThaiCitizenID(id: string): boolean {
  if (
    id.length != 13 ||
    id.charAt(0).match(/[09]/)
  ) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }

  if ((11 - sum % 11) % 10 != parseInt(id.charAt(12))) {
    return false;
  }
  return true;
}
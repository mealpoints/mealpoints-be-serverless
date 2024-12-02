export function convertToHumanReadableMessage(input: string): string {
  return input
    .replaceAll(String.raw`\n`, "\n") // Replace escaped newlines with actual newlines
    .replaceAll(String.raw`\'`, "'") // Replace escaped single quotes with actual single quotes
    .replaceAll(String.raw`\"`, '"') // Replace escaped double quotes with actual double quotes
    .replaceAll(String.raw`\t`, "\t") // Replace escaped tabs with actual tabs
    .trim(); // Remove any leading or trailing whitespace
}

export function isValidJsonString(string_: string): boolean {
  try {
    JSON.parse(string_);
    return true; // It's valid JSON
  } catch {
    return false; // It's not valid JSON
  }
}

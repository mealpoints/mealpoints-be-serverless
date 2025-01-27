export function convertToHumanReadableMessage(input: string): string {
  return input
    .replaceAll(String.raw`\n`, "\n") // Replace escaped newlines with actual newlines
    .replaceAll(String.raw`\'`, "'") // Replace escaped single quotes with actual single quotes
    .replaceAll(String.raw`\"`, '"') // Replace escaped double quotes with actual double quotes
    .replaceAll(String.raw`\t`, "\t") // Replace escaped tabs with actual tabs
    .replaceAll(String.raw`**`, "*")
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

export function createProgressBar(
  current: number | undefined = 0,
  target: number,
  barLength: number = 10
): string {
  const percentage = Math.min((current / target) * 100, 100); // Cap at 100%
  const filledLength = Math.round((barLength * percentage) / 100);
  const unfilledLength = barLength - filledLength;

  const filledBar = "▓".repeat(filledLength);
  const unfilledBar = "▒".repeat(unfilledLength);

  return `${filledBar}${unfilledBar}`;
}

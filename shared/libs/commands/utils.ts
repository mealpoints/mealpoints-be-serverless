// TODO: Currently two tests fail. Fix the implementation to make the tests pass.
export function containsCommand(message: string, command: string): boolean {
  if (!message || !command) {
    throw new Error(
      "Both 'message' and 'command' must be provided and non-empty."
    );
  }

  // Normalize both message and command for case-insensitive comparison
  const normalizedMessage = message.toLowerCase().trim();
  const normalizedKeyword = command.toLowerCase().trim();

  // Check if the message includes the command
  return normalizedMessage.includes(normalizedKeyword);
}

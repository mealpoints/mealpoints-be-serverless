export const disableConsoleDebug = () => {
  if (process.env.NODE_ENV === "production") {
    console.debug = () => {};
  }
};

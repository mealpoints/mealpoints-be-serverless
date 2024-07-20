import dotenv from "dotenv";
import { connectToDatabase } from "../shared/config/database";

dotenv.config({ path: ".env.test" });

// Load database connection
// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
(async () => {
  await connectToDatabase();
})();

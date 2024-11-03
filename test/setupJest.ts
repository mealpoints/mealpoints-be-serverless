import { connectToDatabase } from "../shared/config/database";
import { CONTACT_NUMBERS } from "./mocks/contacts.mock";
import { DataService } from "./test_utils/DataService";

beforeAll(async () => {
  await connectToDatabase();
  const dataService = DataService.getInstance();
  await dataService.seed(CONTACT_NUMBERS.madhav_in);
});

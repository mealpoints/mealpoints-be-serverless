import { WhatsAppFlowRequestBody } from "../../../types/flows";

export const handleWhatsAppFlowMessage = (
  decryptedBody: WhatsAppFlowRequestBody
) => {
  switch (decryptedBody.action) {
    case "ping": {
      // Handle the "ping" action
      return { data: { status: "active" } };
    }
    case "INIT": {
      // Handle the "INIT" action
      break;
    }
    case "BACK": {
      // Handle the "BACK" action
      break;
    }
    case "data_exchange": {
      // Handle the "data_exchange" action
      break;
    }
  }
};

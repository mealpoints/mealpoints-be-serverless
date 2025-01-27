export interface WhatsAppFlowRequestBody {
  version: string; // must be set to "3.0"
  action: "ping" | "INIT" | "BACK" | "data_exchange"; // restricted to possible values
  screen?: string; // optional, may not be populated for INIT or BACK
  data?: Record<string, string | boolean | number | object | unknown[]>; // optional, key-value pairs of any type
  flow_token?: string; // optional, required for data exchange flows
}

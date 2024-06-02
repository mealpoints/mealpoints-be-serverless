import { IWhatsappWebhookPayload } from "../types/message";

const TEXT_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "<WHATSAPP_BUSINESS_ACCOUNT_ID>",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "<BUSINESS_DISPLAY_PHONE_NUMBER>",
              phone_number_id: "<BUSINESS_PHONE_NUMBER_ID>",
            },
            contacts: [
              {
                profile: {
                  name: "<WHATSAPP_USER_NAME>",
                },
                wa_id: "<WHATSAPP_USER_ID>",
              },
            ],
            messages: [
              {
                from: "<WHATSAPP_USER_PHONE_NUMBER>",
                id: "<WHATSAPP_MESSAGE_ID>",
                timestamp: "<WEBHOOK_SENT_TIMESTAMP>",
                text: {
                  body: "<MESSAGE_BODY_TEXT>",
                },
                type: "text",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const REACTION_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "PHONE_NUMBER",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                reaction: {
                  message_id: "MESSAGE_ID",
                  emoji: "EMOJI",
                },
                type: "reaction",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const MEDIA_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "WHATSAPP_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                type: "image",
                image: {
                  caption: "CAPTION",
                  mime_type: "image/jpeg",
                  sha256: "IMAGE_HASH",
                  id: "ID",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const STICKER_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "ID",
              },
            ],
            messages: [
              {
                from: "SENDER_PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                type: "sticker",
                sticker: {
                  mime_type: "image/webp",
                  sha256: "HASH",
                  id: "ID",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const UNKNOWN_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "WHATSAPP_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                errors: [
                  {
                    code: 131051,
                    details: "Message type is not currently supported",
                    title: "Unsupported message type",
                  },
                ],
                type: "unknown",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

// For some reasont this does not have a message type
const LOCATION_MESSAGE = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "WHATSAPP_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                location: {
                  latitude: "LOCATION_LATITUDE",
                  longitude: "LOCATION_LONGITUDE",
                  name: "LOCATION_NAME",
                  address: "LOCATION_ADDRESS",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

// For some reasont this does not have a message type
const CONTACT_MESSAGE = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "WHATSAPP_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                contacts: [
                  {
                    addresses: [
                      {
                        city: "CONTACT_CITY",
                        country: "CONTACT_COUNTRY",
                        country_code: "CONTACT_COUNTRY_CODE",
                        state: "CONTACT_STATE",
                        street: "CONTACT_STREET",
                        type: "HOME or WORK",
                        zip: "CONTACT_ZIP",
                      },
                    ],
                    birthday: "CONTACT_BIRTHDAY",
                    emails: [
                      {
                        email: "CONTACT_EMAIL",
                        type: "WORK or HOME",
                      },
                    ],
                    name: {
                      formatted_name: "CONTACT_FORMATTED_NAME",
                      first_name: "CONTACT_FIRST_NAME",
                      last_name: "CONTACT_LAST_NAME",
                      middle_name: "CONTACT_MIDDLE_NAME",
                      suffix: "CONTACT_SUFFIX",
                      prefix: "CONTACT_PREFIX",
                    },
                    org: {
                      company: "CONTACT_ORG_COMPANY",
                      department: "CONTACT_ORG_DEPARTMENT",
                      title: "CONTACT_ORG_TITLE",
                    },
                    phones: [
                      {
                        phone: "CONTACT_PHONE",
                        wa_id: "CONTACT_WA_ID",
                        type: "HOME or WORK>",
                      },
                    ],
                    urls: [
                      {
                        url: "CONTACT_URL",
                        type: "HOME or WORK",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const RECIEVED_CALL_FROM_QUICK_REPLY_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "WHATSAPP_ID",
              },
            ],
            messages: [
              {
                context: {
                  from: "PHONE_NUMBER",
                  id: "wamid.ID",
                },
                from: "16315551234",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                type: "button",
                button: {
                  text: "No",
                  payload: "No-Button-Payload",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const RECIEVED_ANSWER_FROM_LIST_MESSAGE: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "PHONE_NUMBER_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER_ID",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                interactive: {
                  list_reply: {
                    id: "list_reply_id",
                    title: "list_reply_title",
                    description: "list_reply_description",
                  },
                  type: "list_reply",
                },
                type: "interactive",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const RECIEVED_ANSWER_TO_REPLY_BUTTON: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "PHONE_NUMBER_ID",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER_ID",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                interactive: {
                  button_reply: {
                    id: "unique-button-identifier-here",
                    title: "button-text",
                  },
                  type: "button_reply",
                },
                type: "interactive",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

// Received Message Triggered by Click to WhatsApp Ads
const RECIEVED_MESSAGE_FROM_CLICK_TO_WHATSAPP_ADS: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "ID",
              },
            ],
            messages: [
              {
                referral: {
                  source_url: "AD_OR_POST_FB_URL",
                  source_id: "ADID",
                  source_type: "ad or post",
                  headline: "AD_TITLE",
                  body: "AD_DESCRIPTION",
                  media_type: "image or video",
                  image_url: "RAW_IMAGE_URL",
                  video_url: "RAW_VIDEO_URL",
                  thumbnail_url: "RAW_THUMBNAIL_URL",
                  ctwa_clid: "CTWA_CLID",
                },
                from: "SENDER_PHONE_NUMBERID",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                type: "text",
                text: {
                  body: "BODY",
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const USER_CHANGED_NUMBER_NOTIFICATION: IWhatsappWebhookPayload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                system: {
                  body: "NAME changed from PHONE_NUMBER to PHONE_NUMBER",
                  new_wa_id: "NEW_PHONE_NUMBER",
                  type: "user_changed_number",
                },
                timestamp: "TIMESTAMP",
                type: "system",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

export const USER_MESSAGES = {
  errors: {
    image_not_processed:
      "Sorry, I was unable to process the image. Please try again in some time.",
    text_not_processed:
      "Sorry, I was unable to process your message. Please try again in some time.",
    rate_limit_exceeded:
      "You have reached the daily message limit. Please try again tomorrow.",
  },
  info: {
    feature_not_supported:
      "Sorry, we only accept food photos and text messages at the moment. The format of the message you sent is not supported. Please stay tuned for further updates.",
  },
};

export const QUEUE_MESSAGE_GROUP_IDS = {
  whatsapp_messages: "whatsapp_messages",
  meal_summary: "meal_summary",
  reminder: "reminder",
};

export const DEFAULT_GEO_INFO = {
  countryCode: "IN",
  timezone: "Asia/Kolkata",
};

export const START_HOUR_OF_DAY = 3;
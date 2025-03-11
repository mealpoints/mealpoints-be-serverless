import {
  ButtonPositionEnum,
  ButtonReplyEnum,
  ButtonTypesEnum,
  ComponentTypesEnum,
  ConversationTypesEnum,
  CurrencyCodesEnum,
  DocumentMediaTypesEnum,
  ImageMediaTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  ReferralSourceTypesEnum,
  StatusEnum,
  StickerMediaTypesEnum,
  SystemChangeTypesEnum,
  VideoMediaTypesEnum,
  WebhookTypesEnum,
} from "./enums";

type PricingObject = {
  category: ConversationTypesEnum;
  pricing_model: "CBP";
};

type OriginObject = {
  type: ConversationTypesEnum;
};

type ConversationObject = {
  id: string;
  origin: OriginObject;
  expiration_timestamp: string;
};

type ErrorDataObject = {
  details: string;
};

type ErrorObject = {
  code: number;
  title: string;
  message: string;
  error_data: ErrorDataObject;
};

export type StatusesObject = {
  conversation?: ConversationObject;
  errors?: ErrorObject[];
  id: string;
  pricing?: PricingObject;
  recipient_id: string;
  status: StatusEnum;
  timestamp: string;
};

type AudioObject = {
  id: string;
  mime_type: string;
};

type ButtonObject = {
  payload: string;
  text: string;
};

type ConTextObject = {
  forwarded: boolean;
  frequently_forwarded?: boolean;
  from?: string;
  id?: string;
  referred_product?: {
    catalog_id: string;
    product_retailer_id: string;
  };
};

type DocumentObject = {
  caption: string;
  filename: string;
  sha256: string;
  mime_type: DocumentMediaTypesEnum;
  id: string;
};

type IdentityObject = {
  acknowledged: string;
  created_timestamp: string;
  hash: string;
};

type ImageObject = {
  caption?: string;
  sha256: string;
  id: string;
  mime_type: ImageMediaTypesEnum;
};

export type NFMReplyObject = {
  type: "nfm_reply";
  nfm_reply: {
    name: "flow";
    body: "Sent";
    response_json: string;
  };
};

export type ButtonReplyObject = {
  type: "button_reply";
  button_reply: {
    id: ButtonReplyEnum;
    title: string;
  };
};

export type ListReplyObject = {
  type: "list_reply";
  list_reply: {
    id: string;
    title: string;
    description: string;
  };
};

export type InteractiveObject =
  | ButtonReplyObject
  | ListReplyObject
  | NFMReplyObject;

type ProductItemsObject = {
  product_retailer_id: string;
  quantity: string;
  item_price: string;
  currency: CurrencyCodesEnum;
};

type Order_Object = {
  catalog_id: string;
  text: string;
  product_items: ProductItemsObject;
};

type ReferralObject = {
  source_url: URL;
  source_type: ReferralSourceTypesEnum;
  source_id: string;
  headline: string;
  body: string;
  media_type: ImageMediaTypesEnum | VideoMediaTypesEnum;
  image_url: URL;
  video_url: URL;
  thumbnail_url: URL;
};

type StickerObject = {
  mime_type: StickerMediaTypesEnum;
  sha256: string;
  id: string;
  animated: boolean;
};

type SystemObject = {
  body: string;
  identity: string;
  wa_id: string;
  type: SystemChangeTypesEnum;
  customer: string;
};

type TextObject = {
  body: string;
};

type VideoObject = {
  caption: string;
  filename: string;
  sha256: string;
  id: string;
  mime_type: VideoMediaTypesEnum;
};

export type MessagesObject = {
  audio?: AudioObject;
  button?: ButtonObject;
  context?: ConTextObject;
  document?: DocumentObject;
  errors?: ErrorObject[];
  from: string;
  id: string;
  identity?: IdentityObject;
  image?: ImageObject;
  interactive?: InteractiveObject;
  order?: Order_Object;
  referral?: ReferralObject;
  sticker?: StickerObject;
  system?: SystemObject;
  text?: TextObject;
  timestamp: string;
  type: WebhookTypesEnum;
  video?: VideoObject;
};

type ProfileObject = {
  name: string;
};

type ContactObject = {
  wa_id: string;
  profile: ProfileObject;
};

type MetadataObject = {
  display_phone_number: string;
  phone_number_id: string;
};

export type ValueObject = {
  messaging_product: "whatsapp";
  contacts?: ContactObject[];
  errors?: ErrorObject[];
  messages?: MessagesObject[];
  metadata: MetadataObject;
  statuses?: StatusesObject[];
};

type ChangesObject = {
  field: string;
  value: ValueObject;
};

type Entry_Object = {
  id: string;
  changes: ChangesObject[];
};

export type WhastappWebhookObject = {
  object: "whatsapp_business_account";
  entry: Entry_Object[];
};

export type WebhookSubscribeQuery = {
  hub: {
    mode: "subscribe";
    challenge: string;
    verify_token: string;
  };
};

export type InteractiveMessageRequestBody = {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: "interactive";
  interactive: InteractiveCTAObject | InteractiveReplyObject;
};

export type InteractiveReplyObject = {
  type: "button";
  header?: {
    type: "text" | "image" | "video" | "document";
    text?: string;
    image?: {
      id?: string; // Media ID from uploaded media
      link?: string; // URL link to the media
    };
    video?: {
      id?: string; // Media ID from uploaded media
      link?: string; // URL link to the media
    };
    document?: {
      id?: string; // Media ID from uploaded media
      link?: string; // URL link to the media
    };
  };
  body: {
    text: string; // Maximum 1024 characters
  };
  footer?: {
    text: string; // Maximum 60 characters
  };
  action: {
    buttons: {
      type: "reply";
      reply: {
        id: ButtonReplyEnum; // Unique identifier for the button, max 256 characters
        title: string; // Button label text, max 20 characters
      };
    }[];
  };
};

export type InteractiveCTAObject = {
  type: "cta_url";
  header?: {
    type: "text";
    text: string;
  };
  body?: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    name: "cta_url";
    parameters: {
      display_text: string;
      url: string;
    };
  };
};

export type ParametersObject<T extends ParametersTypesEnum> = {
  type: T;
};

export type SimpleTextObject = {
  text: string;
};

export type ActionButtonParametersObject = {
  type: ParametersTypesEnum.Action;
  action: unknown;
};

export type TextParametersObject = ParametersObject<ParametersTypesEnum.Text> &
  SimpleTextObject;

// NOTE: The parameters are not exhaustive. Add more as needed.
export type ComponentObject<T extends ComponentTypesEnum> = {
  type: T;
  parameters: (
    | CurrencyParametersObject
    | DateTimeParametersObject
    | DocumentParametersObject
    | ImageParametersObject
    | TextParametersObject
    | VideoParametersObject
    | ActionButtonParametersObject
  )[];
};

export type LanguageObject = {
  policy: "deterministic";
  code: LanguagesEnum;
};

export type MessageTemplateObject<T extends ComponentTypesEnum> = {
  name: string;
  language: LanguageObject;
  components?: (ComponentObject<T> | ButtonComponentObject)[];
};

export interface ITemplateMessageRequestBody {
  messaging_product: string;
  to: string;
  type: "template";
  template: MessageTemplateObject<ComponentTypesEnum>;
}

export type QuickReplyButtonParametersObject = {
  type: ParametersTypesEnum.Payload;
  payload: string;
};

export type URLButtonParametersObject = SimpleTextObject & {
  type: ParametersTypesEnum.Text;
};

export type ButtonParameterObject =
  | QuickReplyButtonParametersObject
  | URLButtonParametersObject;

export type ButtonComponentObject =
  ComponentObject<ComponentTypesEnum.Button> & {
    parameters: ButtonParameterObject;
    sub_type: ButtonTypesEnum;
    index: ButtonPositionEnum;
  };

export type ImageParametersObject =
  ParametersObject<ParametersTypesEnum.Image> & ImageMediaObject;

export type ImageMediaObject = MetaImageMediaObject | HostedImageMediaObject;

export type MetaImageMediaObject = {
  id: string;
  link?: never;
  caption?: string;
};

export type HostedImageMediaObject = {
  id?: never;
  link: string;
  caption?: string;
};

export type MetaDocumentMediaObject = {
  id: string;
  link?: never;
  caption?: string;
  filename?: string;
};

export type HostedDocumentMediaObject = {
  id?: never;
  link: string;
  caption?: string;
  filename?: string;
};

export type DocumentMediaObject =
  | MetaDocumentMediaObject
  | HostedDocumentMediaObject;

export type DocumentParametersObject =
  ParametersObject<ParametersTypesEnum.Document> & DocumentMediaObject;

export type VideoParametersObject =
  ParametersObject<ParametersTypesEnum.Video> & VideoMediaObject;

export type VideoMediaObject = {
  video: MetaHostedVideoMediaObject | SelfHostedVideoMediaObject;
};

export type MetaHostedVideoMediaObject = {
  id: string;
  link?: never;
  caption?: string;
};

export type SelfHostedVideoMediaObject = {
  id?: never;
  link: string;
  caption?: string;
};

export type DateTimeParametersObject =
  ParametersObject<ParametersTypesEnum.DateTime> & {
    date_time: {
      fallback_value: string;
    };
  };

export type CurrencyObject = {
  fallback_value: string;
  code: CurrencyCodesEnum;
  amount_1000: number;
};

export type CurrencyParametersObject =
  ParametersObject<ParametersTypesEnum.Currency> & {
    currency: CurrencyObject;
  };

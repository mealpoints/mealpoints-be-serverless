// Common Interfaces
export interface IMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface IProfile {
  name: string;
}

export interface IContact {
  profile: IProfile;
  wa_id: string;
}

export interface IText {
  body: string;
}

export interface IReaction {
  message_id: string;
  emoji: string;
}

export interface IImage {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
}

export interface ISticker {
  mime_type: string;
  sha256: string;
  id: string;
}

export interface IError {
  code: number;
  details: string;
  title: string;
}

export interface ILocation {
  latitude: string;
  longitude: string;
  name: string;
  address: string;
}

export interface IAddress {
  city: string;
  country: string;
  country_code: string;
  state: string;
  street: string;
  type: string;
  zip: string;
}

export interface IEmail {
  email: string;
  type: string;
}

export interface IName {
  formatted_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  prefix: string;
}

export interface IOrg {
  company: string;
  department: string;
  title: string;
}

export interface IPhone {
  phone: string;
  wa_id: string;
  type: string;
}

export interface IURL {
  url: string;
  type: string;
}

export interface IContactDetail {
  addresses: IAddress[];
  birthday: string;
  emails: IEmail[];
  name: IName;
  org: IOrg;
  phones: IPhone[];
  urls: IURL[];
}

export interface IButton {
  text: string;
  payload: string;
}

export interface IListReply {
  id: string;
  title: string;
  description: string;
}

export interface IButtonReply {
  id: string;
  title: string;
}

export interface IReferral {
  source_url: string;
  source_id: string;
  source_type: string;
  headline: string;
  body: string;
  media_type: string;
  image_url: string;
  video_url: string;
  thumbnail_url: string;
  ctwa_clid: string;
}

export interface ISystem {
  body: string;
  new_wa_id: string;
  type: string;
}

// Message Types
export interface IBaseMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: IText;
  reaction?: IReaction;
  image?: IImage;
  sticker?: ISticker;
  errors?: IError[];
  location?: ILocation;
  contacts?: IContactDetail[];
  button?: IButton;
  interactive?: {
    list_reply?: IListReply;
    button_reply?: IButtonReply;
    type: string;
  };
  referral?: IReferral;
  system?: ISystem;
  context?: {
    from: string;
    id: string;
  };
}

export interface IEntryChange {
  value: {
    messaging_product: string;
    metadata: IMetadata;
    contacts?: IContact[];
    messages: IBaseMessage[];
    statuses: any; //TODO: Define this type
  };
  field: string;
}

export interface IWebhookEntry {
  id: string;
  changes: IEntryChange[];
}

export interface IWhatsappWebhookPayload {
  object: string;
  entry: IWebhookEntry[];
}

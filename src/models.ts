/**
 * Created by odd-one on 01/04/17.
 */
export enum MessageType {
  TEXT = <any>'text',
  IMAGE = <any>'text',
}

export interface Chat {
  $key?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
}

export interface Message {
  id?: string;
  chatId?: string;
  content?: string;
  senderId?: string;
  ownership?: string;
  createdAt?: Date;
  type?: MessageType
}

export interface Stories {

  id?: any;
  owner?: string;
  story?: any;
  user_id?: any;
  family_id?: any;
  location?: string;
  other_content?: string;
  date_created?: any;
  created_at?: any;
  updated_at?: any
}

export interface Images {
  id?: number;
  path?: string;
}

export interface Family {
  id?: string;
  name: string;
  emblem: string;
  location: string;
}

export interface Country {
  name?: string;
  dial_code?: string;
  code: string;
}

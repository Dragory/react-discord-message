import {APIAttachment, APIMessage, APIUser} from "discord-api-types/v10";

export type Theme = "dark" | "light";

export type MessageData = {
  author: {
    id?: APIUser["id"],
    username: APIUser["username"],
    discriminator?: APIUser["discriminator"],
    avatar?: APIUser["avatar"],
  },
  content: APIMessage["content"],
  embeds?: APIMessage["embeds"],
  attachments?: Array<{
    filename: APIAttachment["filename"],
    url: APIAttachment["url"],
  }>,
  timestamp?: APIMessage["timestamp"],
};

export type TypeExtender<TBase> = <TExtended extends TBase>(value: TExtended) => TExtended;
export function extendType<TBase>(): TypeExtender<TBase>;
export function extendType(...args: any[]) {
  if (args.length === 0) {
    return extendType;
  }

  return args[0];
}

export type RequiredWithDefaults<TOriginal, TDefaults> = Omit<TOriginal, keyof TDefaults> & Partial<Pick<TOriginal, keyof TDefaults & keyof TOriginal>>;

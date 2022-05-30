import {
  User,
  Message,
  SendMessageEvent,
  Action,
} from '@progress/kendo-angular-conversational-ui';

export class CustomAction implements Action {
  type: string;
  value: any;
  title?: string;
  timestamp?: Date;
  ldap: string;
  parentId: number;
}
export class CustomComment implements Message {
  author: User;
  attachmentLayout?;
  attachments?;
  suggestedActions?: CustomAction[];
  status?: string;
  text?: string;
  timestamp?: Date;
  typing?: boolean;
  id: number;
  parentId?: number;
  parentMessage?: string;
  bayName?: string;
}

export class CustomSendMessageEvent extends SendMessageEvent {
  /**
   * The message which contains the metadata and the user input.
   *
   * > The Chat does not automatically append the message to its data.
   * > For more information, refer to the article on [data binding]({% slug databinding_chat %}).
   */
  message: CustomComment;
}

export enum ContextHelpDirection {
  Top = 'TOP',
  Bottom = 'BOTTOM',
  Left = 'LEFT',
  Right = 'RIGHT',
}
export interface IContextHelpModel {
  contextID: number;
  contextCode: string;
  direction: ContextHelpDirection;
  requireBorder: boolean;
  headerHtml: string;
  bodyHtml: string;
  wikiHyperLink: string;
}
export class ContextHelpModel implements IContextHelpModel {
  constructor(context: IContextHelpModel) {
    if (context) {
      this.contextID = context.contextID;
      this.contextCode = context.contextCode;
      this.direction = context.direction;
      this.requireBorder = context.requireBorder;
      this.headerHtml = context.headerHtml;
      this.bodyHtml = context.bodyHtml;
      this.wikiHyperLink = context.wikiHyperLink;
    }
  }
  contextID: number;
  contextCode: string;
  direction: ContextHelpDirection;
  requireBorder: boolean;
  headerHtml: string;
  bodyHtml: string;
  wikiHyperLink: string;
}

export class ContextHelpDetails {
  index: number;
  isSelected: boolean;
  target: any;
  targetId: string;
  targetPosition: ElementPosition;
  tagPosition: ElementPosition;
  config: ContextHelpConfiguration;
}

export class ElementPosition {
  targetRectPosition: any;
  top: number;
  left: number;
  topOffset?: number;
  leftOffset?: number;
}

export class ContextHelpDataModel {
  contextList: ContextHelpDetails[];
}

export class ContextHelpConfiguration {
  contextKey: string;
  direction: ContextHelpDirection;
  headerTranslationKey: string;
  bodyTranslationKey: string;
  embededLinkTranslationKey: string;
  embededFmpVideoLinkTranslationKey: string;
}

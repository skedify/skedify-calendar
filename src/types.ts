import type { FC, PointerEventHandler } from "react";

export interface IEvent {
  start: Date;
  end: Date;

  id?: string;
  isPlaceholderEvent?: boolean;
  mouseStartPositionDiffInSeconds?: number;
  isDirty?: boolean;
  original?: IEvent;
}

export interface RenderHeaderProps {
  end: Date;
  start: Date;
}
export type RenderHeader = FC<RenderHeaderProps>;

export interface RenderDayHeaderProps {
  date: Date;
}
export type RenderDayHeader = FC<RenderDayHeaderProps>;

export interface GutterItemProps {
  slotIndex: number;
  time: Date;
  sizeOfOneSlot: number;
}
export type RenderGutterItem = FC<GutterItemProps>;

export interface InteractionInfo {
  isCreatingAllowed: boolean;
  isInteractable: boolean;
  isInteracting: boolean;
  isOtherInteracting: boolean;
  isPseudo: boolean;
  isUpdatingAllowed: boolean;
}

export interface RenderEventProps {
  event: IEvent;
  interactionInfo: InteractionInfo;
}

export type RenderEvent = FC<RenderEventProps>;

export type OnActivate = PointerEventHandler<HTMLButtonElement | HTMLDivElement>;

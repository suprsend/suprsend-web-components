import type {
  SuprSendProviderProps,
  InboxPopoverProps,
  NotificationFeedProps,
  ToastNotificationProps,
  IFeedOptions,
  SuprSend,
  SuprSendI18nProviderProps,
  ITranslations,
} from "@suprsend/react";
import { ToastPosition } from "react-hot-toast";

export interface IInbox
  extends IFeedOptions,
    Omit<
      InboxPopoverProps,
      | "bellComponent"
      | "badgeComponent"
      | "loaderComponent"
      | "noNotificationsComponent"
      | "tabBadgeComponent"
      | "notificationComponent"
      | "headerRightComponent"
    > {
  hideToast?: boolean;
  headerIconUrl?: string;
  headerIconClickHandler?: () => void;
}

export interface IFeed
  extends IFeedOptions,
    Omit<
      NotificationFeedProps,
      | "loaderComponent"
      | "noNotificationsComponent"
      | "tabBadgeComponent"
      | "notificationComponent"
      | "headerRightComponent"
    > {
  hideToast?: boolean;
  headerIconUrl?: string;
  headerIconClickHandler?: () => void;
  hideFeed?: boolean;
}

export interface IToastNotificationProps
  extends Omit<ToastNotificationProps, "notificationData"> {
  position?: ToastPosition;
  duration?: number;
}

export interface ISuprSendComponents {
  inbox?: IInbox;
  feed?: IFeed;
  toast?: IToastNotificationProps;
}

export interface IOptions
  extends Omit<SuprSendProviderProps, "children">,
    Omit<SuprSendI18nProviderProps, "children">,
    ISuprSendComponents {
  initOnLoad?: boolean;
}

export interface IUpdateSuprSendConfigOptions {
  locale?: string;
  translations?: ITranslations;
  userToken?: string;
}

export interface ICustomHeaderRightComponent {
  markAllRead: () => void;
  config?: IInbox;
}

export interface IGlobalSuprSend {
  client?: SuprSend;
  initSuprSend: (config: IOptions) => void;
  clearSuprSend: () => void;
  clearSuprSendInbox: () => void;
  clearSuprSendFeed: () => void;
  updateInboxConfig?: (config: IInbox) => void;
  updateFeedConfig?: (config: IFeed) => void;
  updateToastConfig?: (config: IToastNotificationProps) => void;
  refreshUserToken?: (userToken: string) => void;
  updateSuprSendConfig?: (config: IUpdateSuprSendConfigOptions) => void;
}

declare global {
  interface Window {
    suprsend: IGlobalSuprSend;
    suprsendConfig?: IOptions;
  }
}

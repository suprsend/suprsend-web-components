import {
  SuprSendProviderProps,
  InboxPopoverProps,
  NotificationFeedProps,
  ToastNotificationProps,
  IFeedOptions,
} from "@suprsend/react";
import { ToastPosition } from "react-hot-toast";

interface IInbox
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

interface INotificationFeed
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
}

export interface IToastNotificationProps
  extends Omit<ToastNotificationProps, "notificationData"> {
  position?: ToastPosition;
  duration?: number;
}

export interface ISuprSendComponents {
  inbox?: IInbox;
  notificationFeed?: INotificationFeed;
  toast?: IToastNotificationProps;
}

export interface IOptions
  extends Omit<SuprSendProviderProps, "children">,
    ISuprSendComponents {}

export interface ICustomHeaderRightComponent {
  markAllRead: () => void;
  config?: IInbox;
}

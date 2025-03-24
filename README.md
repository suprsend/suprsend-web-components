# @suprsend/web-components

This library provides drop-in components to intergrate SuprSend features like InApp feed, Preferences etc in web applications like vanillajs, angular, vuejs etc. If you want to build UI from scratch, use [@suprsend/web-sdk](https://github.com/suprsend/suprsend-web-sdk).

## Integration

### Integrate using script tag

This integration is used in Vanillajs, Django, Laravel, ruby etc where npm is not used.

```html
<!-- for dropin inbox with bell -->
<div id="suprsend-inbox"></div>

<!-- for feed without bell as a fullscreen notification etc -->
<div id="suprsend-notification-feed"></div>

<script>
  window.suprsendConfig = {
    distinctId: "YOUR_DISTINCT_ID",
    publicApiKey: "YOUR_PUBLIC_API_KEY",
    userAuthenticationHandler: ({ response }) => {
      console.log("User Authentication Response", response);
    },
  };

  let scriptElem = document.createElement("script");
  scriptElem.async = 1;
  scriptElem.src = "./dist/bundle.umd.js";
  scriptElem.onload = () => {
    console.log("SuprSend SDK loaded", window.suprsend);
  };
  document.body.appendChild(scriptElem);
</script>
```

## Integrate as NPM Package

This integration is used in framework based applications like angular, vuejs etc.

```bash
npm install @suprsend/web-components@latest
```

```javascript
import { initSuprSend, clearSuprSend } from "@suprsend/web-components";

// for dropin inbox with bell
<div id="suprsend-inbox"></div>

// for feed without bell as a fullscreen notification etc
<div id="suprsend-notification-feed"></div>

const suprsendConfig = {
    distinctId: "YOUR_DISTINCT_ID",
    publicApiKey: "YOUR_PUBLIC_API_KEY",
    userAuthenticationHandler: ({ response }) => {
      console.log("User Authentication Response", response);
    },
  };

  initSuprSend(suprsendConfig) // for creating instance and rendering component
  console.log("Instance created but user authentication pending", window.suprsend)
```

## Removing Instance

### Using script tag integration

```javascript
// integration using script tag

window.suprsend.clearSuprSend(); // clears instance and remove all components
window.suprsend.clearSuprSendInbox(); // unmount only inbox component
window.suprsend.clearSuprSendFeed(); // unmount only feed component
```

### Using npm package integration

```javascript
import {
  clearSuprSend,
  clearSuprSendInbox,
  clearSuprSendFeed,
} from "@suprsend/web-components";

clearSuprSend(); // clears instance and remove all components
clearSuprSendInbox(); // unmount only inbox component
clearSuprSendFeed(); // unmount only feed component
```

## Updating component configuration dynamically

```javascript
const config = {...}; // diff config objects
window.suprsend.updateInboxConfig(config);
window.suprsend.updateFeedConfig(config);
window.suprsend.updateToastConfig(config);
```

## Refreshing expired JWT user token

```javascript
window.suprsend.refreshUserToken(token); // pass new jwt usertoken string
```

## Accessing other instance methods

SDK internally calls `new SuprSend()` when you call `initSuprSend()` then you can access instance using `window.suprsend.client`. This instance has methods like [preferences](https://docs.suprsend.com/docs/js-preferences), [webpush](https://docs.suprsend.com/docs/js-webpush), [event and user update](https://docs.suprsend.com/docs/js-events-and-user-methods) methods.

```javascript
// example methods
window.suprsend.client.isIdentified();
window.suprsend.client.user.addEmail(email: string);
window.suprsend.client.track(event: string, properties?: Dictionary)
window.suprsend.client.webpush.registerPush();
window.suprsend.client.user.preferences.getPreferences(args?: {tenantId?: string});
```

## Config Options

To customise SuprSend components you could pass config object. Below are available options

```typescript
interface ConfigProps {
  publicApiKey: string;
  distinctId?: unknown;
  userToken?: string; // jwt token needed when enhanced security mode is enabled
  host?: string; // custom host url
  initOnLoad?: boolean; // pass false if you dont want to initialise instance just after loading script
  refreshUserToken?: (
    oldUserToken: string,
    tokenPayload: Dictionary
  ) => Promise<string>; // called after current user token expiry, call your BE api and return new user token
  vapidKey?: string; // for webpush notifications
  swFileName?: string; // for webpush notifications
  userAuthenticationHandler?: ({ response: ApiResponse }) => void; // callback will be called after internally authenticating user.
  inbox?: IInbox;
  feed?: IFeed;
  toast?: IToastNotificationProps;
}

// inbox config options
interface IInbox extends {
  tenantId?: string;
  stores?: IStore[] | null; // for multiple tabs support
  host?: {
    socketHost?: string;
    apiHost?: string;
  };
  pageSize?: number;
  pagination?: boolean;
  theme?: ITheme; // to customise css of inbox
  themeType?: ThemeType; // dark or light mode
  popperPosition?: Placement; // position of popper wrt bell ex: top, bottom-start, left-end
  hideAvatar?: boolean;
  showUnreadCountOnTabs?: boolean; // hiding unread count in multi tab setup
  hideToast?: boolean; // by default toast is shown on new notification. To stop it pass false
  headerIconUrl?: string; // icon url to be shown on right side of mark all as read button on header
  headerIconClickHandler?: () => void; // on click of above mentioned icon this is called
  notificationClickHandler?: (notification: IRemoteNotification) => void;
  primaryActionClickHandler?: (notification: IRemoteNotification) => void;
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void;
}

// notifications feed config options
interface IFeed{
  tenantId?: string;
  pageSize?: number;
  stores?: IStore[] | null; // for multiple tabs support
  host?: {
      socketHost?: string;
      apiHost?: string;
  };
  pagination?: boolean;
  showUnreadCountOnTabs?: boolean; // hiding unread count in multi tab setup
  hideAvatar?: boolean;
  themeType?: ThemeType; // to customise css of feed
  theme?: INotificationFeedTheme; // dark or light mode
  hideToast?: boolean; // by default toast is shown on new notification. To stop it pass false
  hideFeed?: boolean; // useful if you dont want to show feed but only show toast notif on new notification
  headerIconUrl?: string; // icon url to be shown on right side of mark all as read button on header
  headerIconClickHandler?: () => void; // on click of above mentioned icon this is called
  notificationClickHandler?: (notification: IRemoteNotification) => void;
  primaryActionClickHandler?: (notification: IRemoteNotification) => void;
  secondaryActionClickHandler?: (notification: IRemoteNotification) => void;
}

// toast notification config options
interface IToastNotificationProps{
  position?: ToastPosition; // "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  duration?: number; // milliseconds toast should be shown default to 3s
  hideAvatar?: boolean;
  themeType?: ThemeType;  // dark or light mode
  theme?: ToastNotificationCardTheme; // to customise css of toast notification
}
```

# @suprsend/web-components

This library provides drop-in components to intergrate SuprSend features like InApp feed, Preferences etc in web applications like vanillajs, angular, vuejs etc. If you want to build UI from scratch, use [@suprsend/web-sdk](https://github.com/suprsend/suprsend-web-sdk).

## Integration

### Using script tag

This integration is used in Vanillajs, Django, Laravel, ruby etc where npm is not used.

```html
<!-- for dropin inbox with bell -->
<div id="suprsend-inbox"></div>

<!-- for feed without bell as a fullscreen notification etc -->
<div id="suprsend-feed"></div>

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
  scriptElem.src = "https://web-components.suprsend.com/v1.1.0/bundle.umd.js";
  scriptElem.onload = () => {
    console.log("SuprSend SDK loaded", window.suprsend);
  };
  document.body.appendChild(scriptElem);
</script>
```

### Using npm/yarn

This integration is used in framework based applications like angular, vuejs etc.

```bash
npm install @suprsend/web-components@latest
yarn add @suprsend/web-components@latest
```

```javascript
import { initSuprSend, clearSuprSend } from "@suprsend/web-components";

// for dropin inbox with bell
<div id="suprsend-inbox"></div>

// for feed without bell in a fullscreen or side-sheet etc
<div id="suprsend-feed"></div>

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

**NOTE:** If you are using `suprsend-feed`, specify height for the container for infinite scroll to work properly.

```javascript
const suprsendConfig = {
  distinctId: "YOUR_DISTINCT_ID",
  publicApiKey: "YOUR_PUBLIC_API_KEY",
  feed: {
    theme: { notificationsContainer: { container: { height: "100vh" } } }, // add this to specify height
  },
};
```

## Removing Instance

```javascript
// integration using script tag

window.suprsend.clearSuprSend(); // clears instance and remove all components
window.suprsend.clearSuprSendInbox(); // unmount only inbox component
window.suprsend.clearSuprSendFeed(); // unmount only feed component
```

```javascript
// integration using npm package
import {
  clearSuprSend,
  clearSuprSendInbox,
  clearSuprSendFeed,
} from "@suprsend/web-components";

clearSuprSend(); // clears instance and remove all components
clearSuprSendInbox(); // unmount only inbox component
clearSuprSendFeed(); // unmount only feed component
```

## Updating configuration dynamically

```javascript
window.suprsend.updateSuprSendConfig(config: IUpdateSuprSendConfigOptions); // change tenantId, userToken, locale, translations dynamically
window.suprsend.updateInboxConfig(config: IInbox);
window.suprsend.updateFeedConfig(config: IFeed);
window.suprsend.updateToastConfig(config: IToastNotificationProps);
```

## Accessing instance methods

SDK internally calls `new SuprSend()` when you call `initSuprSend()` then you can access instance using `window.suprsend.client`. This instance has methods like [preferences](https://docs.suprsend.com/docs/js-preferences), [webpush](https://docs.suprsend.com/docs/js-webpush), [event and user updates](https://docs.suprsend.com/docs/js-events-and-user-methods).

```javascript
// example methods
window.suprsend.client.isIdentified();
window.suprsend.client.user.addEmail(email: string);
window.suprsend.client.track(event: string, properties?: Dictionary)
window.suprsend.client.webpush.registerPush();
window.suprsend.client.user.preferences.getPreferences();
```

## Configuration Options

To customise SuprSend components you can pass config object.

```typescript
interface ConfigProps {
  publicApiKey: string;
  distinctId?: unknown;
  userToken?: string;
  tenantId?: string;
  pushTokenActionOnTenantChange?: "none" | "copy" | "move";
  tenantChangeHandler?: ({
    tenantId,
    response,
  }: {
    tenantId?: string;
    response: ApiResponse;
  }) => void;
  host?: string;
  initOnLoad?: boolean;
  refreshUserToken?: (
    oldUserToken: string,
    tokenPayload: Dictionary
  ) => Promise<string>;
  vapidKey?: string;
  swFileName?: string;
  shadowRoot?: ShadowRoot;
  userAuthenticationHandler?: ({ response: ApiResponse }) => void;
  locale: "en / fr / es / de / ar";
  translations: ITranslations;
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

// feed config options
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

| Parameter                     | Description                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| publicApiKey                  | Mandatory. Public API key used to authenticate the SDK — SDK throws an error if it is missing. You can get it from the SuprSend Dashboard.                                                                                                                                                                                                              |
| distinctId                    | Unique identifier of the user. When a value is passed, the SDK creates and authenticates the user. Passing `null` clears the authenticated user's instance data in your application, similar to a logout.                                                                                                                                               |
| userToken                     | JWT token generated on your server, required only when enhanced security mode is turned on in the SuprSend Dashboard. Enhanced security mode adds an extra layer of authentication, recommended for production environments. Read more about it [here](https://docs.suprsend.com/docs/client-authentication).                                           |
| tenantId                      | Needed only when you use multi-tenant architecture. Scopes the identified user's events, preferences, and in-app feed to that tenant. Its value must match `scope.tenant_id` in the `userToken` payload, otherwise a scoping error is raised. Changing the `tenantId` prop switches the active tenant of the identified user.                           |
| pushTokenActionOnTenantChange | Defaults to `none`. Controls what happens to the existing webpush subscription when the active `tenantId` changes. `none` leaves it attached to the current tenant, `copy` attaches it to the new tenant as well, `move` detaches it from the current tenant and attaches it to the new tenant. Only relevant if you use webpush with multiple tenants. |
| tenantChangeHandler           | Callback invoked with the response after a `tenantId` change switches the active tenant of the identified user. If `response.status` is `error`, the previous tenant remains active - revert or retry with a valid `tenantId`.                                                                                                                          |
| refreshUserToken              | Callback invoked internally by the SDK to replace the `userToken` with a new one before it expires                                                                                                                                                                                                                                                      |
| userAuthenticationHandler     | Callback invoked after the SDK internally authenticates the user you pass via `distinctId`. It gives you the response of the user creation API call.                                                                                                                                                                                                    |
| host                          | Customise the host URL.                                                                                                                                                                                                                                                                                                                                 |
| vapidKey                      | Needed only if you are implementing WebPush notifications. You can find it in SuprSend Dashboard --> Vendors --> WebPush.                                                                                                                                                                                                                               |
| swFileName                    | Needed only if you are implementing WebPush notifications and want to replace the default `serviceworker.js` file name with your own service worker file name.                                                                                                                                                                                          |
| shadowRoot                    | Shadow root reference to render components inside shadow dom.                                                                                                                                                                                                                                                                                           |
| locale                        | Language to be used in components' internal strings. Supported locales: `en`, `fr`, `es`, `de`, `ar`. Defaults to `en`. Currently used only by inbox.                                                                                                                                                                                                   |
| translations                  | Pass this to override inbuilt translation values or to add translations for a language that we don't support internally. Refer more [here](https://github.com/suprsend/suprsend-react-core/blob/main/docs/language-support.md)                                                                                                                          |

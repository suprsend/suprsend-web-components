import { render, unmountComponentAtNode } from "react-dom";
import { useEffect, useMemo, Fragment, createPortal } from "react";
import {
  SuprSendProvider,
  Inbox,
  useSuprSendClient,
  NotificationFeed,
  SuprSendFeedProvider,
  useFeedClient,
  ToastNotificationCard,
} from "@suprsend/react";
import toast, { Toaster } from "react-hot-toast";
import {
  IOptions,
  ISuprSendComponents,
  IToastNotificationProps,
  ICustomHeaderRightComponent,
} from "./interface";

function CustomHeaderRightComponent({
  markAllRead,
  config,
}: ICustomHeaderRightComponent) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <p
        style={{
          fontWeight: 600,
          color: "#2E70E8",
          fontSize: 12,
          cursor: "pointer",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
          margin: 0,
          ...(config?.theme?.header?.markAllReadText || {}),
        }}
        onClick={(e) => {
          e.stopPropagation();
          markAllRead();
        }}
      >
        Mark all as read
      </p>
      {config?.headerIconUrl && (
        <img
          src={config.headerIconUrl}
          alt="header image"
          style={{
            height: 18,
            width: 18,
            cursor: "pointer",
            // @ts-ignore
            ...(config?.theme?.header?.headerIcon || {}),
          }}
          onClick={(e) => {
            e.stopPropagation();
            config?.headerIconClickHandler?.();
          }}
        />
      )}
    </div>
  );
}

function SuprSendRoot({
  publicApiKey,
  distinctId,
  userToken,
  host,
  vapidKey,
  swFileName,
  refreshUserToken,
  userAuthenticationHandler,
  inbox,
  notificationFeed,
  toast,
}: IOptions) {
  return (
    <SuprSendProvider
      publicApiKey={publicApiKey}
      distinctId={distinctId}
      host={host}
      refreshUserToken={refreshUserToken}
      vapidKey={vapidKey}
      userToken={userToken}
      swFileName={swFileName}
      userAuthenticationHandler={userAuthenticationHandler}
    >
      <SuprSendComponents
        inbox={inbox}
        notificationFeed={notificationFeed}
        toast={toast}
      />
    </SuprSendProvider>
  );
}

function SuprSendComponents({
  inbox,
  notificationFeed,
  toast,
}: ISuprSendComponents) {
  const suprsendClient = useSuprSendClient();

  useEffect(() => {
    window.suprsendClient = suprsendClient;
  }, []);

  const inboxElem = useMemo(
    () => document.getElementById("suprsend-inbox"),
    []
  );
  const feedElem = useMemo(
    () => document.getElementById("suprsend-notification-feed"),
    []
  );

  const { hideToast: hideInboxToast } = inbox || {};
  const {
    host,
    pageSize,
    stores,
    tenantId,
    hideToast: hideFeedToast,
    ...otherFeedProps
  } = notificationFeed || {};

  return (
    <Fragment>
      {inboxElem &&
        createPortal(
          <Inbox
            {...inbox}
            headerRightComponent={({ markAllRead }) => (
              <CustomHeaderRightComponent
                config={inbox}
                markAllRead={markAllRead}
              />
            )}
          >
            {!hideInboxToast && <ToastNotification {...toast} />}
          </Inbox>,
          inboxElem
        )}

      {feedElem &&
        createPortal(
          <SuprSendFeedProvider
            host={host}
            pageSize={pageSize}
            stores={stores}
            tenantId={tenantId}
          >
            <NotificationFeed
              {...otherFeedProps}
              headerRightComponent={({ markAllRead }) => (
                <CustomHeaderRightComponent
                  config={otherFeedProps}
                  markAllRead={markAllRead}
                />
              )}
            />
            {!hideFeedToast && <ToastNotification {...toast} />}
          </SuprSendFeedProvider>,
          feedElem
        )}
    </Fragment>
  );
}

function ToastNotification(options: IToastNotificationProps) {
  const { duration, position, hideAvatar, ...otherProps } = options || {};
  const feedClient = useFeedClient();

  useEffect(() => {
    if (!feedClient) return;

    feedClient.emitter.on("feed.new_notification", (data) => {
      toast.custom(
        <div>
          <ToastNotificationCard
            notificationData={data}
            {...otherProps}
            theme={{
              ...(otherProps.theme || {}),
              container: {
                minWidth: "300px",
                maxWidth: "450px",
                borderRadius: 8,
                padding: "8px 10px",
                boxShadow:
                  "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
                ...(otherProps.theme?.container || {}),
              },
            }}
          />
        </div>
      );
    });

    return () => {
      feedClient.emitter.off("feed.new_notification");
    };
  }, [feedClient]);

  const toastPosition =
    position || (window.innerWidth > 425 ? "bottom-right" : "bottom-center");

  return (
    <Toaster
      position={toastPosition}
      toastOptions={{ duration: duration || 3000 }}
      gutter={8}
    />
  );
}

export function initSuprSend(config: IOptions) {
  if (!document) return;
  let rootElem = document.getElementById("suprsend-root");

  if (rootElem) {
    unmountComponentAtNode(rootElem);
  } else {
    rootElem = document.createElement("div");
    rootElem.id = "suprsend-root";
    document.body.appendChild(rootElem);
  }

  render(<SuprSendRoot {...config} />, rootElem);
}

if (window?.suprSendConfig) {
  const config = window.suprSendConfig || {};
  initSuprSend(config);
}

export function clearSuprSendClient() {
  let rootElem = document.getElementById("suprsend-root");
  if (rootElem) {
    unmountComponentAtNode(rootElem);
    clearSuprSendInbox();
    clearSuprSendNotificationFeed();
    window.suprsendClient = undefined;
  }
}

export function clearSuprSendInbox() {
  let rootElem = document.getElementById("suprsend-inbox");
  if (rootElem) {
    unmountComponentAtNode(rootElem);
  }
}

export function clearSuprSendNotificationFeed() {
  let rootElem = document.getElementById("suprsend-notification-feed");
  if (rootElem) {
    unmountComponentAtNode(rootElem);
  }
}

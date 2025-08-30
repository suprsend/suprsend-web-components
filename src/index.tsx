import { render, unmountComponentAtNode } from "react-dom";
import { useState, useEffect, useMemo, Fragment, createPortal } from "react";
import {
  SuprSendProvider,
  Inbox,
  useSuprSendClient,
  NotificationFeed,
  SuprSendFeedProvider,
  useFeedClient,
  ToastNotificationCard,
  SuprSendI18nProvider,
  useTranslations,
} from "@suprsend/react";
import { Toaster, toast } from "sonner";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {
  IOptions,
  ISuprSendComponents,
  IToastNotificationProps,
  ICustomHeaderRightComponent,
  IInbox,
  IFeed,
  IUpdateSuprSendConfigOptions,
  IClearInstance,
} from "./interface";

function CustomHeaderRightComponent({
  markAllRead,
  config,
}: ICustomHeaderRightComponent) {
  const { t } = useTranslations();

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
        {t("markAllAsRead")}
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

function ToastNotification(options: IToastNotificationProps) {
  const { duration, position, ...otherProps } = options || {};
  const feedClient = useFeedClient();

  useEffect(() => {
    if (!feedClient) return;

    feedClient.emitter.on("feed.new_notification", (data) => {
      toast.custom(() => (
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
      ));
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
      expand={true}
    />
  );
}

function SuprSendRoot(config: IOptions) {
  const { inbox, feed, toast, shadowRoot, ...otherConfig } = config;
  const [suprsendConfig, setSuprSendConfig] = useState(otherConfig);

  useEffect(() => {
    window.suprsend.refreshUserToken = (userToken: string) => {
      setSuprSendConfig((prevConfig) => ({ ...prevConfig, userToken }));
    };
    window.suprsend.updateSuprSendConfig = (
      config: IUpdateSuprSendConfigOptions
    ) => {
      setSuprSendConfig((prevConfig) => ({ ...prevConfig, ...(config || {}) }));
    };
  }, []);

  return (
    <SuprSendProvider {...suprsendConfig}>
      <SuprSendI18nProvider
        locale={suprsendConfig?.locale}
        translations={suprsendConfig?.translations}
      >
        <SuprSendComponents
          inbox={inbox}
          feed={feed}
          toast={toast}
          shadowRoot={shadowRoot}
        />
      </SuprSendI18nProvider>
    </SuprSendProvider>
  );
}

function SuprSendComponents({
  inbox,
  feed,
  toast,
  shadowRoot,
}: ISuprSendComponents) {
  const suprsendClient = useSuprSendClient();
  const [showInbox, setShowInbox] = useState(true);
  const [showFeed, setShowFeed] = useState(true);

  const [inboxConfig, setInboxConfig] = useState(inbox);
  const [feedConfig, setFeedConfig] = useState(feed);
  const [toastConfig, setToastConfig] = useState(toast);

  useMemo(() => {
    window.suprsend._clearSuprSendInboxInternally = () => {
      setShowInbox(false);
    };

    window.suprsend._clearSuprSendFeedInternally = () => {
      setShowFeed(false);
    };

    window.suprsend.updateInboxConfig = (config: IInbox) => {
      setInboxConfig((prevConfig) => ({ ...prevConfig, ...(config || {}) }));
    };

    window.suprsend.updateFeedConfig = (config: IFeed) => {
      setFeedConfig((prevConfig) => ({
        ...prevConfig,
        ...(config || {}),
      }));
    };

    window.suprsend.updateToastConfig = (config: IToastNotificationProps) => {
      setToastConfig((prevConfig) => ({ ...prevConfig, ...(config || {}) }));
    };

    // needed to have same client instance and not to create duplicate instances
    if (!window.suprsend.client) {
      window.suprsend.client = suprsendClient;
    } else {
      Object.assign(window.suprsend.client, suprsendClient);
      Object.setPrototypeOf(
        window.suprsend.client,
        Object.getPrototypeOf(suprsendClient)
      );
    }
  }, [suprsendClient]);

  const inboxElem = useMemo(
    () => (shadowRoot || document).getElementById("suprsend-inbox"),
    []
  );
  const feedElem = useMemo(
    () => (shadowRoot || document).getElementById("suprsend-feed"),
    []
  );

  const { hideToast: hideInboxToast } = inboxConfig || {};
  const {
    host,
    pageSize,
    stores,
    tenantId,
    hideToast: hideFeedToast,
    hideFeed,
    ...otherFeedProps
  } = feedConfig || {};

  return (
    <Fragment>
      {showInbox &&
        inboxElem &&
        createPortal(
          <Inbox
            {...inboxConfig}
            shadowRoot={shadowRoot}
            headerRightComponent={({ markAllRead }) => (
              <CustomHeaderRightComponent
                config={inboxConfig}
                markAllRead={markAllRead}
              />
            )}
          >
            {!hideInboxToast && <ToastNotification {...toastConfig} />}
          </Inbox>,
          inboxElem
        )}

      {showFeed &&
        feedElem &&
        createPortal(
          <SuprSendFeedProvider
            host={host}
            pageSize={pageSize}
            stores={stores}
            tenantId={tenantId}
          >
            {!hideFeed && (
              <NotificationFeed
                {...otherFeedProps}
                shadowRoot={shadowRoot}
                headerRightComponent={({ markAllRead }) => (
                  <CustomHeaderRightComponent
                    config={otherFeedProps}
                    markAllRead={markAllRead}
                  />
                )}
              />
            )}
            {!hideFeedToast && <ToastNotification {...toastConfig} />}
          </SuprSendFeedProvider>,
          feedElem
        )}
    </Fragment>
  );
}

export function initSuprSend(config: IOptions) {
  if (!document && !config?.shadowRoot) return;
  const mainRoot = config?.shadowRoot || document;
  let rootElem = mainRoot.getElementById("suprsend-root");

  if (rootElem) {
    unmountComponentAtNode(rootElem);
  } else {
    rootElem = document.createElement("div");
    rootElem.id = "suprsend-root";
    if (mainRoot instanceof ShadowRoot) {
      mainRoot.appendChild(rootElem);
    } else {
      document.body.appendChild(rootElem);
    }
  }

  const emotionCache = createCache({
    key: "preact-shadow",
    container: config?.shadowRoot,
  });

  render(
    <CacheProvider value={emotionCache}>
      <SuprSendRoot {...config} />
    </CacheProvider>,
    rootElem
  );
}

export function clearSuprSend(config?: IClearInstance) {
  if (!document) return;
  const mainRoot = config?.shadowRoot || document;
  let rootElem = mainRoot.getElementById("suprsend-root");
  if (rootElem) {
    unmountComponentAtNode(rootElem);
    clearSuprSendInbox();
    clearSuprSendFeed();
    window.suprsend.client = undefined;
  }
}

export function clearSuprSendInbox() {
  if (window.suprsend._clearSuprSendInboxInternally) {
    window.suprsend._clearSuprSendInboxInternally();
  }
}

export function clearSuprSendFeed() {
  if (window.suprsend._clearSuprSendFeedInternally) {
    window.suprsend._clearSuprSendFeedInternally();
  }
}

window.suprsend = {
  initSuprSend,
  clearSuprSend,
  clearSuprSendInbox,
  clearSuprSendFeed,
};

if (window?.suprsendConfig && window?.suprsendConfig?.initOnLoad !== false) {
  initSuprSend(window.suprsendConfig || {});
}

export * from "@suprsend/react";
export * from "./interface";

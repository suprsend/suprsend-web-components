# Changelog

## [1.1.0] - 2026-09-07

### Added

- `pushTokenActionOnTenantChange` config option (`'none' | 'copy' | 'move'`, defaults to `'none'`). It controls what happens to the existing webpush subscription when the active `tenantId` changes via `updateSuprSendConfig`: `copy` attaches it to the new tenant as well, `move` detaches it from the current tenant and attaches it to the new tenant. If the device has no push subscription, the tenant switch still succeeds. See [Changing tenant](README.md#changing-tenant) for details.
- `tenantChangeHandler` config callback, invoked with the `changeTenant` response whenever a `tenantId` change switches the active tenant of the identified user. Use it to detect a failed switch, in which case the previous tenant stays active.

### Changed

- Upgraded `@suprsend/react` dependency to `^1.2.0`, which in turn upgrades `@suprsend/react-core` to `^2.2.0` and `@suprsend/web-sdk` to `^5.2.0`. See the [react 1.2.0 changelog](https://github.com/suprsend/suprsend-react-sdk/blob/main/CHANGELOG.md#120) and [web-sdk 5.2.0 changelog](https://github.com/suprsend/suprsend-web-sdk/blob/main/CHANGELOG.md#520) for details.

### Notes

- No changes are needed if you don't use webpush with multiple tenants.

[1.1.0]: https://github.com/suprsend/suprsend-web-components/compare/v1.0.0...v1.1.0

## [1.0.0] - 2026-08-17

### Added

- Tenant scoping support for multi-tenant workspaces. No changes are needed if your workspace doesn't use multiple tenants.
- Passing `tenantId` in `suprsendConfig` scopes the identified user's events, preferences, and in-app feed to that tenant in multi-tenant setups. When enhanced security mode is enabled, its value must match `scope.tenant_id` in the `userToken` payload, otherwise a scoping error is raised. Changing `tenantId` switches the active tenant of the identified user.
- Improved `userToken` refresh logic — the `refreshUserToken` callback is now invoked on-demand before each api call instead of via a background timer. See the [web-sdk 5.1.0 changelog](https://github.com/suprsend/suprsend-web-sdk/blob/main/CHANGELOG.md#510) for details.

[1.0.0]: https://github.com/suprsend/suprsend-web-components/compare/v0.6.0...v1.0.0

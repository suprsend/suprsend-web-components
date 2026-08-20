# Changelog

## [1.0.0] - 2026-08-17

### Added

- Tenant scoping support for multi-tenant workspaces. No changes are needed if your workspace doesn't use multiple tenants.
- Passing `tenantId` in `suprsendConfig` scopes the identified user's events, preferences, and in-app feed to that tenant in multi-tenant setups. When enhanced security mode is enabled, its value must match `scope.tenant_id` in the `userToken` payload, otherwise a scoping error is raised. Changing `tenantId` switches the active tenant of the identified user.
- Improved `userToken` refresh logic — the `refreshUserToken` callback is now invoked on-demand before each api call instead of via a background timer. See the [web-sdk 5.1.0 changelog](https://github.com/suprsend/suprsend-web-sdk/blob/main/CHANGELOG.md#510) for details.

[1.0.0]: https://github.com/suprsend/suprsend-web-components/compare/v0.6.0...v1.0.0

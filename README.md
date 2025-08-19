# Backstage Plugins

This monorepo is host multiple open-source Backstage plugins.

## Data Contract Plugin

See [Data Contract Plugin Docs](./plugins/datacontract/README.md)

The first published plugin is the **Data Contract API Definition**, featuring a frontend package for rendering Data Contracts and a backend module that validates API entities with `spec.type: datacontract`.

This plugin streamlines data contract sharing and bridges the gap between data providers and consumers. Built on top of the official [Data Contract specification](https://datacontract.com/) and its ecosystem of tools, it brings enterprise-grade data governance directly into your Backstage catalog.

**Why Data Contracts?** They establish clear agreements between data producers and consumers, ensuring data quality, compatibility, and trust across your organization's data landscape.

## Development

For setup, local development, build, and test scripts, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Releases

Release and versioning are managed with Changesets. See [RELEASE.md](./RELEASE.md) for the full workflow.

## Architecture Documentation

Significant architectural decisions are documented as **Architecture Decision Records (ADRs)** in the `adr/` directory. See [ADR README](./adr/README.md) for the format and existing decisions.

## Packages

- Data Contract API Plugin (frontend): `plugins/datacontract` — see its
  [README](./plugins/datacontract/README.md) for installation and usage.
- Data Contract API Plugin (backend): `plugins/datacontract-backend` — see its
  [README](./plugins/datacontract-backend/README.md) for installation and usage.
- Additional plugins will be added under `plugins/*` as they are developed.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

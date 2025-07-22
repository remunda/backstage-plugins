# Instructions for Contributors

This repository contains a Backstage plugin for ingesting and validating
DataContract YAML files. Any significant architectural decision or change
should be captured in the documentation. If you add new components or modify
the ingest flow, update the relevant README or create additional docs as
needed.

AI assistants (OpenAI Codex, GitHub Copilot, Claude) should follow these
instructions and keep this file up to date when making large changes.

## Recent Updates
- Added `DataContractProcessor` which validates `$file` references in API entities and inserts the YAML during catalog ingestion.
- Frontend plugin now registers a definition widget for APIs of type `datacontract`.

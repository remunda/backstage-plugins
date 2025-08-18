# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Backstage Plugins project.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-plugin-architecture.md) | Plugin Architecture and Entity Integration | Accepted | 2025-08 |
| [002](./002-iframe-template-rendering.md) | Iframe-Based Template Rendering | Accepted | 2025-08 |
| [003](./003-semantic-release-to-changesets.md) | Migration from Semantic Release to Changesets | Accepted | 2025-08 |

## About ADRs

Architecture Decision Records (ADRs) are documents that capture important architectural decisions made during the development of this project. Each ADR describes:

- **Context**: The situation and forces that led to the decision
- **Decision**: The architectural decision that was made
- **Status**: Whether the decision is proposed, accepted, deprecated, or superseded
- **Consequences**: The positive and negative consequences of the decision

## ADR Format

Each ADR follows a standard format:

```markdown
# ADR-XXX: Title

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Description of the situation and forces that led to this decision]

## Decision
[The architectural decision that was made]

## Consequences
[Positive and negative consequences of the decision]

## Alternatives Considered
[Other options that were considered and why they were rejected]

## Related
[Links to related ADRs or external resources]
```

## Contributing

When making significant architectural decisions:

1. Create a new ADR with the next sequential number
2. Follow the standard format above
3. Include the ADR in this index
4. Create a changeset documenting the architectural change
5. Ensure the decision is reviewed by the team

For questions about ADRs, see [ADR documentation](https://adr.github.io/).

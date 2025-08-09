# Templates

Templates downloaded from the [datacontract-cli](https://github.com/datacontract/datacontract-cli) repository.

**✅ Auto-generated templates from datacontract-cli**

These templates are automatically downloaded and processed from the official datacontract-cli repository to ensure compatibility with the latest version.

To update the templates:
```bash
yarn datacontract:update-templates
```

## Processing

Templates are processed to convert Python syntax to JavaScript:
- `.items()` → ` ` (removed)
- `True`/`False` → `true`/`false`
- `.ref` → `.$ref`
- CLI references updated to Editor references

## Structure

- `datacontract.html` - Main template
- `partials/` - Partial templates referenced by main template

Source: https://github.com/datacontract/datacontract-cli/tree/main/datacontract/templates

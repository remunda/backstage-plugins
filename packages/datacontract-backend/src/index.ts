import express, { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  processingResult,
  LocationSpec,
} from '@backstage/plugin-catalog-node';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { ApiEntity } from '@backstage/catalog-model';

/**
 * Router providing a simple ingest endpoint for datacontract YAMLs.
 */
export async function createRouter(): Promise<Router> {
  const router = express.Router();
  const schemaPath = path.join(__dirname, '../../schemas/datacontract.schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  router.post('/ingest', express.json({ limit: '10mb' }), async (req, res) => {
    const yamlContent = req.body?.yaml;
    if (!yamlContent) {
      res.status(400).json({ error: 'yaml is required' });
      return;
    }
    try {
      const doc = yaml.load(yamlContent);
      const valid = validate(doc);
      if (!valid) {
        res.status(400).json({ errors: validate.errors });
        return;
      }
      res.status(200).json({ status: 'ok' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  return router;
}

/**
 * Catalog processor that loads datacontract definitions from $file references
 * in API entities with type `datacontract`.
 */
export class DataContractProcessor implements CatalogProcessor {
  constructor(private readonly options: { schemasDir: string }) {}

  getProcessorName(): string {
    return 'DataContractProcessor';
  }

  async validateKind?(entity: ApiEntity): Promise<boolean> {
    return entity.kind === 'API' && entity.spec?.type === 'datacontract';
  }

  async preProcessEntity?(entity: ApiEntity, location: LocationSpec): Promise<ApiEntity> {
    if (entity.kind !== 'API' || entity.spec?.type !== 'datacontract') {
      return entity;
    }

    const def = entity.spec.definition as any;
    if (def && def['$file']) {
      const filePath = resolveSafeChildPath(path.dirname(location.target), def['$file']);
      const yamlContent = await fs.readFile(filePath, 'utf8');
      const schemaPath = path.join(this.options.schemasDir, 'datacontract.schema.json');
      const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      const parsed = yaml.load(yamlContent);
      const valid = validate(parsed);
      if (!valid) {
        throw new Error(`DataContract validation failed: ${JSON.stringify(validate.errors)}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          definition: yamlContent,
        },
      } as ApiEntity;
    }

    return entity;
  }
}

export const createDataContractProcessor = (schemasDir: string) =>
  new DataContractProcessor({ schemasDir });

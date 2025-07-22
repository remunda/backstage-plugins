import express from 'express';
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';

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
      // Here you would persist the datacontract or trigger catalog refresh
      res.status(200).json({ status: 'ok' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  return router;
}

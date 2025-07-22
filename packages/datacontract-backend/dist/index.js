"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const ajv_1 = __importDefault(require("ajv"));
async function createRouter() {
    const router = express_1.default.Router();
    const schemaPath = path_1.default.join(__dirname, '../../schemas/datacontract.schema.json');
    const schema = JSON.parse(await promises_1.default.readFile(schemaPath, 'utf8'));
    const ajv = new ajv_1.default({ allErrors: true });
    const validate = ajv.compile(schema);
    router.post('/ingest', express_1.default.json({ limit: '10mb' }), async (req, res) => {
        const yamlContent = req.body?.yaml;
        if (!yamlContent) {
            res.status(400).json({ error: 'yaml is required' });
            return;
        }
        try {
            const doc = js_yaml_1.default.load(yamlContent);
            const valid = validate(doc);
            if (!valid) {
                res.status(400).json({ errors: validate.errors });
                return;
            }
            // Here you would persist the datacontract or trigger catalog refresh
            res.status(200).json({ status: 'ok' });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    });
    return router;
}

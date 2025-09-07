/** biome-ignore-all lint/suspicious/noExplicitAny: only tests */
import type { Entity } from "@backstage/catalog-model";
import { DataContractProcessor } from "./DataContractApiEntityProcessor";

describe("DataContractProcessor", () => {
	let processor: DataContractProcessor;
	const mockLogger = {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	} as any;

	beforeEach(() => {
		processor = new DataContractProcessor(mockLogger);
		jest.clearAllMocks();
	});

	describe("getProcessorName", () => {
		it("should return the correct processor name", () => {
			expect(processor.getProcessorName()).toBe("DataContractProcessor");
		});
	});

	describe("validateKind", () => {
		it("should validate a correct datacontract definition", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            dataContractSpecification: "0.9.0"
            id: test-contract
            info:
              title: Test Data Contract
              version: "1.0.0"
              description: A test data contract
              owner: Test Team
              contact:
                name: Test Team
                email: test@example.com
            servers:
              prod:
                type: bigquery
                project: test-project
                dataset: test_dataset
          `,
				},
			};

			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(true);
		});

		it("should throw error for invalid YAML", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `invalid: yaml: content: [`,
				},
			};

			await expect(processor.validateEntityKind?.(entity)).rejects.toThrow(
				"Invalid DataContract definition for entity test-api: not a valid YAML object",
			);
		});

		it("should throw error for missing dataContractSpecification", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            id: test-contract
            info:
              title: Test Data Contract
              version: "1.0.0"
          `,
				},
			};

			await expect(processor.validateEntityKind?.(entity)).rejects.toThrow(
				"Entity test-api is missing required 'dataContractSpecification' field",
			);
		});

		it("should NOT throw error for invalid datacontract fields but warn", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            dataContractSpecification: "0.9.0"
            id: test-contract
            info:
              title: Test Data Contract
              # Missing required version field
          `,
				},
			};

			// Should not throw but should return true (allows ingestion)
			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(true);
			
			// Should have logged a warning
			expect(mockLogger.warn).toHaveBeenCalledWith(
				expect.stringContaining("DataContract validation warnings for entity test-api"),
			);
		});

		it("should return false for non-API entities", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "Component",
				metadata: { name: "test-component" },
				spec: {},
			};

			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(false);
		});

		it("should return false for non-datacontract API entities", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "openapi",
					definition: "",
				},
			};

			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(false);
		});


		it("should handle undefined definition gracefully", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
				},
			};

			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(true);
		});

		it("should validate S3 URIs with wildcards and template variables", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-s3-api" },
				spec: {
					type: "datacontract",
					definition: `
            dataContractSpecification: "0.9.0"
            id: test-s3-contract
            info:
              title: Test S3 Data Contract
              version: "1.0.0"
              description: A test data contract with S3 location
              owner: Test Team
            servers:
              prod:
                type: s3
                location: "s3://datacontract-example-orders-latest/data/{model}/*.json"
                format: json
          `,
				},
			};

			const result = await processor.validateEntityKind?.(entity);
			expect(result).toBe(true);
		});

		it("should validate various URI patterns with wildcards and template variables", async () => {
			const testCases = [
				// S3 URIs
				"s3://bucket-name/path/file.json",
				"s3://bucket-name/path/*.json",
				"s3://bucket-name/data/{model}/file.parquet",
				"s3://datacontract-example-orders-latest/data/{model}/*.json",
				"s3://my-bucket/folder/{year}/{month}/*.csv",
				// Google Cloud Storage URIs
				"gs://bucket-name/path/*.json",
				"gs://my-bucket/data/{model}/*.parquet",
				// HDFS URIs
				"hdfs://namenode:9000/path/{model}/*.json",
				"hdfs://cluster/data/*.parquet",
				// Generic file URIs
				"file:///path/to/data/{model}/*.json",
				"file:///local/data/*.csv",
			];

			for (const location of testCases) {
				const entity: Entity = {
					apiVersion: "backstage.io/v1alpha1",
					kind: "API",
					metadata: { name: "test-uri-api" },
					spec: {
						type: "datacontract",
						definition: `
              dataContractSpecification: "0.9.0"
              id: test-uri-contract
              info:
                title: Test URI Data Contract
                version: "1.0.0"
                description: A test data contract with URI location
                owner: Test Team
              servers:
                prod:
                  type: s3
                  location: "${location}"
                  format: json
            `,
					},
				};

				const result = await processor.validateEntityKind?.(entity);
				expect(result).toBe(true);
			}
		});

		it("should validate Azure ABFSS URIs with wildcards and template variables", async () => {
			const testCases = [
				// Azure Data Lake Storage URIs
				"abfss://container@account.dfs.core.windows.net/path/{model}/*.json",
				"abfss://my-container@storage.dfs.core.windows.net/data/*.csv",
			];

			for (const location of testCases) {
				const entity: Entity = {
					apiVersion: "backstage.io/v1alpha1",
					kind: "API",
					metadata: { name: "test-azure-api" },
					spec: {
						type: "datacontract",
						definition: `
              dataContractSpecification: "0.9.0"
              id: test-azure-contract
              info:
                title: Test Azure Data Contract
                version: "1.0.0"
                description: A test data contract with Azure location
                owner: Test Team
              servers:
                prod:
                  type: azure
                  location: "${location}"
                  format: json
            `,
					},
				};

				const result = await processor.validateEntityKind?.(entity);
				expect(result).toBe(true);
			}
		});
	});

	describe("postProcessEntity", () => {
		const mockLocation = { type: "url", target: "http://example.com" };
		const mockEmit = jest.fn();
		const mockCache = {} as any;

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it("should store validation errors in annotations for invalid fields", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            dataContractSpecification: "0.9.0"
            id: test-contract
            info:
              title: Test Data Contract
              # Missing required version field
          `,
				},
			};

			const result = await processor.postProcessEntity?.(entity, mockLocation, mockEmit, mockCache);
			
			expect(result).toBeDefined();
			expect(result!.metadata.annotations).toBeDefined();
			expect(result!.metadata.annotations!['datacontract.io/validation-errors']).toContain("DataContract validation failed");
			expect(mockEmit).not.toHaveBeenCalled(); // Should not emit errors for field validation
		});

		it("should emit error for missing dataContractSpecification", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            id: test-contract
            info:
              title: Test Data Contract
              version: "1.0.0"
          `,
				},
			};

			await processor.postProcessEntity?.(entity, mockLocation, mockEmit, mockCache);
			
			expect(mockEmit).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "error",
					error: expect.objectContaining({
						message: "Entity test-api is missing required 'dataContractSpecification' field"
					})
				})
			);
		});

		it("should clear validation errors annotation for valid data contracts", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { 
					name: "test-api",
					annotations: {
						'datacontract.io/validation-errors': 'Previous error'
					}
				},
				spec: {
					type: "datacontract",
					definition: `
            dataContractSpecification: "0.9.0"
            id: test-contract
            info:
              title: Test Data Contract
              version: "1.0.0"
          `,
				},
			};

			const result = await processor.postProcessEntity?.(entity, mockLocation, mockEmit, mockCache);
			
			expect(result!.metadata.annotations!['datacontract.io/validation-errors']).toBeUndefined();
		});
	});
});

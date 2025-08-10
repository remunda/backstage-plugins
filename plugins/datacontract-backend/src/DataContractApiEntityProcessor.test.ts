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

		it("should throw error for invalid datacontract definition", async () => {
			const entity: Entity = {
				apiVersion: "backstage.io/v1alpha1",
				kind: "API",
				metadata: { name: "test-api" },
				spec: {
					type: "datacontract",
					definition: `
            openapi: 3.0.0
            info:
              title: Invalid API
              # Missing required version field
          `,
				},
			};

			await expect(processor.validateEntityKind?.(entity)).rejects.toThrow(
				"DataContract validation failed",
			);
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
});

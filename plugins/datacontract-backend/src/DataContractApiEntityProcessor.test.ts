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
	});
});

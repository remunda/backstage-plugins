import { registerMswTestHooks, renderInTestApp } from "@backstage/test-utils";
import { screen } from "@testing-library/dom";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { ExampleComponent } from "./ExampleComponent";

describe("ExampleComponent", () => {
	const server = setupServer();
	// Enable sane handlers for network requests
	registerMswTestHooks(server);

	// setup mock response
	beforeEach(() => {
		server.use(
			http.get("/*", () => {
				return HttpResponse.json({}, { status: 200 });
			}),
		);
	});

	it("should render", async () => {
		await renderInTestApp(<ExampleComponent />);
		expect(
			screen.getByText("Welcome to backstage-plugin-datacontract!"),
		).toBeInTheDocument();
	});
});

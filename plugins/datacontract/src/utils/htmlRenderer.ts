import * as yaml from "js-yaml";

export interface DataContract {
	id?: string;
	info?: {
		title?: string;
		version?: string;
		description?: string;
		owner?: string;
		status?: string;
		contact?: {
			name?: string;
			email?: string;
			url?: string;
		};
	};
	models?: Record<
		string,
		{
			type?: string;
			description?: string;
			fields?: Record<
				string,
				{
					type?: string;
					description?: string;
					required?: boolean;
					primary?: boolean;
					unique?: boolean;
					format?: string;
					example?: string | number | boolean;
					classification?: string;
					pii?: boolean;
				}
			>;
		}
	>;
	servers?: Record<
		string,
		{
			type?: string;
			environment?: string;
			description?: string;
		}
	>;
	terms?: {
		usage?: string;
		limitations?: string;
		billing?: string;
		noticePeriod?: string;
	};
	servicelevels?: {
		availability?: {
			description?: string;
			percentage?: string;
		};
		retention?: {
			description?: string;
			period?: string;
			unlimited?: boolean;
		};
		freshness?: {
			description?: string;
			threshold?: string;
			timestampField?: string;
		};
		frequency?: {
			description?: string;
			type?: string;
			interval?: string;
			cron?: string;
		};
		support?: {
			description?: string;
			time?: string;
			responseTime?: string;
		};
		backup?: {
			description?: string;
			interval?: string;
			cron?: string;
			recoveryTime?: string;
			recoveryPoint?: string;
		};
	};
	definitions?: Record<
		string,
		{
			domain?: string;
			name?: string;
			title?: string;
			type?: string;
			format?: string;
			description?: string;
			example?: string | number | boolean;
			enum?: (string | number | boolean)[];
			classification?: string;
			pii?: boolean;
		}
	>;
	examples?: Array<{
		model?: string;
		type?: string;
		description?: string;
		data?: string;
	}>;
	tags?: string[];
	links?: Record<string, string>;
}

export function parseDataContract(yamlString: string): DataContract {
	try {
		return yaml.load(yamlString) as DataContract;
	} catch (error) {
		throw new Error(`Failed to parse YAML: ${error}`);
	}
}

function escapeHtml(text: string): string {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

function renderInformation(datacontract: DataContract): string {
	const info = datacontract.info || {};

	return `
    <div class="px-4 sm:px-0">
      <h1 class="text-base font-semibold leading-6 text-gray-900" id="info">Info</h1>
      <p class="text-sm text-gray-500">Information about the data contract</p>
    </div>
    <div class="mt-2 overflow-hidden shadow sm:rounded-lg bg-white">
      <div class="px-4 py-5 sm:px-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Title</dt>
            <dd class="mt-1 text-sm text-gray-900">${escapeHtml(info.title || "")}</dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Version</dt>
            <dd class="mt-1 text-sm text-gray-900">${escapeHtml(info.version || "")}</dd>
          </div>
          ${
						info.status
							? `
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm text-gray-900">${escapeHtml(info.status)}</dd>
          </div>
          `
							: ""
					}
          ${
						info.description
							? `
          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span class="whitespace-pre-wrap">${escapeHtml(info.description)}</span>
            </dd>
          </div>
          `
							: ""
					}
          ${
						info.owner
							? `
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Owner</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span>${escapeHtml(info.owner)}</span>
            </dd>
          </div>
          `
							: ""
					}
          ${
						info.contact
							? `
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Contact</dt>
            <dd class="mt-1 text-sm text-gray-900">
              ${info.contact.name ? escapeHtml(info.contact.name) : ""}
              ${info.contact.email ? `<a href="mailto:${escapeHtml(info.contact.email)}" class="text-sky-500 hover:text-gray-700">${escapeHtml(info.contact.email)}</a>` : ""}
              ${info.contact.url ? `<div><a href="${escapeHtml(info.contact.url)}" class="text-sky-500 hover:text-gray-700">${escapeHtml(info.contact.url)}</a></div>` : ""}
            </dd>
          </div>
          `
							: ""
					}
        </dl>
      </div>
    </div>
  `;
}

function renderModels(datacontract: DataContract): string {
	if (!datacontract.models || Object.keys(datacontract.models).length === 0) {
		return "";
	}

	const modelsHtml = Object.entries(datacontract.models)
		.map(([modelName, model]) => {
			const fieldsHtml = model.fields
				? Object.entries(model.fields)
						.map(
							([fieldName, field]) => `
      <tr>
        <td class="whitespace-nowrap py-2 pl-4 pr-2 text-sm font-medium text-gray-900 sm:pl-6 w-2/12">
          <div class="py-2 text-sm">
            <span class="font-mono">${escapeHtml(fieldName)}</span>
          </div>
        </td>
        <td class="whitespace-nowrap px-1 py-2 text-sm text-gray-500 w-1/12">
          ${field.type ? escapeHtml(field.type) : ""}
        </td>
        <td class="px-3 py-2 text-sm text-gray-500 w-7/12">
          ${field.description ? `<div class="text-gray-500">${escapeHtml(field.description)}</div>` : '<div class="text-gray-400">No description</div>'}
          ${field.example ? `<div class="mt-1 italic">Example: <span class="font-mono">${escapeHtml(String(field.example))}</span></div>` : ""}
          <div>
            ${field.primary ? '<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">primary</span>' : ""}
            ${field.required ? '<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">required</span>' : ""}
            ${field.unique ? '<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">unique</span>' : ""}
            ${field.format ? `<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">format:${escapeHtml(field.format)}</span>` : ""}
            ${field.classification ? `<span class="inline-flex items-center rounded-md bg-blue-50 px-1 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10 mr-1 mt-1">${escapeHtml(field.classification)}</span>` : ""}
            ${field.pii ? '<span class="inline-flex items-center rounded-md bg-yellow-50 px-1 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-500/10 mr-1 mt-1">PII</span>' : ""}
          </div>
        </td>
      </tr>
    `,
						)
						.join("")
				: "";

			return `
      <div class="mt-3 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="colgroup" colspan="3" class="py-2 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
                      <span>${escapeHtml(modelName)}</span>
                      ${model.type ? `<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">${escapeHtml(model.type)}</span>` : ""}
                      ${model.description ? `<div class="text-sm font-medium text-gray-500">${escapeHtml(model.description)}</div>` : ""}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  ${fieldsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
		})
		.join("");

	return `
    <section id="models">
      <div class="flex justify-between">
        <div class="px-4 sm:px-0">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Data Model</h1>
          <p class="text-sm text-gray-500">The logical data model</p>
        </div>
      </div>
      ${modelsHtml}
    </section>
  `;
}

export function renderDataContractHtml(yamlString: string): string {
	try {
		const datacontract = parseDataContract(yamlString);
		const formattedDate = new Date().toLocaleDateString();

		return `
      <main class="pb-7">
        <div class="pt-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>
            <div class="md:flex md:items-center md:justify-between px-4 sm:px-0">
              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Data Contract
                </h2>
                <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  ${datacontract.id ? escapeHtml(datacontract.id) : ""}
                </div>
                ${
									datacontract.tags && datacontract.tags.length > 0
										? `
                <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div class="mt-2 flex items-center text-sm text-gray-500 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    ${datacontract.tags
											.map(
												(tag) => `
                      <span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 mr-1">
                        <span>${escapeHtml(tag)}</span>
                      </span>
                    `,
											)
											.join("")}
                  </div>
                </div>
                `
										: ""
								}
              </div>
            </div>
          </div>

          <div>
            <div class="space-y-6 mt-6">
              <section id="information">
                ${renderInformation(datacontract)}
              </section>

              ${renderModels(datacontract)}
            </div>
          </div>

          <div class="mt-6 text-sm text-gray-400">
            Created at ${formattedDate} with <a href="https://editor.datacontract.com" class="text-gray-400 hover:text-gray-500">Data Contract Editor</a>
          </div>
        </div>
      </main>
    `;
	} catch (error) {
		return `
      <div class="px-4 py-5 sm:px-6">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error parsing DataContract
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>${escapeHtml(String(error))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
	}
}

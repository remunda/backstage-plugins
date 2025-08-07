import * as yaml from "js-yaml";
import * as nunjucks from "nunjucks";
import { TEMPLATES } from './templates';

/**
 * Parse DataContract YAML string
 */
export function parseDataContract(yamlString: string): any {
	try {
		return yaml.load(yamlString);
	} catch (error) {
		throw new Error(`Failed to parse YAML: ${error}`);
	}
}

/**
 * Configure Nunjucks environment with embedded templates
 */
function configureNunjucks(): nunjucks.Environment {
	const env = new nunjucks.Environment(undefined, { 
		autoescape: true,
		throwOnUndefined: false
	});
	
	// Register partial templates for use in main template
	Object.entries(TEMPLATES).forEach(([name, template]) => {
		if (name.startsWith('partials/')) {
			// Remove partials/ prefix for template name
			const templateName = name.replace('partials/', '');
			env.addGlobal(templateName, template);
		}
	});
	
	return env;
}

/**
 * Render DataContract HTML using Nunjucks templates
 */
export function renderDataContractHtml(yamlString: string): string {
	try {
		const datacontract = parseDataContract(yamlString);
		const env = configureNunjucks();
		const formattedDate = new Date().toLocaleDateString();

		// Get the main template
		const mainTemplate = TEMPLATES['datacontract.html'];
		if (!mainTemplate) {
			throw new Error('Main template not found');
		}

		// Render the main template with the data contract
		// Note: The main template from datacontract-cli includes partial references
		// that are handled by nunjucks includes/macros, but we'll use a simpler approach
		// for browser compatibility by rendering individual sections
		
		// For now, let's render the information section using the downloaded template
		const informationTemplate = TEMPLATES['partials/datacontract_information.html'];
		
		if (informationTemplate) {
			const informationSection = env.renderString(informationTemplate, { datacontract });
			
			// Create a simple main wrapper that includes the information section
			const simpleMainTemplate = `
				<main class="pb-7">
					<div class="pt-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div>
							<div class="md:flex md:items-center md:justify-between px-4 sm:px-0">
								<div class="min-w-0 flex-1">
									<h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
										Data Contract
									</h2>
									<div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
										{% if datacontract.id %}{{ datacontract.id }}{% endif %}
									</div>
									{% if datacontract.tags and datacontract.tags|length > 0 %}
									<div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
										<div class="mt-2 flex items-center text-sm text-gray-500 whitespace-nowrap">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
												<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
											</svg>
											{% for tag in datacontract.tags %}
											<span class="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 mr-1">
												<span>{{ tag }}</span>
											</span>
											{% endfor %}
										</div>
									</div>
									{% endif %}
								</div>
							</div>
						</div>

						<div>
							<div class="space-y-6 mt-6">
								<section id="information">
									{{ information_section | safe }}
								</section>

								{% if datacontract.models and datacontract.models|length > 0 %}
								<section id="models">
									{{ models_section | safe }}
								</section>
								{% endif %}
							</div>
						</div>

						<div class="mt-6 text-sm text-gray-400">
							Created at {{ formatted_date }} with <a href="https://editor.datacontract.com" class="text-gray-400 hover:text-gray-500">Data Contract Editor</a>
						</div>
					</div>
				</main>
			`;
			
			// For models, use a simplified version until we can fully adapt the complex model rendering
			const modelsSection = datacontract.models ? env.renderString(`
				<div class="flex justify-between">
					<div class="px-4 sm:px-0">
						<h1 class="text-base font-semibold leading-6 text-gray-900">Data Model</h1>
						<p class="text-sm text-gray-500">The logical data model</p>
					</div>
				</div>

				{% for model_name, model in datacontract.models %}
				<div class="mt-3 flow-root">
					<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
								<table class="min-w-full divide-y divide-gray-300">
									<thead class="bg-gray-50">
										<tr>
											<th scope="colgroup" colspan="3" class="py-2 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
												<span>{{ model_name }}</span>
												{% if model.type %}<span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{{ model.type }}</span>{% endif %}
												{% if model.description %}<div class="text-sm font-medium text-gray-500">{{ model.description }}</div>{% endif %}
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200 bg-white">
										{% if model.fields %}
										{% for field_name, field in model.fields %}
										<tr>
											<td class="whitespace-nowrap py-2 pl-4 pr-2 text-sm font-medium text-gray-900 sm:pl-6 w-2/12">
												<div class="py-2 text-sm">
													<span class="font-mono">{{ field_name }}</span>
												</div>
											</td>
											<td class="whitespace-nowrap px-1 py-2 text-sm text-gray-500 w-1/12">
												{% if field.type %}{{ field.type }}{% endif %}
											</td>
											<td class="px-3 py-2 text-sm text-gray-500 w-7/12">
												{% if field.description %}<div class="text-gray-500">{{ field.description }}</div>{% else %}<div class="text-gray-400">No description</div>{% endif %}
												{% if field.example %}<div class="mt-1 italic">Example: <span class="font-mono">{{ field.example }}</span></div>{% endif %}
												<div>
													{% if field.primary %}<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">primary</span>{% endif %}
													{% if field.required %}<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">required</span>{% endif %}
													{% if field.unique %}<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">unique</span>{% endif %}
													{% if field.format %}<span class="inline-flex items-center rounded-md bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-1 mt-1">format:{{ field.format }}</span>{% endif %}
													{% if field.classification %}<span class="inline-flex items-center rounded-md bg-blue-50 px-1 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10 mr-1 mt-1">{{ field.classification }}</span>{% endif %}
													{% if field.pii %}<span class="inline-flex items-center rounded-md bg-yellow-50 px-1 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-500/10 mr-1 mt-1">PII</span>{% endif %}
												</div>
											</td>
										</tr>
										{% endfor %}
										{% endif %}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				{% endfor %}
			`, { datacontract }) : '';

			return env.renderString(simpleMainTemplate, {
				datacontract,
				information_section: informationSection,
				models_section: modelsSection,
				formatted_date: formattedDate
			});
		} else {
			// Fallback to a basic template if downloaded templates are not available
			throw new Error('Downloaded templates not available');
		}

	} catch (error) {
		// Return error HTML in case of failure
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
								<p>${String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

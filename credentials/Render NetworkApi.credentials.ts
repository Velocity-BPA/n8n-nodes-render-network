import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RenderNetworkApi implements ICredentialType {
	name = 'renderNetworkApi';
	displayName = 'Render Network API';
	documentationUrl = 'https://docs.rendernetwork.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from your Render Network dashboard',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.rendernetwork.com/v1',
			description: 'Base URL for the Render Network API',
		},
	];
}
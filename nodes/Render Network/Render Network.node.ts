/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-rendernetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RenderNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Render Network',
    name: 'rendernetwork',
    icon: 'file:rendernetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Render Network API',
    defaults: {
      name: 'Render Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'rendernetworkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'RenderJob',
            value: 'renderJob',
          },
          {
            name: 'Node',
            value: 'node',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'Pricing',
            value: 'pricing',
          }
        ],
        default: 'renderJob',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['renderJob'] } },
  options: [
    { name: 'Create Job', value: 'createJob', description: 'Submit a new rendering job', action: 'Create a rendering job' },
    { name: 'Get Job', value: 'getJob', description: 'Get details of a specific rendering job', action: 'Get a rendering job' },
    { name: 'List Jobs', value: 'listJobs', description: 'List all rendering jobs for the account', action: 'List rendering jobs' },
    { name: 'Update Job', value: 'updateJob', description: 'Update rendering job settings or priority', action: 'Update a rendering job' },
    { name: 'Cancel Job', value: 'cancelJob', description: 'Cancel a pending or running rendering job', action: 'Cancel a rendering job' },
    { name: 'Restart Job', value: 'restartJob', description: 'Restart a failed or cancelled job', action: 'Restart a rendering job' }
  ],
  default: 'createJob',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['node'] } },
	options: [
		{ name: 'List Nodes', value: 'listNodes', description: 'List available GPU nodes and their specifications', action: 'List nodes' },
		{ name: 'Get Node', value: 'getNode', description: 'Get details of a specific GPU node', action: 'Get node details' },
		{ name: 'Get Node Stats', value: 'getNodeStats', description: 'Get network-wide node statistics and availability', action: 'Get node statistics' },
		{ name: 'Reserve Node', value: 'reserveNode', description: 'Reserve a specific node for rendering', action: 'Reserve node' },
	],
	default: 'listNodes',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account details and current RNDR balance', action: 'Get account details' },
    { name: 'Get Usage', value: 'getUsage', description: 'Get account usage statistics and billing information', action: 'Get account usage' },
    { name: 'Get Transactions', value: 'getTransactions', description: 'List RNDR token transactions and payments', action: 'Get account transactions' },
    { name: 'Deposit Tokens', value: 'depositTokens', description: 'Deposit RNDR tokens to account balance', action: 'Deposit tokens' },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asset'] } },
  options: [
    { name: 'Upload Asset', value: 'uploadAsset', description: 'Upload scene files, textures, or other rendering assets', action: 'Upload asset' },
    { name: 'Get Asset', value: 'getAsset', description: 'Get details and download URL for a specific asset', action: 'Get asset' },
    { name: 'List Assets', value: 'listAssets', description: 'List all uploaded assets for the account', action: 'List assets' },
    { name: 'Update Asset', value: 'updateAsset', description: 'Update asset metadata or description', action: 'Update asset' },
    { name: 'Delete Asset', value: 'deleteAsset', description: 'Delete an uploaded asset from storage', action: 'Delete asset' },
    { name: 'Download Asset', value: 'downloadAsset', description: 'Get secure download URL for asset', action: 'Download asset' },
  ],
  default: 'uploadAsset',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['pricing'],
		},
	},
	options: [
		{
			name: 'Get Pricing',
			value: 'getPricing',
			description: 'Get current RNDR pricing for different GPU types',
			action: 'Get pricing information',
		},
		{
			name: 'Estimate Price',
			value: 'estimatePrice',
			description: 'Estimate rendering cost for a job',
			action: 'Estimate rendering cost',
		},
		{
			name: 'Get Pricing History',
			value: 'getPricingHistory',
			description: 'Get historical pricing data',
			action: 'Get pricing history',
		},
	],
	default: 'getPricing',
},
{
  displayName: 'Scene File',
  name: 'sceneFile',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['renderJob'], operation: ['createJob'] } },
  default: '',
  description: 'Path or URL to the scene file (Blender, Cinema 4D, etc.)',
},
{
  displayName: 'Render Settings',
  name: 'renderSettings',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['renderJob'], operation: ['createJob'] } },
  default: '{}',
  description: 'Rendering configuration settings as JSON object',
},
{
  displayName: 'Priority',
  name: 'priority',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['renderJob'], operation: ['createJob', 'updateJob'] } },
  options: [
    { name: 'Low', value: 'low' },
    { name: 'Normal', value: 'normal' },
    { name: 'High', value: 'high' },
    { name: 'Urgent', value: 'urgent' }
  ],
  default: 'normal',
  description: 'Priority level for the rendering job',
},
{
  displayName: 'Estimated Frames',
  name: 'estimatedFrames',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['renderJob'], operation: ['createJob'] } },
  default: 1,
  description: 'Estimated number of frames to render',
},
{
  displayName: 'Job ID',
  name: 'jobId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['renderJob'], operation: ['getJob', 'updateJob', 'cancelJob', 'restartJob'] } },
  default: '',
  description: 'The ID of the rendering job',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['renderJob'], operation: ['listJobs'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'Running', value: 'running' },
    { name: 'Completed', value: 'completed' },
    { name: 'Failed', value: 'failed' },
    { name: 'Cancelled', value: 'cancelled' }
  ],
  default: '',
  description: 'Filter jobs by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['renderJob'], operation: ['listJobs'] } },
  default: 50,
  description: 'Maximum number of jobs to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['renderJob'], operation: ['listJobs'] } },
  default: 0,
  description: 'Number of jobs to skip',
},
{
	displayName: 'GPU Type',
	name: 'gpuType',
	type: 'string',
	default: '',
	placeholder: 'RTX 3080',
	description: 'Filter nodes by GPU type',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['listNodes'],
		},
	},
},
{
	displayName: 'Availability',
	name: 'availability',
	type: 'options',
	options: [
		{ name: 'Available', value: 'available' },
		{ name: 'Busy', value: 'busy' },
		{ name: 'All', value: 'all' },
	],
	default: 'all',
	description: 'Filter nodes by availability status',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['listNodes'],
		},
	},
},
{
	displayName: 'Region',
	name: 'region',
	type: 'string',
	default: '',
	placeholder: 'us-west-1',
	description: 'Filter nodes by region',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['listNodes'],
		},
	},
},
{
	displayName: 'Node ID',
	name: 'nodeId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'node_123456',
	description: 'The unique identifier of the node',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['getNode'],
		},
	},
},
{
	displayName: 'Node ID',
	name: 'nodeId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'node_123456',
	description: 'The unique identifier of the node to reserve',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['reserveNode'],
		},
	},
},
{
	displayName: 'Duration',
	name: 'duration',
	type: 'number',
	required: true,
	default: 1,
	description: 'Duration to reserve the node (in hours)',
	displayOptions: {
		show: {
			resource: ['node'],
			operation: ['reserveNode'],
		},
	},
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['account'], operation: ['getUsage'] } },
  default: '',
  description: 'Start date for usage statistics (ISO 8601 format)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['account'], operation: ['getUsage'] } },
  default: '',
  description: 'End date for usage statistics (ISO 8601 format)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions'] } },
  default: 50,
  typeOptions: { minValue: 1, maxValue: 1000 },
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions'] } },
  default: 0,
  typeOptions: { minValue: 0 },
  description: 'Number of transactions to skip',
},
{
  displayName: 'Transaction Type',
  name: 'transactionType',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getTransactions'] } },
  options: [
    { name: 'All', value: 'all' },
    { name: 'Deposit', value: 'deposit' },
    { name: 'Withdrawal', value: 'withdrawal' },
    { name: 'Payment', value: 'payment' },
    { name: 'Refund', value: 'refund' },
  ],
  default: 'all',
  description: 'Filter transactions by type',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['depositTokens'] } },
  required: true,
  default: 0,
  typeOptions: { minValue: 0.000001 },
  description: 'Amount of RNDR tokens to deposit',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['depositTokens'] } },
  required: true,
  default: '',
  description: 'Blockchain transaction hash for the RNDR token transfer',
},
{
  displayName: 'Asset File',
  name: 'file',
  type: 'string',
  displayOptions: { show: { resource: ['asset'], operation: ['uploadAsset'] } },
  default: '',
  required: true,
  description: 'The file to upload as an asset',
},
{
  displayName: 'Asset Type',
  name: 'asset_type',
  type: 'options',
  displayOptions: { show: { resource: ['asset'], operation: ['uploadAsset'] } },
  options: [
    { name: 'Scene File', value: 'scene' },
    { name: 'Texture', value: 'texture' },
    { name: 'Model', value: 'model' },
    { name: 'Other', value: 'other' },
  ],
  default: 'scene',
  required: true,
  description: 'The type of asset being uploaded',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: { show: { resource: ['asset'], operation: ['uploadAsset', 'updateAsset'] } },
  default: '',
  description: 'Description of the asset',
},
{
  displayName: 'Asset ID',
  name: 'asset_id',
  type: 'string',
  displayOptions: { show: { resource: ['asset'], operation: ['getAsset', 'updateAsset', 'deleteAsset', 'downloadAsset'] } },
  default: '',
  required: true,
  description: 'The ID of the asset',
},
{
  displayName: 'Asset Type Filter',
  name: 'asset_type',
  type: 'options',
  displayOptions: { show: { resource: ['asset'], operation: ['listAssets'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Scene File', value: 'scene' },
    { name: 'Texture', value: 'texture' },
    { name: 'Model', value: 'model' },
    { name: 'Other', value: 'other' },
  ],
  default: '',
  description: 'Filter assets by type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['asset'], operation: ['listAssets'] } },
  default: 10,
  description: 'Number of assets to return (max 100)',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['asset'], operation: ['listAssets'] } },
  default: 0,
  description: 'Number of assets to skip',
},
{
  displayName: 'Tags',
  name: 'tags',
  type: 'string',
  displayOptions: { show: { resource: ['asset'], operation: ['updateAsset'] } },
  default: '',
  description: 'Comma-separated tags for the asset',
},
{
	displayName: 'GPU Type',
	name: 'gpuType',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['getPricing', 'estimatePrice', 'getPricingHistory'],
		},
	},
	options: [
		{ name: 'RTX 3070', value: 'rtx3070' },
		{ name: 'RTX 3080', value: 'rtx3080' },
		{ name: 'RTX 3090', value: 'rtx3090' },
		{ name: 'RTX 4070', value: 'rtx4070' },
		{ name: 'RTX 4080', value: 'rtx4080' },
		{ name: 'RTX 4090', value: 'rtx4090' },
		{ name: 'Tesla V100', value: 'v100' },
		{ name: 'Tesla A100', value: 'a100' },
	],
	default: 'rtx3080',
	description: 'Type of GPU to get pricing for',
},
{
	displayName: 'Region',
	name: 'region',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['getPricing'],
		},
	},
	options: [
		{ name: 'North America', value: 'na' },
		{ name: 'Europe', value: 'eu' },
		{ name: 'Asia Pacific', value: 'ap' },
		{ name: 'Global', value: 'global' },
	],
	default: 'global',
	description: 'Region to get pricing for',
},
{
	displayName: 'Estimated Hours',
	name: 'estimatedHours',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['estimatePrice'],
		},
	},
	default: 1,
	description: 'Estimated number of hours for rendering',
	typeOptions: {
		minValue: 0.1,
		maxValue: 1000,
	},
},
{
	displayName: 'Number of Frames',
	name: 'frames',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['estimatePrice'],
		},
	},
	default: 1,
	description: 'Number of frames to render',
	typeOptions: {
		minValue: 1,
		maxValue: 10000,
	},
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['getPricingHistory'],
		},
	},
	default: '',
	description: 'Start date for pricing history',
	required: true,
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['pricing'],
			operation: ['getPricingHistory'],
		},
	},
	default: '',
	description: 'End date for pricing history',
	required: true,
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'renderJob':
        return [await executeRenderJobOperations.call(this, items)];
      case 'node':
        return [await executeNodeOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'asset':
        return [await executeAssetOperations.call(this, items)];
      case 'pricing':
        return [await executePricingOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeRenderJobOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendernetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createJob': {
          const sceneFile = this.getNodeParameter('sceneFile', i) as string;
          const renderSettings = this.getNodeParameter('renderSettings', i) as string;
          const priority = this.getNodeParameter('priority', i) as string;
          const estimatedFrames = this.getNodeParameter('estimatedFrames', i) as number;

          const body = {
            scene_file: sceneFile,
            render_settings: JSON.parse(renderSettings),
            priority,
            estimated_frames: estimatedFrames,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/jobs`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jobs/${jobId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listJobs': {
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (status) params.append('status', status);
          params.append('limit', limit.toString());
          params.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jobs?${params.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const priority = this.getNodeParameter('priority', i) as string;

          const body: any = {};
          if (priority) body.priority = priority;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/jobs/${jobId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/jobs/${jobId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'restartJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/jobs/${jobId}/restart`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeNodeOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rendernetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listNodes': {
					const gpuType = this.getNodeParameter('gpuType', i) as string;
					const availability = this.getNodeParameter('availability', i) as string;
					const region = this.getNodeParameter('region', i) as string;

					const params = new URLSearchParams();
					if (gpuType) params.append('gpu_type', gpuType);
					if (availability && availability !== 'all') params.append('availability', availability);
					if (region) params.append('region', region);

					const queryString = params.toString();
					const url = queryString ? `${credentials.baseUrl}/nodes?${queryString}` : `${credentials.baseUrl}/nodes`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNode': {
					const nodeId = this.getNodeParameter('nodeId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/nodes/${nodeId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNodeStats': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/nodes/stats`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'reserveNode': {
					const nodeId = this.getNodeParameter('nodeId', i) as string;
					const duration = this.getNodeParameter('duration', i) as number;

					const body = {
						duration,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/nodes/${nodeId}/reserve`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendernetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccount': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUsage': {
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          
          const queryParams = new URLSearchParams();
          if (startDate) queryParams.append('start_date', startDate);
          if (endDate) queryParams.append('end_date', endDate);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/usage${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const transactionType = this.getNodeParameter('transactionType', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          if (transactionType && transactionType !== 'all') {
            queryParams.append('transaction_type', transactionType);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/transactions?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'depositTokens': {
          const amount = this.getNodeParameter('amount', i) as number;
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/account/deposit`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              amount: amount,
              transaction_hash: transactionHash,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAssetOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rendernetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'uploadAsset': {
          const file = this.getNodeParameter('file', i) as string;
          const assetType = this.getNodeParameter('asset_type', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          
          const formData = {
            file,
            asset_type: assetType,
            description,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/assets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            formData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAsset': {
          const assetId = this.getNodeParameter('asset_id', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'listAssets': {
          const assetType = this.getNodeParameter('asset_type', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams = new URLSearchParams();
          if (assetType) queryParams.append('asset_type', assetType);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/assets?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateAsset': {
          const assetId = this.getNodeParameter('asset_id', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const tags = this.getNodeParameter('tags', i, '') as string;
          
          const body: any = {};
          if (description) body.description = description;
          if (tags) body.tags = tags.split(',').map((tag: string) => tag.trim());
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'deleteAsset': {
          const assetId = this.getNodeParameter('asset_id', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'downloadAsset': {
          const assetId = this.getNodeParameter('asset_id', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/assets/${assetId}/download`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executePricingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rendernetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getPricing': {
					const gpuType = this.getNodeParameter('gpuType', i) as string;
					const region = this.getNodeParameter('region', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pricing`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							gpu_type: gpuType,
							region: region,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'estimatePrice': {
					const gpuType = this.getNodeParameter('gpuType', i) as string;
					const estimatedHours = this.getNodeParameter('estimatedHours', i) as number;
					const frames = this.getNodeParameter('frames', i) as number;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pricing/estimate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							gpu_type: gpuType,
							estimated_hours: estimatedHours,
							frames: frames,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPricingHistory': {
					const gpuType = this.getNodeParameter('gpuType', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pricing/history`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							gpu_type: gpuType,
							start_date: startDate,
							end_date: endDate,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

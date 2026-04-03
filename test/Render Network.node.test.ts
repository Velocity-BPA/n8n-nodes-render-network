/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RenderNetwork } from '../nodes/Render Network/Render Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RenderNetwork Node', () => {
  let node: RenderNetwork;

  beforeAll(() => {
    node = new RenderNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Render Network');
      expect(node.description.name).toBe('rendernetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('RenderJob Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.rendernetwork.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('createJob operation', () => {
    it('should create a rendering job successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createJob')
        .mockReturnValueOnce('scene.blend')
        .mockReturnValueOnce('{"resolution": "1920x1080"}')
        .mockReturnValueOnce('normal')
        .mockReturnValueOnce(100);

      const mockResponse = { id: 'job123', status: 'pending' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle createJob errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createJob');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getJob operation', () => {
    it('should get job details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getJob')
        .mockReturnValueOnce('job123');

      const mockResponse = { id: 'job123', status: 'running' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('listJobs operation', () => {
    it('should list jobs successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listJobs')
        .mockReturnValueOnce('running')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      const mockResponse = { jobs: [], total: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateJob operation', () => {
    it('should update job successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateJob')
        .mockReturnValueOnce('job123')
        .mockReturnValueOnce('high');

      const mockResponse = { id: 'job123', priority: 'high' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('cancelJob operation', () => {
    it('should cancel job successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('cancelJob')
        .mockReturnValueOnce('job123');

      const mockResponse = { id: 'job123', status: 'cancelled' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('restartJob operation', () => {
    it('should restart job successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('restartJob')
        .mockReturnValueOnce('job123');

      const mockResponse = { id: 'job123', status: 'pending' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRenderJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Node Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.rendernetwork.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('listNodes operation', () => {
		it('should list nodes successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listNodes')
				.mockReturnValueOnce('RTX 3080')
				.mockReturnValueOnce('available')
				.mockReturnValueOnce('us-west-1');

			const mockResponse = {
				nodes: [
					{ id: 'node_1', gpu_type: 'RTX 3080', status: 'available' },
					{ id: 'node_2', gpu_type: 'RTX 3080', status: 'available' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.rendernetwork.com/v1/nodes?gpu_type=RTX+3080&availability=available&region=us-west-1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle list nodes error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('listNodes');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getNode operation', () => {
		it('should get node details successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getNode')
				.mockReturnValueOnce('node_123');

			const mockResponse = {
				id: 'node_123',
				gpu_type: 'RTX 3080',
				status: 'available',
				specs: { memory: '10GB', cores: 8704 },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle get node error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNode');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Node not found'));

			await expect(executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Node not found');
		});
	});

	describe('getNodeStats operation', () => {
		it('should get node stats successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeStats');

			const mockResponse = {
				total_nodes: 1500,
				available_nodes: 320,
				busy_nodes: 1180,
				gpu_distribution: { 'RTX 3080': 500, 'RTX 3090': 400 },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle get node stats error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeStats');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Stats unavailable'));

			await expect(executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Stats unavailable');
		});
	});

	describe('reserveNode operation', () => {
		it('should reserve node successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('reserveNode')
				.mockReturnValueOnce('node_123')
				.mockReturnValueOnce(2);

			const mockResponse = {
				reservation_id: 'res_456',
				node_id: 'node_123',
				duration: 2,
				expires_at: '2023-12-01T12:00:00Z',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.rendernetwork.com/v1/nodes/node_123/reserve',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: { duration: 2 },
				json: true,
			});
		});

		it('should handle reserve node error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('reserveNode');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient RNDR balance'));

			await expect(executeNodeOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Insufficient RNDR balance');
		});
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key', 
        baseUrl: 'https://api.rendernetwork.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account details successfully', async () => {
      const mockResponse = {
        id: 'account123',
        balance: 100.5,
        currency: 'RNDR',
        email: 'test@example.com'
      };

      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rendernetwork.com/v1/account',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAccount errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccount');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUsage operation', () => {
    it('should get usage statistics successfully', async () => {
      const mockResponse = {
        total_compute_hours: 25.5,
        total_cost: 50.25,
        period: '2023-11-01 to 2023-11-30'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUsage')
        .mockReturnValueOnce('2023-11-01T00:00:00Z')
        .mockReturnValueOnce('2023-11-30T23:59:59Z');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransactions operation', () => {
    it('should get transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          { id: 'tx1', type: 'deposit', amount: 100 },
          { id: 'tx2', type: 'payment', amount: -25 }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactions')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('all');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('depositTokens operation', () => {
    it('should deposit tokens successfully', async () => {
      const mockResponse = {
        transaction_id: 'dep123',
        amount: 100,
        status: 'confirmed'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('depositTokens')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('0x123abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.rendernetwork.com/v1/account/deposit',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          amount: 100,
          transaction_hash: '0x123abcdef',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle depositTokens errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('depositTokens')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('0x123abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient balance'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Insufficient balance' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Asset Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.rendernetwork.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('uploadAsset operation', () => {
    it('should upload asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('uploadAsset')
        .mockReturnValueOnce('scene_file.blend')
        .mockReturnValueOnce('scene')
        .mockReturnValueOnce('Test scene file');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'asset_123',
        filename: 'scene_file.blend',
        asset_type: 'scene'
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.id).toBe('asset_123');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.rendernetwork.com/v1/assets',
        headers: { 'Authorization': 'Bearer test-key' },
        formData: {
          file: 'scene_file.blend',
          asset_type: 'scene',
          description: 'Test scene file'
        },
        json: true
      });
    });

    it('should handle upload error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('uploadAsset')
        .mockReturnValueOnce('scene_file.blend')
        .mockReturnValueOnce('scene')
        .mockReturnValueOnce('Test scene file');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Upload failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Upload failed');
    });
  });

  describe('getAsset operation', () => {
    it('should get asset details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAsset')
        .mockReturnValueOnce('asset_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'asset_123',
        filename: 'scene.blend',
        download_url: 'https://download.example.com/scene.blend'
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.id).toBe('asset_123');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rendernetwork.com/v1/assets/asset_123',
        headers: { 'Authorization': 'Bearer test-key' },
        json: true
      });
    });
  });

  describe('listAssets operation', () => {
    it('should list assets successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAssets')
        .mockReturnValueOnce('scene')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        assets: [{ id: 'asset_1' }, { id: 'asset_2' }],
        total: 2
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.assets).toHaveLength(2);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rendernetwork.com/v1/assets?asset_type=scene&limit=10&offset=0',
        headers: { 'Authorization': 'Bearer test-key' },
        json: true
      });
    });
  });

  describe('updateAsset operation', () => {
    it('should update asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateAsset')
        .mockReturnValueOnce('asset_123')
        .mockReturnValueOnce('Updated description')
        .mockReturnValueOnce('tag1, tag2');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'asset_123',
        description: 'Updated description',
        tags: ['tag1', 'tag2']
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.description).toBe('Updated description');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.rendernetwork.com/v1/assets/asset_123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: {
          description: 'Updated description',
          tags: ['tag1', 'tag2']
        },
        json: true
      });
    });
  });

  describe('deleteAsset operation', () => {
    it('should delete asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteAsset')
        .mockReturnValueOnce('asset_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        message: 'Asset deleted successfully'
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.success).toBe(true);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.rendernetwork.com/v1/assets/asset_123',
        headers: { 'Authorization': 'Bearer test-key' },
        json: true
      });
    });
  });

  describe('downloadAsset operation', () => {
    it('should get download URL successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('downloadAsset')
        .mockReturnValueOnce('asset_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        download_url: 'https://secure-download.example.com/asset_123',
        expires_at: '2024-01-01T00:00:00Z'
      });

      const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.download_url).toContain('asset_123');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.rendernetwork.com/v1/assets/asset_123/download',
        headers: { 'Authorization': 'Bearer test-key' },
        json: true
      });
    });
  });
});

describe('Pricing Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.rendernetwork.com/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getPricing operation', () => {
		it('should get pricing successfully', async () => {
			const mockPricingData = {
				gpu_type: 'rtx3080',
				region: 'global',
				price_per_hour: 0.85,
				currency: 'RNDR'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPricing')
				.mockReturnValueOnce('rtx3080')
				.mockReturnValueOnce('global');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPricingData);

			const result = await executePricingOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockPricingData);
		});

		it('should handle pricing errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPricing')
				.mockReturnValueOnce('rtx3080')
				.mockReturnValueOnce('global');
			
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Pricing service unavailable'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePricingOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json.error).toBe('Pricing service unavailable');
		});
	});

	describe('estimatePrice operation', () => {
		it('should estimate price successfully', async () => {
			const mockEstimate = {
				gpu_type: 'rtx3080',
				estimated_hours: 2,
				frames: 100,
				total_cost: 1.70,
				currency: 'RNDR'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('estimatePrice')
				.mockReturnValueOnce('rtx3080')
				.mockReturnValueOnce(2)
				.mockReturnValueOnce(100);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEstimate);

			const result = await executePricingOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockEstimate);
		});
	});

	describe('getPricingHistory operation', () => {
		it('should get pricing history successfully', async () => {
			const mockHistory = {
				gpu_type: 'rtx3080',
				start_date: '2023-01-01',
				end_date: '2023-01-31',
				price_points: [
					{ date: '2023-01-01', price: 0.80 },
					{ date: '2023-01-15', price: 0.85 },
					{ date: '2023-01-31', price: 0.90 }
				]
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPricingHistory')
				.mockReturnValueOnce('rtx3080')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-01-31');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockHistory);

			const result = await executePricingOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockHistory);
		});
	});
});
});

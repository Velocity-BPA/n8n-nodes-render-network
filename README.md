# n8n-nodes-render-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Render Network, enabling automated management of cloud rendering infrastructure through 5 core resources. Access render jobs, compute nodes, account information, digital assets, and pricing data to streamline your cloud rendering workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Render Network](https://img.shields.io/badge/Render-Network-purple)
![Cloud Rendering](https://img.shields.io/badge/Cloud-Rendering-green)
![GPU Computing](https://img.shields.io/badge/GPU-Computing-orange)

## Features

- **Complete Render Job Management** - Create, monitor, update, and cancel rendering jobs with full lifecycle control
- **Node Infrastructure Control** - Manage compute nodes, check availability, and optimize resource allocation
- **Account & Billing Integration** - Access account details, usage statistics, and billing information
- **Digital Asset Management** - Upload, organize, and manage rendering assets and output files
- **Dynamic Pricing Intelligence** - Retrieve real-time pricing for different node types and rendering configurations
- **Robust Error Handling** - Comprehensive error management with detailed status reporting
- **Flexible Authentication** - Secure API key-based authentication with proper credential management
- **Production-Ready Operations** - Built for enterprise workflows with comprehensive logging and monitoring

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-render-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-render-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-render-network.git
cd n8n-nodes-render-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-render-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Render Network API key from account settings | Yes |
| Environment | API environment (production/staging) | Yes |

## Resources & Operations

### 1. RenderJob

| Operation | Description |
|-----------|-------------|
| Create | Submit a new rendering job with scene files and parameters |
| Get | Retrieve details of a specific render job by ID |
| List | Get all render jobs with optional filtering and pagination |
| Update | Modify render job settings or parameters |
| Cancel | Stop a running render job |
| Get Status | Check current status and progress of render job |
| Get Output | Download completed render output files |

### 2. Node

| Operation | Description |
|-----------|-------------|
| List | Get all available compute nodes with specifications |
| Get | Retrieve detailed information about a specific node |
| Get Availability | Check real-time availability of compute nodes |
| Get Performance | Retrieve performance metrics and benchmarks |
| Filter by Type | List nodes filtered by GPU type or capabilities |
| Get Location | Retrieve geographic location and latency information |

### 3. Account

| Operation | Description |
|-----------|-------------|
| Get Profile | Retrieve account profile information and settings |
| Get Balance | Check current account balance and credits |
| Get Usage | Get usage statistics and consumption metrics |
| Update Profile | Modify account settings and preferences |
| Get Billing | Retrieve billing history and payment information |
| Get Limits | Check account limits and quotas |

### 4. Asset

| Operation | Description |
|-----------|-------------|
| Upload | Upload scene files, textures, and other rendering assets |
| Download | Download assets or rendered output files |
| List | Get all uploaded assets with metadata |
| Delete | Remove assets from storage |
| Get Info | Retrieve asset metadata and file information |
| Update Metadata | Modify asset tags, descriptions, and properties |

### 5. Pricing

| Operation | Description |
|-----------|-------------|
| Get Node Pricing | Retrieve current pricing for different node types |
| Get Job Estimate | Calculate cost estimate for a rendering job |
| Get Historical | Access historical pricing data and trends |
| Get Discounts | Check available discounts and promotional pricing |
| Compare Options | Compare pricing across different rendering configurations |

## Usage Examples

```javascript
// Create a new render job
const renderJob = {
  "name": "Product Animation Render",
  "scene_file": "product_animation.blend",
  "frame_start": 1,
  "frame_end": 120,
  "node_type": "RTX_4090",
  "priority": "high"
};
```

```javascript
// Check available nodes and pricing
const availableNodes = await $('Render Network').first().json.nodes;
const pricing = await $('Render Network').first().json.pricing;
const selectedNode = availableNodes.filter(node => 
  node.gpu_type === 'RTX_4090' && node.available === true
)[0];
```

```javascript
// Monitor render job progress
const jobId = $('Render Network').first().json.job_id;
const jobStatus = {
  "id": jobId,
  "status": "rendering",
  "progress": 75,
  "estimated_completion": "2024-01-15T14:30:00Z"
};
```

```javascript
// Upload assets and start rendering
const assetUpload = {
  "file_path": "/scenes/architecture_project.blend",
  "file_type": "blender",
  "tags": ["architecture", "interior", "4k"],
  "project_id": "proj_abc123"
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in Render Network account settings |
| Insufficient Balance | Account balance too low for requested operation | Add credits to account or reduce job scope |
| Node Unavailable | Requested compute node type is not available | Choose different node type or retry later |
| File Upload Failed | Asset upload encountered an error | Check file size limits and network connection |
| Job Queue Full | Render job queue has reached capacity | Wait for queue to clear or use higher priority |
| Invalid Parameters | Job configuration contains invalid settings | Review render parameters and scene requirements |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-render-network/issues)
- **Render Network Docs**: [Render Network API Documentation](https://docs.rendernetwork.com)
- **Community Forum**: [Render Network Community](https://community.rendernetwork.com)
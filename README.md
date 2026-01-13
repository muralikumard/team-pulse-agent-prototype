
# TeamPulse Agent

> A lightweight team accomplishment tracker for managers and team leaders with Azure Active Directory authentication and AI-powered summaries.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Azure](https://img.shields.io/badge/Azure-Ready-0078D4?logo=microsoft-azure)](https://azure.microsoft.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)

---

## 🎉 **100% Client-Side Application - Zero Backend Required!**

> **✨ Perfect for managers who want to start tracking accomplishments immediately without IT approval, infrastructure costs, or data security concerns.**

**TeamPulse Agent is a purely client-side application** that runs entirely in your browser:

- ✅ **No Backend Infrastructure** - No servers, databases, or cloud storage required
- ✅ **No Data Security Risks** - All data stays in your browser's localStorage on your device
- ✅ **Zero Ongoing Costs** - Completely free to run (except optional Azure OpenAI for AI summaries)
- ✅ **Instant Start** - Deploy once to Azure Storage (~$0.01/month) and share the URL with your team
- ✅ **Complete Privacy** - Your team's accomplishments never leave individual browsers
- ✅ **No IT Approval Needed** - No backend means no compliance reviews or security audits

**Future releases** will add optional backend storage for team sharing, but the current version is intentionally designed for **maximum simplicity and zero dependencies**.

---

## 🎯 Overview

TeamPulse Agent helps managers and team leaders track team accomplishments and generate executive summaries for meetings, reviews, and reports. Built with enterprise-grade security through Azure AD integration and optional AI-powered insights via Azure OpenAI.

### Key Features

- **🔐 Azure AD Authentication** - Secure single sign-on with Microsoft accounts
- **👤 User Profiles** - Automatic integration with Microsoft Graph API
- **📝 Quick Entry** - Log accomplishments with title, date, category, contributors, and description
- **🔍 Smart Filtering** - Filter by date ranges, search, and preset periods (quarters, semesters)
- **🤖 AI Summaries** - Generate executive summaries using Azure OpenAI via secure API
- **🔒 Managed Identity** - API layer uses Managed Identity for secure OpenAI access (no exposed keys)
- **💾 Browser-Based Storage** - All data stored locally in your browser (100% private, zero cost)
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **⚡ Serverless API** - Azure Functions API layer that scales automatically

### Architecture

```
Frontend (React/Vite) → Azure Functions API → Azure OpenAI (via Managed Identity)
                                              ↓
                                       No API keys exposed
```

**Security Benefits:**
- API keys never sent to the browser
- Managed Identity authentication (no credentials in code)
- Centralized access control and monitoring
- RBAC-based permissions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Azure subscription ([free trial available](https://azure.microsoft.com/free/))
- Azure Active Directory tenant

### 1. Clone and Install

```bash
git clone https://github.com/mkuma_microsoft/prompt-to-prototype-challenge.git
cd prompt-to-prototype-challenge
npm install
```

### 2. Configure Azure AD

Create an app registration in Azure AD and get your Client ID and Tenant ID.

Create `.env.local`:

```env
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
VITE_REDIRECT_URI=http://localhost:5174
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5174
```

See the **[Getting Started Guide](docs/GETTING_STARTED.md)** for detailed setup instructions.

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:5174 in your browser.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[Getting Started](docs/GETTING_STARTED.md)** | Complete setup guide for Azure AD and OpenAI |
| **[API Setup](docs/API_SETUP.md)** | Configure API layer with Managed Identity |
| **[Deployment Guide](docs/DEPLOYMENT.md)** | Deploy to Azure (Storage, Static Web Apps, etc.) |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Common issues and solutions |
| **[Product Spec](docs/TeamPulseAgent_PRD.md)** | Product requirements document |
| **[Archive](docs/ARCHIVE.md)** | Historical notes and implementation details |

---

## 🏗️ Project Structure

```
prompt-to-prototype-challenge/
├── api/                       # Azure Functions API layer (NEW)
│   ├── generateSummary.js    # OpenAI proxy with Managed Identity
│   ├── package.json          # API dependencies
│   ├── host.json             # Functions configuration
│   └── README.md             # API documentation
├── docs/                      # Documentation
│   ├── GETTING_STARTED.md    # Complete setup guide
│   ├── API_SETUP.md          # API layer with Managed Identity
│   ├── DEPLOYMENT.md         # Deployment guide
│   ├── TROUBLESHOOTING.md    # Common issues
│   ├── TeamPulseAgent_PRD.md # Product specification
│   └── ARCHIVE.md            # Historical notes
├── scripts/                   # Deployment scripts
│   ├── deploy-to-storage.sh  # Deploy to Azure Storage
│   ├── deploy-to-azure.sh    # Deploy to Static Web Apps
│   └── deploy-update.sh      # Quick update script
├── src/                       # Application source code
│   ├── components/           # React components
│   ├── services/             # Service layer (NEW)
│   │   └── openAIClient.js   # API client for OpenAI calls
│   ├── utils/                # Utility functions
│   ├── azureAdConfig.js      # Azure AD configuration
│   ├── azureConfig.js        # Azure OpenAI configuration (legacy)
│   ├── App.jsx               # Main application
│   └── main.jsx              # Entry point
├── .azure/                    # Azure-specific configs
├── public/                    # Static assets
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

---

## 🌐 Deployment

### Quick Deploy to Azure Storage (Recommended)

```bash
./scripts/deploy-to-storage.sh
```

**Cost**: ~$0.01-0.10 per month

### Other Options

- **Azure Static Web Apps** - With CI/CD automation
- **Azure App Service** - More features and control
- **Manual Deployment** - For restricted environments

See the **[Deployment Guide](docs/DEPLOYMENT.md)** for complete instructions.

---

## 💡 Usage

### Adding Accomplishments

1. Sign in with your Microsoft account
2. Click "Add Accomplishment" button
3. Fill in the form (title, date, category, contributors, description)
4. Click "Add Accomplishment"

### Generating Summaries

1. Filter accomplishments by desired date range
2. Scroll to "AI Summary Generation" section
3. Select AI model and click "Generate AI Summary"
4. Copy or export the formatted summary

---

## 🔧 Configuration

### 💾 Data Storage Architecture

**Current Version (v1.0)**: 100% Client-Side

TeamPulse Agent stores all accomplishment data in your browser's `localStorage`:

- ✅ **Private & Secure** - Data never leaves your device
- ✅ **No Server Required** - Zero backend infrastructure
- ✅ **Zero Storage Costs** - Completely free
- ✅ **GDPR Compliant** - No data collection or transmission
- ℹ️ **Per-Device Storage** - Each user's data is on their own device

**Future Releases**: Optional Backend Storage

Planned enhancements for team collaboration:
- **Shared Team Storage** - Optional Azure Storage/Cosmos DB integration
- **Cross-Device Sync** - Access your accomplishments from any device
- **Team Dashboards** - Aggregate view of team accomplishments
- **Data Export/Import** - Transfer data between devices

> **💡 Why Start Client-Side?** This approach lets managers start tracking accomplishments immediately without requiring IT approval, infrastructure setup, or security reviews. Once you see value, you can upgrade to backend storage for team collaboration.

### AI Models

Available models (requires Azure OpenAI setup):
- **GPT-4o** - Latest and most capable
- **GPT-4** - High quality reasoning  
- **GPT-3.5 Turbo** - Fast and cost-effective

See [API Setup Guide](docs/API_SETUP.md) for configuration.

---

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 + Vite
- **Authentication**: MSAL (Microsoft Authentication Library)
- **AI**: Azure OpenAI SDK
- **APIs**: Microsoft Graph API

### Build Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔒 Security

- ✅ Azure AD authentication with single sign-on
- ✅ Managed Identity for OpenAI access (no exposed keys)
- ✅ Token-based authorization
- ✅ HTTPS enforcement in production
- ✅ RBAC-based access control

See [Getting Started - Security Best Practices](docs/GETTING_STARTED.md#security-best-practices)

---

## 📊 Cost Estimation

### Current Version (Client-Side Only)

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| **Application Hosting** | $0.01-0.10 | Azure Storage static website (one-time deploy) |
| **Data Storage** | **$0** | Browser localStorage (no backend required) |
| **Azure AD** | **$0** | Free tier (included with Microsoft 365) |
| **Azure OpenAI** | $0.50-5 | Optional - only if using AI summaries |

**Total Cost**: ~$0.01-0.10/month (or $0 with Static Web Apps free tier)

### Future Version (With Backend Storage)

| Service | Monthly Cost |
|---------|--------------||
| **Azure Storage + Cosmos DB** | $5-25 |
| **Azure OpenAI** | $0.50-5 (usage-based) |

> **💰 Cost Advantage**: The current client-side architecture means you can deploy TeamPulse Agent for dozens of managers at essentially **zero ongoing cost**.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙋 Support

- **Getting Started**: [Setup Guide](docs/GETTING_STARTED.md)
- **Common Issues**: [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- **Deployment Help**: [Deployment Guide](docs/DEPLOYMENT.md)
- **API Configuration**: [API Setup Guide](docs/API_SETUP.md)

---

**Last Updated**: December 2025  
**Version**: 1.0.0

# TeamPulse Agent - Documentation Index

Quick reference guide to all documentation.

---

## 📖 Core Documentation

### [Getting Started](GETTING_STARTED.md)
**Start here!** Complete setup guide covering:
- Azure AD authentication setup
- Azure OpenAI configuration  
- Environment setup
- First deployment
- Security best practices

**When to use**: First-time setup, initial configuration

---

### [API Setup](API_SETUP.md)
Configure secure API layer with Managed Identity:
- Managed Identity configuration
- RBAC permissions
- Local development setup
- API deployment
- Monitoring and troubleshooting

**When to use**: Implementing AI summaries securely in production

---

### [Deployment Guide](DEPLOYMENT.md)
Complete deployment instructions for:
- Azure Storage (recommended, cheapest)
- Azure Static Web Apps (with API)
- Azure App Service
- Manual deployment options

**When to use**: Deploying to Azure for production or testing

---

### [Troubleshooting](TROUBLESHOOTING.md)
Solutions for common issues:
- Authentication errors
- Configuration problems
- API issues
- CORS errors
- Debug techniques

**When to use**: Encountering errors or unexpected behavior

---

## 📋 Reference Documentation

### [Product Specification](TeamPulseAgent_PRD.md)
Original product requirements document:
- Core features
- User flows
- Data structures
- Technical constraints

**When to use**: Understanding product vision and architecture decisions

---

### [Archive](ARCHIVE.md)
Historical documentation and implementation notes:
- Azure SDK upgrade details
- Markdown rendering implementation
- Date presets feature
- Migration notes
- Version history

**When to use**: Understanding implementation history, looking up deprecated features

---

## 🚀 Quick Navigation

### I want to...

**Get started from scratch**  
→ [Getting Started Guide](GETTING_STARTED.md)

**Set up AI summaries securely**  
→ [API Setup Guide](API_SETUP.md)

**Deploy my application**  
→ [Deployment Guide](DEPLOYMENT.md)

**Fix an error I'm seeing**  
→ [Troubleshooting Guide](TROUBLESHOOTING.md)

**Understand the product better**  
→ [Product Specification](TeamPulseAgent_PRD.md)

**Learn about implementation details**  
→ [Archive](ARCHIVE.md)

---

## 📊 Documentation Structure

```
docs/
├── README.md              ← You are here!
├── GETTING_STARTED.md     ← Start here for setup
├── API_SETUP.md           ← API layer configuration
├── DEPLOYMENT.md          ← Deploy to Azure
├── TROUBLESHOOTING.md     ← Fix common issues
├── TeamPulseAgent_PRD.md  ← Product requirements
└── ARCHIVE.md             ← Historical notes
```

---

## 🔄 Documentation Changes (January 2026)

**Consolidated**: Previously had 12 documentation files, now streamlined to 6 focused guides.

**Removed/Archived**:
- `AZURE_SETUP.md` → Merged into `GETTING_STARTED.md`
- `API_IMPLEMENTATION_SUMMARY.md` → Merged into `API_SETUP.md`
- `API_MANAGED_IDENTITY_SETUP.md` → Merged into `API_SETUP.md`
- `QUICK_START_API.md` → Merged into `API_SETUP.md`
- `MIGRATION_TO_API_LAYER.md` → Archived
- `AZURE_SDK_2_UPGRADE.md` → Archived
- `DATE_PRESETS_GUIDE.md` → Archived
- `DEMO_CONFIG.md` → Archived (deprecated)
- `MARKDOWN_IMPROVEMENTS.md` → Archived

**Benefits**:
- Easier to find information
- Less duplication
- Clear learning path
- Maintained historical reference

---

## 💡 Documentation Best Practices

When updating documentation:

1. **Keep README.md in sync** - Main project README should reference these docs
2. **Update this index** - Add new docs here with clear descriptions
3. **Cross-reference** - Link between related sections
4. **Keep examples current** - Update code samples as the app evolves
5. **Archive, don't delete** - Move old docs to ARCHIVE.md for reference

---

**Last Updated**: January 2026  
**Maintained by**: TeamPulse Development Team

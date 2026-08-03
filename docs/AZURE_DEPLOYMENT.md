# Azure Deployment Guide

This guide deploys DevShelf entirely on Azure:

```text
Azure Static Web Apps (Free)  -> React/Vite client
Azure App Service (F1)       -> Node/Express API
Azure Cosmos DB (MongoDB)    -> persistent database target
```

## Important current scope

The current API still uses the deterministic in-memory demo store. The Azure workflows in this branch deploy that verified demo safely, but data will reset when the App Service restarts. Do not set `DATABASE_MODE=mongo` until the Mongoose repository adapter and migration/seed checks are merged; the runtime will reject `DATABASE_MODE=mongo` without `MONGODB_URI`.

The first Azure deployment is therefore a demonstration environment. The next persistence slice will connect the existing Mongoose models to Cosmos DB for MongoDB before using Azure as a durable application environment.

## 1. Create the resource group

In the Azure portal, create one resource group in the region closest to the intended users. Keep the App Service and Cosmos DB account in the same region.

## 2. Create Cosmos DB for MongoDB

Create **Azure Cosmos DB for MongoDB** with these guardrails:

- Select provisioned throughput, not serverless, when applying the Cosmos DB free-tier discount.
- Enable **Apply Free Tier Discount** during account creation.
- Use one region and disable geo-redundancy for the demo.
- Use one shared-throughput database named `devshelf`.
- Keep the account at or below the free allowance.

Azure documents the Cosmos DB free tier as one account per subscription, with 1,000 RU/s and 25 GB of storage for the lifetime of the account when the discount is selected during creation. See the [Cosmos DB free tier documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/free-tier).

Copy the MongoDB connection string, but never commit it. It will become the `MONGODB_URI` App Service setting after the persistence adapter is ready.

## 3. Create the API App Service

Create an App Service with:

- Publish: **Code**
- Runtime: **Node 24 LTS** if available
- Operating system: **Linux**
- Plan: **Free F1**
- Region: the same region as the database

The F1 plan is suitable for this demo only. Microsoft lists 60 CPU minutes/day, 1 GB storage, and no SLA for the Free plan. The plan can stop the app after CPU, bandwidth, or other quota limits are reached. See [App Service Linux pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) and [App Service quotas](https://learn.microsoft.com/en-us/azure/app-service/web-sites-monitor).

In **Configuration > General settings**, set the startup command to:

```text
npm start
```

In **Configuration > Environment variables**, add:

```text
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=~24
SCM_DO_BUILD_DURING_DEPLOYMENT=true
CLIENT_URL=https://<static-web-app-hostname>
CORS_ALLOWED_ORIGINS=https://<static-web-app-hostname>
DATABASE_MODE=memory
JWT_ACCESS_SECRET=<long-random-secret-at-least-32-characters>
```

Add `MONGODB_URI` only after the Mongo repository adapter is merged and verified.

App Service injects these values as runtime environment variables and restarts the app after settings change. See [App Service app settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common).

## 4. Create the Static Web App

Create an Azure Static Web App on the **Free** plan and connect it to the GitHub repository:

- Source: GitHub
- Branch: `main`
- App location: `/client`
- Output location: `dist`
- API location: leave empty

The repository includes `client/public/staticwebapp.config.json`, which Vite copies into the deployment artifact so BrowserRouter routes fall back to `index.html` and basic security headers are applied. Static Web Apps Free includes GitHub integration, managed SSL, and a 250 MB app-size limit. See [Static Web Apps plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans).

After creation, copy the Static Web App deployment token from **Manage deployment token**.

## 5. Configure GitHub variables and secrets

In the repository, open **Settings > Secrets and variables > Actions**.

Repository variables:

```text
AZURE_WEBAPP_NAME=<App Service name>
VITE_API_BASE_URL=https://<app-service-name>.azurewebsites.net/api/v1
```

Repository secrets:

```text
AZURE_WEBAPP_PUBLISH_PROFILE=<downloaded App Service publish profile XML>
AZURE_STATIC_WEB_APPS_API_TOKEN=<Static Web Apps deployment token>
```

The publish profile is a deployment credential. Treat it like a password and rotate it if it is exposed. The workflows use `azure/webapps-deploy@v3` for the API and `Azure/static-web-apps-deploy@v1` for the client. See [GitHub Actions deployment for App Service](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions).

## 6. Deploy

Push the deployment workflow branch through the repository review process and merge it into `main`. The workflows then:

1. Install dependencies with Node 24.
2. Run the API test suite.
3. Build the Vite client with `VITE_API_BASE_URL`.
4. Deploy the API to App Service.
5. Deploy the static client to Static Web Apps.

## 7. Verify the deployment

Replace the placeholders and run:

```powershell
$api = "https://<app-service-name>.azurewebsites.net"
$client = "https://<static-web-app-hostname>"

Invoke-RestMethod "$api/health"
Invoke-RestMethod "$api/api/v1/health"
Invoke-WebRequest $client
```

Then manually verify:

- Guest search and resource details
- Login with a development account only
- Bookmarking and collections
- Submission creation
- Admin moderation and publish flow
- CORS from the Static Web App origin

## 8. Cost and quota safety

- Do not create a second Cosmos DB free-tier account in the same subscription.
- Keep Cosmos DB in one region and within 1,000 RU/s and 25 GB.
- Monitor App Service **CPU Time**, **Bandwidth**, **Memory**, and **Filesystem** quotas.
- Set an Azure budget alert even when using free allocations.
- Do not add Redis, Kubernetes, Application Gateway, or paid App Service features for this MVP.

## Follow-up persistence milestone

Before treating Azure as a durable environment, implement and verify:

1. Mongoose connection lifecycle and health reporting.
2. Mongo repositories for users, resources, bookmarks, collections, submissions, and audit logs.
3. Seed and migration commands safe for Cosmos DB for MongoDB.
4. Integration tests against a disposable Mongo-compatible test database.
5. `DATABASE_MODE=mongo` in the Azure App Service settings.

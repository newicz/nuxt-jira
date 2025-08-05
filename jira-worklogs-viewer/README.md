# JIRA Worklogs Viewer

This is a Nuxt application to view JIRA worklogs for a specific project.

## Configuration

1.  Create a file named `app.env` in the root of the project.
2.  Add the following content to the `app.env` file:

    ```
    JIRA_API_URL="https://your-jira-instance.atlassian.net"
    JIRA_API_TOKEN="your_jira_api_token"
    JIRA_PROJECT_KEY="your_project_key"
    ```

3.  Replace the placeholder values with your actual JIRA API URL, token, and project key.

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

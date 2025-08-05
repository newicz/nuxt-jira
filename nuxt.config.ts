// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  dotenv: {
    filename: 'app.env'
  },
  runtimeConfig: {
    jiraApiUrl: process.env.JIRA_API_URL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    jiraProjectKey: process.env.JIRA_PROJECT_KEY,
  }
})

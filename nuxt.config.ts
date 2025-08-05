import dotenv from 'dotenv'
dotenv.config({ path: './app.env' })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    jiraApiUrl: process.env.JIRA_API_URL,
    jiraUserEmail: process.env.JIRA_USER_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    jiraProjectKey: process.env.JIRA_PROJECT_KEY,
  }
})

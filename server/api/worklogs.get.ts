import { ofetch } from 'ofetch'

export default defineEventHandler(async () => {
  const { jiraApiUrl, jiraApiToken, jiraProjectKey } = useRuntimeConfig()

  if (!jiraApiUrl || !jiraApiToken || !jiraProjectKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JIRA API credentials are not configured. Please check your app.env file.'
    })
  }

  const jiraUrl = `${jiraApiUrl}/rest/api/3/search`
  const jql = `project=${jiraProjectKey}`
  const fields = 'summary,worklog'
  const maxResults = 50 // You can adjust this value
  let startAt = 0
  let total = 0
  let allIssues = []

  try {
    do {
      const url = `${jiraUrl}?jql=${jql}&fields=${fields}&expand=worklog&startAt=${startAt}&maxResults=${maxResults}`
      const response = await ofetch(url, {
        headers: {
          'Authorization': `Basic ${jiraApiToken}`,
          'Content-Type': 'application/json'
        }
      })

      allIssues = allIssues.concat(response.issues)
      total = response.total
      startAt += response.issues.length

    } while (startAt < total)

    const worklogs = allIssues.flatMap(issue => {
      if (issue.fields.worklog) {
        return issue.fields.worklog.worklogs.map(log => ({
          issueKey: issue.key,
          issueSummary: issue.fields.summary,
          author: log.author.displayName,
          timeSpent: log.timeSpent,
          started: log.started
        }))
      }
      return []
    })

    return worklogs
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch worklogs from JIRA. Please check your JIRA URL, credentials, and project key.'
    })
  }
})

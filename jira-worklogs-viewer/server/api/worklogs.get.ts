import { ofetch } from 'ofetch'

export default defineEventHandler(async () => {
  const { jiraApiUrl, jiraApiToken, jiraProjectKey } = useRuntimeConfig()

  if (!jiraApiUrl || !jiraApiToken || !jiraProjectKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JIRA API credentials are not configured.'
    })
  }

  const jiraUrl = `${jiraApiUrl}/rest/api/3/search`
  const jql = `project=${jiraProjectKey}`
  const fields = 'summary,worklog'
  const url = `${jiraUrl}?jql=${jql}&fields=${fields}`

  try {
    const response = await ofetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(jiraApiToken).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    const worklogs = response.issues.flatMap(issue =>
      issue.worklog.worklogs.map(log => ({
        issueKey: issue.key,
        issueSummary: issue.fields.summary,
        author: log.author.displayName,
        timeSpent: log.timeSpent,
        started: log.started
      }))
    )

    return worklogs
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch worklogs from JIRA.'
    })
  }
})

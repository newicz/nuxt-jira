import { ofetch } from 'ofetch'
import { getQuery } from 'h3'

function formatTime(seconds) {
  if (!seconds) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  let result = ''
  if (hours > 0) {
    result += `${hours}h`
  }
  if (minutes > 0) {
    if (result) result += ' '
    result += `${minutes}m`
  }
  return result || '0m'
}

export default defineEventHandler(async (event) => {
  const { jiraApiUrl, jiraApiToken, jiraProjectKey } = useRuntimeConfig()
  const { startDate, endDate } = getQuery(event)

  if (!jiraApiUrl || !jiraApiToken || !jiraProjectKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JIRA API credentials are not configured. Please check your app.env file.'
    })
  }

  const jiraUrl = `${jiraApiUrl}/rest/api/3/search`
  let jql = `project=${jiraProjectKey}`
  if (startDate && endDate) {
    jql += ` AND worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`
  }
  const fields = 'summary,worklog,parent'
  const maxResults = 50
  let startAt = 0
  let total = 0
  let allIssues = []

  try {
    do {
      const url = `${jiraUrl}?jql=${encodeURIComponent(jql)}&fields=${fields}&expand=worklog&startAt=${startAt}&maxResults=${maxResults}`
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

    let worklogs = allIssues.flatMap(issue => {
      if (issue.fields.worklog) {
        return issue.fields.worklog.worklogs.map(log => ({
          issueKey: issue.key,
          issueSummary: issue.fields.summary,
          author: log.author.displayName,
          timeSpentSeconds: log.timeSpentSeconds,
          started: log.started
        }))
      }
      return []
    })

    if (startDate && endDate) {
      const startDateTime = new Date(startDate)
      startDateTime.setHours(0, 0, 0, 0)
      const endDateTime = new Date(endDate)
      endDateTime.setHours(23, 59, 59, 999)

      worklogs = worklogs.filter(log => {
        const logDateTime = new Date(log.started).getTime()
        return logDateTime >= startDateTime.getTime() && logDateTime <= endDateTime.getTime()
      })
    }

    const timePerUser = worklogs.reduce((acc, log) => {
      acc[log.author] = (acc[log.author] || 0) + log.timeSpentSeconds
      return acc
    }, {})

    const timePerTask = worklogs.reduce((acc, log) => {
      acc[log.issueKey] = {
        summary: log.issueSummary,
        time: (acc[log.issueKey]?.time || 0) + log.timeSpentSeconds
      }
      return acc
    }, {})

    const formattedTimePerUser = Object.entries(timePerUser).map(([user, time]) => ({
      user,
      time: formatTime(time)
    }))

    const formattedTimePerTask = Object.entries(timePerTask).map(([task, data]) => ({
      task,
      summary: data.summary,
      time: formatTime(data.time)
    }))

    const formattedWorklogs = worklogs.map(log => ({
        ...log,
        timeSpent: formatTime(log.timeSpentSeconds)
    }))

    return {
      worklogs: formattedWorklogs,
      timePerUser: formattedTimePerUser,
      timePerTask: formattedTimePerTask
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch worklogs from JIRA. Please check your JIRA URL, credentials, and project key.'
    })
  }
})

<template>
  <div>
    <h1>JIRA Worklogs Dashboard</h1>
    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ error.message }}</div>
    <div v-if="data">
      <h2>Time Spent Per User</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in data.timePerUser" :key="user.user">
            <td>{{ user.user }}</td>
            <td>{{ user.time }}</td>
          </tr>
        </tbody>
      </table>

      <h2>Time Spent Per Task</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Summary</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in data.timePerTask" :key="task.task">
            <td>{{ task.task }}</td>
            <td>{{ task.summary }}</td>
            <td>{{ task.time }}</td>
          </tr>
        </tbody>
      </table>

      <h2>All Worklogs</h2>
      <table>
        <thead>
          <tr>
            <th>Issue Key</th>
            <th>Issue Summary</th>
            <th>Author</th>
            <th>Time Spent</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in data.worklogs" :key="log.issueKey + log.started + log.author">
            <td>{{ log.issueKey }}</td>
            <td>{{ log.issueSummary }}</td>
            <td>{{ log.author }}</td>
            <td>{{ log.timeSpent }}</td>
            <td>{{ new Date(log.started).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = await useFetch('/api/worklogs')
</script>

<style>
h1, h2 {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>

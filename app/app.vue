<template>
  <div>
    <h1>JIRA Worklogs</h1>
    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ error.message }}</div>
    <table v-if="worklogs">
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
        <tr v-for="log in worklogs" :key="log.issueKey + log.started + log.author">
          <td>{{ log.issueKey }}</td>
          <td>{{ log.issueSummary }}</td>
          <td>{{ log.author }}</td>
          <td>{{ log.timeSpent }}</td>
          <td>{{ new Date(log.started).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { data: worklogs, pending, error } = await useFetch('/api/worklogs')
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>

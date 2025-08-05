<template>
  <div>
    <h1>JIRA Worklogs Dashboard</h1>

    <div class="filters">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate">
      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate">
    </div>

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
import { ref } from 'vue'

const today = new Date()
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(today.getDate() - 30)

const startDate = ref(thirtyDaysAgo.toISOString().split('T')[0])
const endDate = ref(today.toISOString().split('T')[0])

const { data, pending, error } = await useFetch(
  () => `/api/worklogs?startDate=${startDate.value}&endDate=${endDate.value}`
)
</script>

<style>
h1, h2 {
  margin-top: 20px;
}
.filters {
  margin-bottom: 20px;
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

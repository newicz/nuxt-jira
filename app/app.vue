<template>
  <div class="container">
    <header>
      <h1>JIRA Worklogs Dashboard</h1>
      <div class="filters">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="startDate">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="endDate">
      </div>
    </header>

    <div v-if="pending" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error.message }}</div>

    <main v-if="data" class="dashboard">
      <div class="card">
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
      </div>

      <div class="card">
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
      </div>

      <div class="card full-width">
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
    </main>
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
:root {
  --primary-color: #4a90e2;
  --background-color: #f4f7fa;
  --card-background-color: #ffffff;
  --text-color: #333;
  --header-color: #555;
  --border-color: #e0e0e0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  color: var(--primary-color);
}

.filters {
  display: flex;
  gap: 10px;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background-color: var(--card-background-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.full-width {
  grid-column: 1 / -1;
}

h2 {
  font-size: 18px;
  color: var(--header-color);
  margin-top: 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}
</style>

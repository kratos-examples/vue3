<script setup lang="ts">
import { ref } from 'vue'
import { demo1Transport } from '../api/transport'
import { StudentServiceClient } from '../rpc/demo1/student/student.client'
import { CreateStudentRequest, ListStudentsRequest } from '../rpc/demo1/student/student'

const client = new StudentServiceClient(demo1Transport)
const logs = ref<string[]>([])
const loading = ref(false)

function log(msg: string) {
    logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

async function demoCreate() {
    loading.value = true
    try {
        const request = CreateStudentRequest.create({
            name: "Alice",
            age: 20,
            className: "CS-101"
        })
        const response = await client.createStudent(request, {})
        log(`CreateStudent OK: id=${response.data.student?.id}, name=${response.data.student?.name}`)
    } catch (err) {
        log(`CreateStudent FAIL: ${err}`)
    }
    loading.value = false
}

async function demoList() {
    loading.value = true
    try {
        const request = ListStudentsRequest.create({})
        const response = await client.listStudents(request, {})
        log(`ListStudents OK: count=${response.data.students.length}`)
        response.data.students.forEach((s, i) => {
            log(`  [${i}] id=${s.id} name=${s.name} age=${s.age} class=${s.className}`)
        })
    } catch (err) {
        log(`ListStudents FAIL: ${err}`)
    }
    loading.value = false
}

function clearLogs() {
    logs.value = []
}
</script>

<template>
    <div class="demo-section">
        <h2>StudentService (demo1kratos :8001)</h2>
        <div class="actions">
            <button @click="demoCreate" :disabled="loading">Create Student</button>
            <button @click="demoList" :disabled="loading">List Students</button>
            <button @click="clearLogs">Clear</button>
        </div>
        <div class="log-output">
            <div v-for="(line, i) in logs" :key="i" class="log-line">{{ line }}</div>
            <div v-if="logs.length === 0" class="log-empty">Click a button to test the API</div>
        </div>
    </div>
</template>

<style scoped>
.demo-section {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}
.actions {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}
button {
    padding: 6px 16px;
    border-radius: 4px;
    border: 1px solid #646cff;
    background: #646cff;
    color: white;
    cursor: pointer;
}
button:disabled {
    opacity: 0.5;
}
.log-output {
    background: #1a1a2e;
    color: #0f0;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
    max-height: 300px;
    overflow-y: auto;
}
.log-line {
    margin-bottom: 2px;
}
.log-empty {
    color: #666;
}
</style>

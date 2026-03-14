<script setup lang="ts">
import StudentDemo from './components/StudentDemo.vue'
import ArticleDemo from './components/ArticleDemo.vue'
</script>

<template>
    <div class="app">
        <h1>Vue3 + Kratos Demo</h1>
        <p class="subtitle">gRPC-to-HTTP client integration via vue3kratos</p>
        <StudentDemo />
        <ArticleDemo />
    </div>
</template>

<style scoped>
.app {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
}
h1 {
    text-align: center;
    margin-bottom: 4px;
}
.subtitle {
    text-align: center;
    color: #888;
    margin-bottom: 24px;
}
</style>

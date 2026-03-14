<script setup lang="ts">
import { ref } from 'vue'
import { demo2Transport } from '../api/transport'
import { ArticleServiceClient } from '../rpc/demo2/article/article.client'
import { CreateArticleRequest, ListArticlesRequest } from '../rpc/demo2/article/article'

const client = new ArticleServiceClient(demo2Transport)
const logs = ref<string[]>([])
const loading = ref(false)

function log(msg: string) {
    logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

async function demoCreate() {
    loading.value = true
    try {
        const request = CreateArticleRequest.create({
            title: "Vue3 + Kratos Integration",
            content: "This article demonstrates the vue3kratos workflow.",
        })
        const response = await client.createArticle(request, {})
        log(`CreateArticle OK: id=${response.data.article?.id}, title=${response.data.article?.title}`)
    } catch (err) {
        log(`CreateArticle FAIL: ${err}`)
    }
    loading.value = false
}

async function demoList() {
    loading.value = true
    try {
        const request = ListArticlesRequest.create({})
        const response = await client.listArticles(request, {})
        log(`ListArticles OK: count=${response.data.articles.length}`)
        response.data.articles.forEach((a, i) => {
            log(`  [${i}] id=${a.id} title=${a.title}`)
        })
    } catch (err) {
        log(`ListArticles FAIL: ${err}`)
    }
    loading.value = false
}

function clearLogs() {
    logs.value = []
}
</script>

<template>
    <div class="demo-section">
        <h2>ArticleService (demo2kratos :8002)</h2>
        <div class="actions">
            <button @click="demoCreate" :disabled="loading">Create Article</button>
            <button @click="demoList" :disabled="loading">List Articles</button>
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

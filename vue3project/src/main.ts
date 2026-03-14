import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// BigInt JSON serialization support (required by protobuf-ts int64 fields)
;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}

createApp(App).mount('#app')

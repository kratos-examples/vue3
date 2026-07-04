import type { AxiosError } from 'axios'
import { isAxiosError } from 'axios'
import { ElMessageBox } from 'element-plus'
import { h } from 'vue'

// KratosFault is the raw Kratos error response wire format
interface KratosFault {
    reason: string
    code: number
    message: string
    metadata: Record<string, string | undefined>
}

// Metadata key that carries the numeric reason enum value, matching the backend
// newerk.SetReasonCodeFieldName setting. It lets the frontend compare against the
// generated ErrorReason enum by number instead of matching the reason string.
//
// 承载数字 reason 枚举值的 metadata 键，与后端 newerk.SetReasonCodeFieldName 设的一致。
// 有了它，前端就能拿数字跟生成的 ErrorReason 枚举比较，而不是去硬匹配 reason 字符串。
const REASON_CODE_KEY = 'numeric_reason_code_enum'

// Parsed cause info
export interface CauseInfo {
    httpCode: number
    reason: string
    reasonCode: number
    message: string
}

// Parse the caught value into CauseInfo
export function parseCause(caught: unknown): CauseInfo {
    if (isAxiosError(caught)) {
        const axiosErr = caught as AxiosError
        if (axiosErr.code === 'ERR_NETWORK') {
            return { httpCode: 0, reason: 'ERR_NETWORK', reasonCode: 0, message: 'Network error, check connection' }
        }
        if (axiosErr.response?.data) {
            const data = axiosErr.response.data as KratosFault
            return {
                httpCode: data.code ?? axiosErr.response.status ?? 500,
                reason: data.reason ?? 'UNKNOWN',
                reasonCode: Number(data.metadata?.[REASON_CODE_KEY] ?? 0),
                message: data.message ?? axiosErr.message,
            }
        }
    }
    return { httpCode: 500, reason: 'UNKNOWN', reasonCode: 0, message: String(caught) }
}

// Show the cause in a dialog
export function showCauseDialog(caught: unknown) {
    const info = parseCause(caught)
    ElMessageBox({
        title: info.httpCode === 0 ? 'Network Error' : `Error (${info.httpCode})`,
        message: h('div', { style: 'font-size:14px' }, [
            h('p', { style: 'margin:0 0 8px 0;color:#606266' }, [h('b', 'Reason: '), info.reason]),
            h('p', { style: 'margin:0;color:#909399;word-break:break-all' }, info.message),
        ]),
        confirmButtonText: 'OK',
        type: 'warning',
    })
}

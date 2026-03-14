# Vue3Codegen - Vue3 客户端代码生成

自动化 Vue3 TypeScript 客户端代码生成，整合 proto → gRPC TS → HTTP TS 完整工作流。

## 英文文档

[ENGLISH README](README.md)

## 功能特性

- **自动化生成**: 从 proto 文件自动生成 TypeScript gRPC 客户端
- **客户端转换**: 将 gRPC 客户端转换成 HTTP 客户端，支持网页环境
- **工作流集成**: 自动执行完整生成、同步、转换、清理流程
- **提前检查**: 执行前检查 Makefile 目标存在，提前发现配置问题

## 工作流程

```
Proto Files (demo1kratos/api/)
    ↓
Generate TypeScript gRPC Clients (make web_api_grpc_ts)
    ↓
Sync to Vue3 Project (vue3project/src/rpc/)
    ↓
Convert to HTTP Clients (vue3kratos)
    ↓
Cleanup Temp Files (make web_api_cleanup)
```

## 快速使用

### 1. 构建

```bash
# 构建可执行文件
go build -o vue3codegen main.go

# 通过 go 运行
go run main.go
```

### 2. 运行生成

```bash
# 执行代码生成
./vue3codegen
```

自动执行步骤：
1. 定位 demo1kratos 项目路径
2. 检查 Makefile 包含必需的目标
3. 生成 TypeScript gRPC 客户端
4. 同步文件到 vue3project 项目
5. 转换 gRPC 客户端为 HTTP 客户端
6. 清理临时文件

## 依赖要求

### 项目结构
```
kratos-examples/vue3/
├── demo1kratos/         # Kratos 后端项目
│   ├── api/            # Proto 文件
│   ├── Makefile        # 包含 web_api_grpc_ts 和 web_api_cleanup 目标
│   └── bin/            # 生成文件输出目录
├── vue3project/        # Vue3 前端项目
│   └── src/rpc/        # 客户端代码输出目录
└── vue3codegen/        # 代码生成工具
    └── main.go
```

### Makefile 目标
demo1kratos 项目的 Makefile 必须包含：
- `web_api_grpc_ts`: 生成 TypeScript gRPC 客户端
- `web_api_cleanup`: 清理临时文件

### Go 依赖
- [kratos-vue3](https://github.com/yylego/kratos-vue3) - gRPC 到 HTTP 转换
- [yylego 工具包](https://github.com/yylego) - 路径处理和检查

## 注意事项

- **项目专用**: 硬编码路径，仅适配演示项目结构
- **不具备通用性**: 逻辑针对 demo1kratos 和 vue3project 路径定制，无法复用
- **作为参考**: 改造代码逻辑到自己的 main.go 或 test 文件中使用
- 自动清理之前的生成输出
- 必须先构建 demo1kratos 的 Makefile 目标
- 生成的代码会覆盖 vue3project/src/rpc 目录内容
- 建议在 proto 文件变化时运行

## 相关项目

- [kratos-vue3](https://github.com/yylego/kratos-vue3) - Vue3 + Kratos 集成
- [demo1kratos](https://github.com/yylego/kratos-examples/tree/main/vue3/demo1kratos) - Kratos 后端演示项目
- [vue3project](https://github.com/yylego/kratos-examples/tree/main/vue3/vue3project) - Vue3 前端演示项目

---

**说明**: 演示专用代码，硬编码路径，不作为通用方案。欢迎改造逻辑到自己的项目中使用。

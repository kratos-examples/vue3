# Vue3Codegen - Vue3 Client Code Generation

Auto Vue3 TypeScript client code generation that integrates the complete proto to gRPC TS to HTTP TS pipeline.

## CHINESE README

[中文说明](README.zh.md)

## Features

- **Auto Generation**: Auto generate TypeScript gRPC clients from proto files
- **Client Conversion**: Convert gRPC clients to HTTP clients with web support
- **Pipeline Integration**: Auto execute complete generate, sync, convert, cleanup flow
- **Pre-validation**: Check Makefile targets exist before execution to catch config issues upfront

## Pipeline

```
Proto Files (demo1kratos/api/)
    |
Generate TypeScript gRPC Clients (make web_api_grpc_ts)
    |
Sync to Vue3 Project (vue3project/src/rpc/)
    |
Convert to HTTP Clients (vue3kratos)
    |
Cleanup Temp Files (make web_api_cleanup)
```

## Quick Start

### 1. Build

```bash
# Build executable
go build -o vue3codegen main.go

# Run via go
go run main.go
```

### 2. Run Generation

```bash
# Execute code generation
./vue3codegen
```

Auto execute steps:
1. Locate demo1kratos project path
2. Check Makefile contains required targets
3. Generate TypeScript gRPC clients
4. Sync files to vue3project
5. Convert gRPC clients to HTTP clients
6. Cleanup temp files

## Requirements

### Project Structure
```
kratos-examples/vue3/
├── demo1kratos/         # Kratos backend project
│   ├── api/            # Proto files
│   ├── Makefile        # Contains web_api_grpc_ts and web_api_cleanup targets
│   └── bin/            # Generated files output
├── vue3project/        # Vue3 frontend project
│   └── src/rpc/        # Client code output
└── vue3codegen/        # Code generation
    └── main.go
```

### Makefile Targets
demo1kratos project Makefile must contain:
- `web_api_grpc_ts`: Generate TypeScript gRPC clients
- `web_api_cleanup`: Cleanup temp files

### Go Dependencies
- [kratos-vue3](https://github.com/yylego/kratos-vue3) - gRPC to HTTP conversion
- [yylego packages](https://github.com/yylego) - Path handling and checks

## Notes

- **Project Specific**: Hardcoded paths fit the demo project structure
- **Not Generic**: Logic is tailored to demo1kratos and vue3project paths, not reusable
- **As Reference**: Adapt the logic to main.go/test files in own projects
- Auto clean previous generation output
- Must build demo1kratos Makefile targets first
- Generated code overwrites vue3project/src/rpc contents
- Recommend running when proto files change

## Related Projects

- [kratos-vue3](https://github.com/yylego/kratos-vue3) - Vue3 + Kratos integration
- [demo1kratos](https://github.com/yylego/kratos-examples/tree/main/vue3/demo1kratos) - Kratos backend demo project
- [vue3project](https://github.com/yylego/kratos-examples/tree/main/vue3/vue3project) - Vue3 frontend demo project

---

**Note**: Demo-specific code with hardcoded paths. Not intended as a generic solution. Adapt the logic to fit own projects.

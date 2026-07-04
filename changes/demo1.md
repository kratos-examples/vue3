# Changes

Code differences compared to source project.

## Makefile (+14 -0)

```diff
@@ -36,6 +36,20 @@
 	make config
 	make generate
 
+# generate TypeScript gRPC clients from proto files (via buf)
+# go install github.com/yylego/kratos-vue3/cmd/vue3kratos@latest
+web_api_grpc_ts:
+	mkdir -p ./bin/web_api_grpc_ts.out
+	buf generate --template buf.gen.ts.yaml --include-imports
+
+# convert gRPC clients to HTTP clients
+web_api_grpc_to_http:
+	vue3kratos gen-grpc-via-http-in-root --grpc-ts-root=./bin/web_api_grpc_ts.out
+
+# cleanup generated TypeScript files
+web_api_cleanup:
+	rm -rf ./bin/web_api_grpc_ts.out
+
 # show help
 help:
 	@echo ''
```

## buf.gen.ts.yaml (+10 -0)

```diff
@@ -0,0 +1,10 @@
+version: v2
+inputs:
+  - directory: api
+plugins:
+  - local: protoc-gen-ts
+    out: bin/web_api_grpc_ts.out
+    opt:
+      - ts_nocheck
+      - eslint_disable
+      - long_type_string
```

## cmd/demo1kratos/main.go (+11 -0)

```diff
@@ -5,6 +5,7 @@
 	"log/slog"
 	"os"
 
+	"github.com/go-kratos/kratos/contrib/encoding/json/v3"
 	"github.com/go-kratos/kratos/contrib/otel/v3/tracing"
 	"github.com/go-kratos/kratos/v3"
 	"github.com/go-kratos/kratos/v3/config"
@@ -32,6 +33,16 @@
 
 func init() {
 	flag.StringVar(&flagconf, "conf", "./configs", "config path, eg: -conf config.yaml")
+
+	// Configure JSON field naming style for HTTP responses
+	// UseProtoNames=false uses lowerCamelCase to work across different languages
+	// 配置 HTTP 响应的 JSON 字段命名风格，使用小写驼峰命名确保跨语言兼容性
+	json.MarshalOptions.UseProtoNames = false
+
+	// Set UseEnumNumbers to true to serialize enums as numbers instead of strings
+	// This matches TypeScript generated code from proto, ensuring frontend works correct
+	// 设置 UseEnumNumbers 为 true 使枚举序列化为数字而非字符串，与 proto 生成的 TypeScript 代码保持一致
+	json.MarshalOptions.UseEnumNumbers = true
 }
 
 func newApp(logger *slog.Logger, gs *grpc.Server, hs *http.Server) *kratos.App {
```


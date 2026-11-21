# Changes

Code differences compared to source project.

## Makefile (+22 -0)

```diff
@@ -7,6 +7,8 @@
 init:
 	go install github.com/google/wire/cmd/wire@latest
 	go install github.com/bufbuild/buf/cmd/buf@latest
+	go install github.com/yylego/kratos-ts-http/cmd/protoc-gen-kratos-ts-http@latest
+	npm install -g @protobuf-ts/plugin
 
 .PHONY: config
 # generate internal proto
@@ -35,6 +37,26 @@
 	make api
 	make config
 	make generate
+
+# 从 proto 一步生成浏览器可直接使用的 TypeScript 客户端，产出即是最终代码，无需二次改写。
+# 落到本项目的 bin 下，之后人工拷进前端；`.out` 结尾的目录 Go 的 .gitignore 本就忽略。
+# generate web-safe TypeScript clients from proto; the output is the finished code.
+# It lands under bin here, ready to be copied into the frontend by hand.
+#
+# 依赖的两个插件由 `make init` 一并安装。
+# Both plugins it needs come from `make init`.
+#
+# 想一步直达前端，跑 vue3codegen 那条（路径由 Go 算，不必写死在这里）。
+# For a straight run into the frontend, use vue3codegen: it works the path out in Go.
+web_rpc_ts:
+	buf generate --template buf.gen.ts.yaml --include-imports --clean -o ./bin/web_rpc_ts.out
+
+# 删掉本地产物目录本身。平时用不上——生成那条带 `--clean`，每次已是从零开始，
+# 而 `.out` 结尾的目录 git 本就忽略；只在想彻底腾空这块磁盘时才用它。
+# Removes the local output directory itself. Rarely needed: the generate target passes `--clean`,
+# so each run already starts from nothing, and git ignores `.out` dirs anyway.
+web_rpc_ts_cleanup:
+	rm -rf ./bin/web_rpc_ts.out
 
 # show help
 help:
```

## buf.gen.ts.yaml (+14 -0)

```diff
@@ -0,0 +1,14 @@
+# 使用 kratos-ts-http 的插件，产出即为最终的 HTTP 形态客户端，无需第二步改写。
+# 落点不在此处指定，由命令行的 -o 决定。
+# Uses the kratos-ts-http plugin, so the output is the finished HTTP-form client.
+# The destination is set on the command line with -o, not here.
+version: v2
+inputs:
+  - directory: api
+plugins:
+  - local: protoc-gen-kratos-ts-http
+    out: .
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
@@ -31,6 +32,16 @@
 
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


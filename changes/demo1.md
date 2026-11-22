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

## api/student/student.pb.go (+12 -9)

```diff
@@ -625,14 +625,15 @@
 	"\tpage_size\x18\x02 \x01(\x05R\bpageSize\"[\n" +
 	"\x11ListStudentsReply\x120\n" +
 	"\bstudents\x18\x01 \x03(\v2\x14.student.StudentInfoR\bstudents\x12\x14\n" +
-	"\x05count\x18\x02 \x01(\x05R\x05count2\xf9\x03\n" +
+	"\x05count\x18\x02 \x01(\x05R\x05count2\xe6\x04\n" +
 	"\x0eStudentService\x12a\n" +
 	"\rCreateStudent\x12\x1d.student.CreateStudentRequest\x1a\x1b.student.CreateStudentReply\"\x14\x82\xd3\xe4\x93\x02\x0e:\x01*\"\t/students\x12f\n" +
 	"\rUpdateStudent\x12\x1d.student.UpdateStudentRequest\x1a\x1b.student.UpdateStudentReply\"\x19\x82\xd3\xe4\x93\x02\x13:\x01*\x1a\x0e/students/{id}\x12c\n" +
 	"\rDeleteStudent\x12\x1d.student.DeleteStudentRequest\x1a\x1b.student.DeleteStudentReply\"\x16\x82\xd3\xe4\x93\x02\x10*\x0e/students/{id}\x12Z\n" +
 	"\n" +
 	"GetStudent\x12\x1a.student.GetStudentRequest\x1a\x18.student.GetStudentReply\"\x16\x82\xd3\xe4\x93\x02\x10\x12\x0e/students/{id}\x12[\n" +
-	"\fListStudents\x12\x1c.student.ListStudentsRequest\x1a\x1a.student.ListStudentsReply\"\x11\x82\xd3\xe4\x93\x02\v\x12\t/studentsB!Z\x1fdemo1kratos/api/student;studentb\x06proto3"
+	"\fListStudents\x12\x1c.student.ListStudentsRequest\x1a\x1a.student.ListStudentsReply\"\x11\x82\xd3\xe4\x93\x02\v\x12\t/students\x12k\n" +
+	"\x0eLookupStudents\x12\x1a.student.GetStudentRequest\x1a\x18.student.GetStudentReply\"\x1f\x82\xd3\xe4\x93\x02\x19\x12\x17/students/lookup/stream(\x010\x01B!Z\x1fdemo1kratos/api/student;studentb\x06proto3"
 
 var (
 	file_student_student_proto_rawDescOnce sync.Once
@@ -670,13 +671,15 @@
 	5,  // 6: student.StudentService.DeleteStudent:input_type -> student.DeleteStudentRequest
 	7,  // 7: student.StudentService.GetStudent:input_type -> student.GetStudentRequest
 	9,  // 8: student.StudentService.ListStudents:input_type -> student.ListStudentsRequest
-	2,  // 9: student.StudentService.CreateStudent:output_type -> student.CreateStudentReply
-	4,  // 10: student.StudentService.UpdateStudent:output_type -> student.UpdateStudentReply
-	6,  // 11: student.StudentService.DeleteStudent:output_type -> student.DeleteStudentReply
-	8,  // 12: student.StudentService.GetStudent:output_type -> student.GetStudentReply
-	10, // 13: student.StudentService.ListStudents:output_type -> student.ListStudentsReply
-	9,  // [9:14] is the sub-list for method output_type
-	4,  // [4:9] is the sub-list for method input_type
+	7,  // 9: student.StudentService.LookupStudents:input_type -> student.GetStudentRequest
+	2,  // 10: student.StudentService.CreateStudent:output_type -> student.CreateStudentReply
+	4,  // 11: student.StudentService.UpdateStudent:output_type -> student.UpdateStudentReply
+	6,  // 12: student.StudentService.DeleteStudent:output_type -> student.DeleteStudentReply
+	8,  // 13: student.StudentService.GetStudent:output_type -> student.GetStudentReply
+	10, // 14: student.StudentService.ListStudents:output_type -> student.ListStudentsReply
+	8,  // 15: student.StudentService.LookupStudents:output_type -> student.GetStudentReply
+	10, // [10:16] is the sub-list for method output_type
+	4,  // [4:10] is the sub-list for method input_type
 	4,  // [4:4] is the sub-list for extension type_name
 	4,  // [4:4] is the sub-list for extension extendee
 	0,  // [0:4] is the sub-list for field type_name
```

## api/student/student.proto (+6 -0)

```diff
@@ -33,6 +33,12 @@
   rpc ListStudents(ListStudentsRequest) returns (ListStudentsReply) {
     option (google.api.http) = {get: "/students"};
   }
+
+  // Keeps one connection open: each student id sent in gets that student back.
+  // Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+  rpc LookupStudents(stream GetStudentRequest) returns (stream GetStudentReply) {
+    option (google.api.http) = {get: "/students/lookup/stream"};
+  }
 }
 
 message StudentInfo {
```

## api/student/student_grpc.pb.go (+43 -6)

```diff
@@ -19,11 +19,12 @@
 const _ = grpc.SupportPackageIsVersion9
 
 const (
-	StudentService_CreateStudent_FullMethodName = "/student.StudentService/CreateStudent"
-	StudentService_UpdateStudent_FullMethodName = "/student.StudentService/UpdateStudent"
-	StudentService_DeleteStudent_FullMethodName = "/student.StudentService/DeleteStudent"
-	StudentService_GetStudent_FullMethodName    = "/student.StudentService/GetStudent"
-	StudentService_ListStudents_FullMethodName  = "/student.StudentService/ListStudents"
+	StudentService_CreateStudent_FullMethodName  = "/student.StudentService/CreateStudent"
+	StudentService_UpdateStudent_FullMethodName  = "/student.StudentService/UpdateStudent"
+	StudentService_DeleteStudent_FullMethodName  = "/student.StudentService/DeleteStudent"
+	StudentService_GetStudent_FullMethodName     = "/student.StudentService/GetStudent"
+	StudentService_ListStudents_FullMethodName   = "/student.StudentService/ListStudents"
+	StudentService_LookupStudents_FullMethodName = "/student.StudentService/LookupStudents"
 )
 
 // StudentServiceClient is the client API for StudentService service.
@@ -35,6 +36,9 @@
 	DeleteStudent(ctx context.Context, in *DeleteStudentRequest, opts ...grpc.CallOption) (*DeleteStudentReply, error)
 	GetStudent(ctx context.Context, in *GetStudentRequest, opts ...grpc.CallOption) (*GetStudentReply, error)
 	ListStudents(ctx context.Context, in *ListStudentsRequest, opts ...grpc.CallOption) (*ListStudentsReply, error)
+	// Keeps one connection open: each student id sent in gets that student back.
+	// Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+	LookupStudents(ctx context.Context, opts ...grpc.CallOption) (grpc.BidiStreamingClient[GetStudentRequest, GetStudentReply], error)
 }
 
 type studentServiceClient struct {
@@ -95,6 +99,19 @@
 	return out, nil
 }
 
+func (c *studentServiceClient) LookupStudents(ctx context.Context, opts ...grpc.CallOption) (grpc.BidiStreamingClient[GetStudentRequest, GetStudentReply], error) {
+	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
+	stream, err := c.cc.NewStream(ctx, &StudentService_ServiceDesc.Streams[0], StudentService_LookupStudents_FullMethodName, cOpts...)
+	if err != nil {
+		return nil, err
+	}
+	x := &grpc.GenericClientStream[GetStudentRequest, GetStudentReply]{ClientStream: stream}
+	return x, nil
+}
+
+// This type alias is provided for backwards compatibility with existing code that references the prior non-generic stream type by name.
+type StudentService_LookupStudentsClient = grpc.BidiStreamingClient[GetStudentRequest, GetStudentReply]
+
 // StudentServiceServer is the server API for StudentService service.
 // All implementations must embed UnimplementedStudentServiceServer
 // for forward compatibility.
@@ -104,6 +121,9 @@
 	DeleteStudent(context.Context, *DeleteStudentRequest) (*DeleteStudentReply, error)
 	GetStudent(context.Context, *GetStudentRequest) (*GetStudentReply, error)
 	ListStudents(context.Context, *ListStudentsRequest) (*ListStudentsReply, error)
+	// Keeps one connection open: each student id sent in gets that student back.
+	// Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+	LookupStudents(grpc.BidiStreamingServer[GetStudentRequest, GetStudentReply]) error
 	mustEmbedUnimplementedStudentServiceServer()
 }
 
@@ -129,6 +149,9 @@
 func (UnimplementedStudentServiceServer) ListStudents(context.Context, *ListStudentsRequest) (*ListStudentsReply, error) {
 	return nil, status.Error(codes.Unimplemented, "method ListStudents not implemented")
 }
+func (UnimplementedStudentServiceServer) LookupStudents(grpc.BidiStreamingServer[GetStudentRequest, GetStudentReply]) error {
+	return status.Error(codes.Unimplemented, "method LookupStudents not implemented")
+}
 func (UnimplementedStudentServiceServer) mustEmbedUnimplementedStudentServiceServer() {}
 func (UnimplementedStudentServiceServer) testEmbeddedByValue()                        {}
 
@@ -240,6 +263,13 @@
 	return interceptor(ctx, in, info, handler)
 }
 
+func _StudentService_LookupStudents_Handler(srv interface{}, stream grpc.ServerStream) error {
+	return srv.(StudentServiceServer).LookupStudents(&grpc.GenericServerStream[GetStudentRequest, GetStudentReply]{ServerStream: stream})
+}
+
+// This type alias is provided for backwards compatibility with existing code that references the prior non-generic stream type by name.
+type StudentService_LookupStudentsServer = grpc.BidiStreamingServer[GetStudentRequest, GetStudentReply]
+
 // StudentService_ServiceDesc is the grpc.ServiceDesc for StudentService service.
 // It's only intended for direct use with grpc.RegisterService,
 // and not to be introspected or modified (even as a copy)
@@ -268,6 +298,13 @@
 			Handler:    _StudentService_ListStudents_Handler,
 		},
 	},
-	Streams:  []grpc.StreamDesc{},
+	Streams: []grpc.StreamDesc{
+		{
+			StreamName:    "LookupStudents",
+			Handler:       _StudentService_LookupStudents_Handler,
+			ServerStreams: true,
+			ClientStreams: true,
+		},
+	},
 	Metadata: "student/student.proto",
 }
```

## api/student/student_http.pb.go (+98 -0)

```diff
@@ -21,6 +21,7 @@
 const OperationStudentServiceDeleteStudent = "/student.StudentService/DeleteStudent"
 const OperationStudentServiceGetStudent = "/student.StudentService/GetStudent"
 const OperationStudentServiceListStudents = "/student.StudentService/ListStudents"
+const OperationStudentServiceLookupStudents = "/student.StudentService/LookupStudents"
 const OperationStudentServiceUpdateStudent = "/student.StudentService/UpdateStudent"
 
 type StudentServiceHTTPServer interface {
@@ -28,6 +29,9 @@
 	DeleteStudent(context.Context, *DeleteStudentRequest) (*DeleteStudentReply, error)
 	GetStudent(context.Context, *GetStudentRequest) (*GetStudentReply, error)
 	ListStudents(context.Context, *ListStudentsRequest) (*ListStudentsReply, error)
+	// LookupStudents Keeps one connection open: each student id sent in gets that student back.
+	// Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+	LookupStudents(StudentService_LookupStudentsServer) error
 	UpdateStudent(context.Context, *UpdateStudentRequest) (*UpdateStudentReply, error)
 }
 
@@ -38,8 +42,24 @@
 	r.Handle("DELETE", "/students/{id}", _StudentService_DeleteStudent0_HTTP_Handler(srv))
 	r.Handle("GET", "/students/{id}", _StudentService_GetStudent0_HTTP_Handler(srv))
 	r.Handle("GET", "/students", _StudentService_ListStudents0_HTTP_Handler(srv))
+	r.Handle("GET", "/students/lookup/stream", _StudentService_LookupStudents0_HTTP_Handler(srv))
 }
 
+type StudentService_LookupStudentsHTTPServer struct {
+	http.ServerStream
+}
+
+func (x *StudentService_LookupStudentsHTTPServer) Send(m *GetStudentReply) error {
+	return x.ServerStream.Send(m)
+}
+func (x *StudentService_LookupStudentsHTTPServer) Recv() (*GetStudentRequest, error) {
+	m := new(GetStudentRequest)
+	if err := x.ServerStream.Recv(m); err != nil {
+		return nil, err
+	}
+	return m, nil
+}
+
 func _StudentService_CreateStudent0_HTTP_Handler(srv StudentServiceHTTPServer) func(ctx http.Context) error {
 	return func(ctx http.Context) error {
 		var in CreateStudentRequest
@@ -144,11 +164,30 @@
 	}
 }
 
+func _StudentService_LookupStudents0_HTTP_Handler(srv StudentServiceHTTPServer) func(ctx http.Context) error {
+	return func(ctx http.Context) error {
+		stream, err := http.NewWebSocketServerStream(ctx)
+		if err != nil {
+			return err
+		}
+		http.SetOperation(ctx, OperationStudentServiceLookupStudents)
+		h := ctx.Middleware(func(ctx context.Context, req interface{}) (interface{}, error) {
+			stream.SetContext(ctx)
+			return nil, srv.LookupStudents(&StudentService_LookupStudentsHTTPServer{ServerStream: stream})
+		})
+		_, err = h(ctx, nil)
+		return stream.Close(err)
+	}
+}
+
 type StudentServiceHTTPClient interface {
 	CreateStudent(ctx context.Context, req *CreateStudentRequest, opts ...http.CallOption) (rsp *CreateStudentReply, err error)
 	DeleteStudent(ctx context.Context, req *DeleteStudentRequest, opts ...http.CallOption) (rsp *DeleteStudentReply, err error)
 	GetStudent(ctx context.Context, req *GetStudentRequest, opts ...http.CallOption) (rsp *GetStudentReply, err error)
 	ListStudents(ctx context.Context, req *ListStudentsRequest, opts ...http.CallOption) (rsp *ListStudentsReply, err error)
+	// LookupStudents Keeps one connection open: each student id sent in gets that student back.
+	// Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+	LookupStudents(ctx context.Context, opts ...http.CallOption) (StudentService_LookupStudentsClient, error)
 	UpdateStudent(ctx context.Context, req *UpdateStudentRequest, opts ...http.CallOption) (rsp *UpdateStudentReply, err error)
 }
 
@@ -160,6 +199,52 @@
 	return &StudentServiceHTTPClientImpl{client}
 }
 
+type StudentService_LookupStudentsHTTPClient struct {
+	http.ClientStream
+	ctx     context.Context
+	cc      *http.Client
+	pattern string
+	opts    []http.CallOption
+}
+
+func (x *StudentService_LookupStudentsHTTPClient) open(m *GetStudentRequest) error {
+	if x.ClientStream != nil {
+		return nil
+	}
+	opts := x.opts
+	path := http.BuildPath(x.pattern, m, http.WithQueryParams())
+	stream, err := x.cc.WebSocket(x.ctx, path, opts...)
+	if err != nil {
+		return err
+	}
+	x.ClientStream = stream
+	return nil
+}
+
+func (x *StudentService_LookupStudentsHTTPClient) CloseSend() error {
+	if err := x.open(nil); err != nil {
+		return err
+	}
+	return x.ClientStream.CloseSend()
+}
+
+func (x *StudentService_LookupStudentsHTTPClient) Send(m *GetStudentRequest) error {
+	if err := x.open(m); err != nil {
+		return err
+	}
+	return x.ClientStream.Send(m)
+}
+func (x *StudentService_LookupStudentsHTTPClient) Recv() (*GetStudentReply, error) {
+	if err := x.open(nil); err != nil {
+		return nil, err
+	}
+	m := new(GetStudentReply)
+	if err := x.ClientStream.Recv(m); err != nil {
+		return nil, err
+	}
+	return m, nil
+}
+
 func (c *StudentServiceHTTPClientImpl) CreateStudent(ctx context.Context, in *CreateStudentRequest, opts ...http.CallOption) (*CreateStudentReply, error) {
 	var out CreateStudentReply
 	pattern := "/students"
@@ -223,6 +308,19 @@
 		return nil, err
 	}
 	return &out, nil
+}
+
+// LookupStudents Keeps one connection open: each student id sent in gets that student back.
+// Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+func (c *StudentServiceHTTPClientImpl) LookupStudents(ctx context.Context, opts ...http.CallOption) (StudentService_LookupStudentsClient, error) {
+	pattern := "/students/lookup/stream"
+	opts = append([]http.CallOption{
+		http.Accept("application/protojson"),
+		http.ContentType("application/protojson"),
+		http.Operation(OperationStudentServiceLookupStudents),
+		http.PathTemplate(pattern),
+	}, opts...)
+	return &StudentService_LookupStudentsHTTPClient{ctx: ctx, cc: c.cc, pattern: pattern, opts: opts}, nil
 }
 
 func (c *StudentServiceHTTPClientImpl) UpdateStudent(ctx context.Context, in *UpdateStudentRequest, opts ...http.CallOption) (*UpdateStudentReply, error) {
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

## internal/service/student.go (+23 -0)

```diff
@@ -2,6 +2,8 @@
 
 import (
 	"context"
+	"errors"
+	"io"
 
 	pb "github.com/yylego/kratos-examples/demo1kratos/api/student"
 	"github.com/yylego/kratos-examples/demo1kratos/internal/biz"
@@ -88,4 +90,25 @@
 		items = append(items, &pb.StudentInfo{Id: v.ID, Name: v.Name, Age: v.Age, ClassName: v.ClassName})
 	}
 	return &pb.ListStudentsReply{Students: items, Count: count}, nil
+}
+
+// LookupStudents answers each student id that comes in with that student, until the client stops sending.
+// A failed lookup (such as a missing student) ends the stream with that error.
+func (s *StudentService) LookupStudents(stream pb.StudentService_LookupStudentsServer) error {
+	for {
+		req, err := stream.Recv()
+		if errors.Is(err, io.EOF) {
+			return nil
+		}
+		if err != nil {
+			return err
+		}
+		reply, err := s.GetStudent(stream.Context(), req)
+		if err != nil {
+			return err
+		}
+		if err := stream.Send(reply); err != nil {
+			return err
+		}
+	}
 }
```

## openapi.yaml (+20 -0)

```diff
@@ -46,6 +46,26 @@
                         application/json:
                             schema:
                                 $ref: '#/components/schemas/student.CreateStudentReply'
+    /students/lookup/stream:
+        get:
+            tags:
+                - StudentService
+            description: |-
+                Keeps one connection open: each student id sent in gets that student back.
+                 Kratos v3 serves this duplex method through HTTP as a WebSocket on a GET route.
+            operationId: StudentService_LookupStudents
+            parameters:
+                - name: id
+                  in: query
+                  schema:
+                    type: string
+            responses:
+                "200":
+                    description: OK
+                    content:
+                        application/json:
+                            schema:
+                                $ref: '#/components/schemas/student.GetStudentReply'
     /students/{id}:
         get:
             tags:
```


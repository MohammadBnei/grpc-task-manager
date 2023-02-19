# gRPC Task Manager

## How to update a field in a task

1. Change the task message in the [task proto](/proto/task/v1beta/task.proto)
2. Push the proto file
   - on the main branch
   - on any branch with a name starting with feat/** 
3. Wait ~30s, then pull the generated stubs
4. Update the [task schema](/server/src/task/entity/task.schema.ts)
   - add your fields
5. Update the converter from server entity to grpc message from the [task service](/server/src/task/task.service.ts)


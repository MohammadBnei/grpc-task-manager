# !bin/sh

buf generate
buf export . --output ../api/task-api/src/proto
buf export . --output ../api/user-api/src/proto
buf export . --output ../api/auth-api/src/proto
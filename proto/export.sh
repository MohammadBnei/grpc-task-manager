# !bin/sh

buf generate
buf export . --output ../task-api/src/proto
buf export . --output ../user-api/src/proto
buf export . --output ../auth-api/src/proto
buf export . --output ../hero/src/proto
# !bin/sh

./buf.exe generate
./buf.exe export . --output ../task-api/src/proto
./buf.exe export . --output ../user-api/src/proto
./buf.exe export . --output ../auth-api/src/proto
./buf.exe export . --output ../media-api/src/proto
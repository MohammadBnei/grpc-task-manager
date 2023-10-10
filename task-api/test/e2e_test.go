package test_test

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"testing"
	"time"
	"task-test/taskv1beta/task/v1beta"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/stretchr/testify/assert"
)

var (
	addr = flag.String("addr", "localhost:5004", "the address to connect to")
	c    taskv1beta.TaskServiceClient
)

func TestMain(m *testing.M) {
	flag.Parse()
	// Set up a connection to the server.
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c = taskv1beta.NewTaskServiceClient(conn)
	code := m.Run()
	os.Exit(code)
}

func TestCreateTask(t *testing.T) {
	taskName := fmt.Sprintf("test-%v", time.Now().Second())
	res, err := c.CreateTask(context.Background(), &taskv1beta.CreateTaskRequest{
		Task: &taskv1beta.Task{
			Name: taskName,
			DueDate: "2023-01-01",
		},
	})
	assert.NoError(t, err)
	
	task := res.Task
	if assert.NotNil(t, task) {
		assert.Equal(t, taskName, task.Name)
		assert.Equal(t, "2023-01-01T00:00:00.000Z", task.DueDate)
	}
}


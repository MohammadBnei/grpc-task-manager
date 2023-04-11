package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	userPb "buf.build/gen/go/bneiconseil/taskmanagerapi/protocolbuffers/go/user/v1alpha"
	amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

type createdRes struct {
	Data    *userPb.User `json:"data"`
	Pattern string       `json:"pattern"`
}

func main() {
	// Get the connection string from the environment variable
	url := os.Getenv("AMQP_URL")

	//If it doesn't exist, use the default connection string.

	if url == "" {
		//Don't do this in production, this is for testing purposes only.
		url = "amqp://guest:guest@localhost:5672"
	}

	// Connect to the rabbitMQ instance
	connection, err := amqp.Dial(url)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer connection.Close()

	channel, err := connection.Channel()
	failOnError(err, "Failed to open a channel")
	defer channel.Close()

	msg, err := channel.Consume("users_queue", "user-created", false, false, false, false, nil)
	failOnError(err, "Failed to register a consumer")
	for d := range msg {
		var body createdRes
		err := json.Unmarshal(d.Body, &body)
		failOnError(err, "Failed to unmarshal a message")
		fmt.Println(body)
	}
}

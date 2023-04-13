package main

import (
	"log"
	"strings"

	sasl "github.com/emersion/go-sasl"
	smtp "github.com/emersion/go-smtp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func main() {
	auth := sasl.NewPlainClient("", "mohammad", ";PitaMail56")
	// Connect to the server, authenticate, set the sender and recipient,
	// and send the email all in one step.
	to := []string{"mohammadamine.banaei@pm.me"}
	message := strings.NewReader("To: recipient@example.net\r\n" +
		"Subject: discount Gophers!\r\n" +
		"\r\n" +
		"This is the email body.\r\n")
	err := smtp.SendMail("mail.bnei.dev:587", auth, "test@bnei.dev", to, message)
	failOnError(err, "Failed to send email")

}

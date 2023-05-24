# SvelteKit gRPC

## Goal

This is the front-end part of the grpc task manager application. Its aim is to provide a gRPC transcription to the browser, using sveltekit endpoint to translate from and to the technology.

## How it works

For unary gRPC calls, we use a combination of sveltekit's endpoint and form action.

For server side streaming, we use a translator from gRPC stream to SSE.

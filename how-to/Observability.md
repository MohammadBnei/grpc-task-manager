# Observability

To understand what is going on in our microservices microcosm, we need to implement observability. There is 3 type of elements we want to observe :
 - **Tracing**. This is useful to see the global architecture by following requests from api to api. We can then create schemes and diagram in real time.
 - **Metrics**. How well our apis are behaving ? Where are the bottlenecks ? It's useful to have metrics for performance of course, and to understand where we should focus our efforts.
 - **Logging**

There is a concensus now in the microservices world to use [**OpenTelemetry**](https://opentelemetry.io/docs/). The goal is to link all the previously defined elements, and to extract the maximum informations from them.  

## Open Telemetry

OpenTelemetry is a popular open source framework for distributed tracing, metrics and logging. It provides a standardized way to collect observability data from different systems and services and export it to different backends such as Jaeger, Prometheus, and AWS X-Ray. 

OpenTelemetry also offers support for different programming languages (including Node.js, Java, Go, Python, and more) and allows for customization and flexibility in terms of what data is collected, how it's processed, and where it's exported.

In addition, OpenTelemetry is designed to be vendor-agnostic and interoperable, allowing for easy integration with other observability tools and frameworks. It's gaining popularity in the microservices community as a powerful and flexible observability solution.

### Traces & Span

Spans and traces are core concepts in distributed tracing, which is a key pillar of observability in microservices.

In a distributed system, a single user request typically involves multiple service calls across different nodes and services. Each of these interactions is called a span, which represents a single unit of work in the service. 

Traces are a collection of spans that represent the full path of a user request through the system. In other words, a trace is a sequence of spans that show how the request passed through the various services involved.

Conceptually, you can think of a trace as a sequence of steps that represent the execution of a user request from the start to the end. Each step (or span) captures some information about the work that was done, such as the service that was called, the time it took, any errors that occurred, and so on.

To capture this information, each span typically includes an ID that links it to the rest of the trace, start and end timestamps, metadata about the service call (such as the URL and HTTP method), and a set of attributes (such as the result of the call and any error messages).

Traces and spans are important components of observability because they provide a way to track a user request across multiple services, understand how it's performing, and troubleshoot errors or performance issues. By analyzing traces and spans, we can identify bottlenecks, optimize performance, and improve the overall reliability of our system.

## NestJS

There is a set of packages to automatically add opentelemtry to any nestjs application. 

They all start with '@opentelemetry', and they inject themselves in the rest/gRPC/GraphQL processes. That is why they have to be called before anything else.

You can look at the [task-api tracing file](../task-api/src/config/tracing.ts) to have an example. Here, we only implement tracing export and logging trace injection.

So, when our apis are communication with each other, the calls are registered and sent to a collector. This collector is responsible for understanding the informations, linking request together (from the original sender to the final response, tracing hops between apis) and showing us the result in multiple forms (diagrams, schemes, timetable...).

In our case, we use [Jaeger](https://www.jaegertracing.io) to do that.

## Adding OpenTelemetry Observability to a NestJS gRPC API

Observability is critical for any software system, and adding OpenTelemetry observability to a NestJS gRPC API can significantly help with this task. OpenTelemetry provides a vendor-neutral open-source framework for collecting, processing, and exporting telemetry data from distributed systems. In this tutorial, we will learn how to add OpenTelemetry observability to a NestJS gRPC API using the OpenTelemetry Node.js SDK.

### Prerequisites
- Node.js 12 or later installed on your machine
- Basic knowledge of NestJS and gRPC

### Step 1: Install Dependencies
First, we need to install the following packages:
```shell
$ npm i @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node @opentelemetry/sdk-metrics @opentelemetry/exporter-trace-otlp-proto @opentelemetry/instrumentation-grpc @opentelemetry/instrumentation-winston @opentelemetry/semantic-conventions
```
These packages are needed for adding OpenTelemetry observability to NestJS gRPC API.

### Step 2: Add OpenTelemetry tracing to the NestJS app
In the `tracing.ts` file, we define the `NodeTracerProvider` with a resource that will identify our service name and service version. Additionally, we add the `SimpleSpanProcessor` and `OTLPTraceExporter` to send our trace data to the Jaeger backend running on `http://localhost:4318/v1/traces`. We also add instrumentation for Winston and gRPC via the `registerInstrumentations()` method that comes with the OpenTelemetry SDK. 

Certainly! Here's a breakdown of each section of the code snippet:

```ts
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
```
This section imports the necessary modules from the OpenTelemetry library. They include the `SimpleSpanProcessor` and `NodeTracerProvider` classes, which are used to set up tracing; and the `GrpcInstrumentation` and `WinstonInstrumentation` classes, which are used to automatically instrument gRPC and Winston. Additionally, we import `registerInstrumentations` to easily add instrumentations to our application, `Resource` to set up our service name and version, and `SemanticResourceAttributes` to specify some predefined keys we're using. Finally, we import `OTLPTraceExporter` to export our traced data to the Jaeger backend.

```ts
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: `${process.env.npm_package_name}-${process.env.NODE_ENV}`,
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
});

const provider = new NodeTracerProvider({
  resource,
});

const exporter = new OTLPTraceExporter({
  url: process.env.JAEGER_URL || 'http://localhost:4318/v1/traces',
});

const spanProcessor = new SimpleSpanProcessor(exporter);
provider.addSpanProcessor(spanProcessor);
provider.register();
```
This section sets up the `NodeTracerProvider` with a `Resource` object of `key:value` pairs that identifies our service name and version. We use `SemanticResourceAttributes` to specify some predefined keys we're using. Next, we create an `OTLPTraceExporter` instance to send our traced data to the Jaeger backend running on `http://localhost:4318/v1/traces`. We then create a `SimpleSpanProcessor` instance with the exporter, and add it to the tracer provider using the `addSpanProcessor` method. Finally, we register the provider using the `register` method.

The OTLP trace exporter is a conventionnal export format. We use the rest endpoint, but a grpc one also exists. The exporter is where the span will be sent, and we use jaeger as the collector. 

You can add other resource to further the information on each span.

```ts
// Register instrumentations for gRPC and Winston
registerInstrumentations({
  instrumentations: [
    new GrpcInstrumentation(),
    new WinstonInstrumentation(),
  ],
});
```
This section registers instrumentations for gRPC and Winston. We use `registerInstrumentations` to register the instrumentations to automatically trace these libraries in our application.

But what does these instrumentation actually do ? They will modify how the `@grpc/grpc-js` behave by adding kind of a hook to it, so the span exporter can be notified whenever a new request arrive. 
Because it modifies the package, the file needs to be called first when the api start.  

That's it! This code sets up OpenTelemetry tracing in our NestJS application using Node.js, which will send traced data from our application to the Jaeger backend.

### Step 3: Update the `main.ts` file
In the very top of the `main.ts` file, import the `tracing.ts` file. 

### Step 4: Start the jaeger collector
In `compose.yml`, there is a tracing service. We use jaeger to collect and visualize the traces. 
Start this service :
```shell
$ docker compose up -d tracing
```

### Step 5: Start the api
Start your api, then make a few request from postman. Then, head into http://localhost:16686 to see the collector ui. You should see your api name in the 'service' dropdown.

### Step 6: Adding instrumentation
See [here](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node) for the full list of nodejs instrumentation. Choose the one corresponding to your database and add it to the `tracing.ts` file.
### Conclusion
Adding OpenTelemetry observability to a NestJS gRPC API is an essential task. In this tutorial, we learned how to set up OpenTelemetry tracing with NestJS and gRPC using the OpenTelemetry Node.js SDK and Jaeger backend. With this set up, we can gain greater insight into our NestJS gRPC API and improve overall performance and reliability.
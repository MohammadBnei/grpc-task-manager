# Observability

To understand what is going on in our microservices microcosm, we need to implement observability. There is 3 type of elements we want to observe :
 - **Tracing**. This is useful to see the global architecture by following requests from api to api. We can then create schemes and diagram in real time.
 - **Metrics**. How well our apis are behaving ? Where are the bottlenecks ? It's useful to have metrics for performance of course, and to understand where we should focus our efforts.
 - **Logging**

There is a concensus now in the microservices world to use [OpenTelemetry](https://opentelemetry.io/docs/). The goal is to link all the previously defined elements, and to extract the maximum informations from them.  

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
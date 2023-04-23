# Observability

To understand what is going on in our microservices microcosm, we need to implement observability. There is 3 type of elements we want to observe :
 - **Tracing**. This is useful to see the global architecture by following requests from api to api. We can then create schemes and diagram in real time.
 - **Metrics**. How well our apis are behaving ? Where are the bottlenecks ? It's useful to have metrics for performance of course, and to understand where we should focus our efforts.
 - **Logging**

There is a concensus now in the microservices world to use [OpenTelemetry](https://opentelemetry.io/docs/). The goal is to link all the previously defined elements, and to extract the maximum informations from them. 

## NestJS

There is a set of packages to automatically add opentelemtry to any nestjs application. 

They all start with '@opentelemetry', and they inject themselves in the rest/gRPC/GraphQL processes. That is why they have to be called before anything else.

You can look at the [task-api tracing file](../task-api/src/config/tracing.ts) to have an example. Here, we only implement tracing export and logging trace injection.

So, when our apis are communication with each other, the calls are registered and sent to a collector. This collector is responsible for understanding the informations, linking request together (from the original sender to the final response, tracing hops between apis) and showing us the result in multiple forms (diagrams, schemes, timetable...).

In our case, we use [Jaeger](https://www.jaegertracing.io) to do that. 

## Logging

# Observable

An RxJS Observable is an object that represents a stream of data that can be observed over time. It can emit a sequence of values, which can be subscribed to with an observer. In other words, an Observable is like a stream of information that can be subscribed to and acted upon when certain events occur.

To use Observables in RxJS, you generally start by creating an Observable instance, which can be done using the `Observable.create()` method. This method takes a function that defines the behavior of the observable, including how and when it emits values.

Once you have created an Observable, you can subscribe to it using the `subscribe()` method. This method takes an observer that defines what happens when the Observable emits values. For example, you can define what happens when a value is emitted, what happens when an error occurs, and what happens when the stream is complete.

Overall, Observables are a powerful tool for working with streams of data in RxJS, and understanding how to create and use them is an important part of working with the library.

## Design pattern

The design pattern that Observables adopt is the Observer pattern. This pattern describes a relationship between objects where an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any changes to its state.

In the case of RxJS, the Observable is the subject, and the observers are the subscribers. Observables emit data to subscribers when changes occur, whether those changes are prompted by user input, server responses, or other events.

The Observer pattern is a powerful approach to managing application state, as it enables developers to decouple state from the components that rely on it. Observables promote a reactive programming model, where instead of initiating actions, the application reacts to changes as they occur, making it easier to manage complex state over time.

Overall, the Observer pattern is an established and proven design pattern, and its adaptation in the form of Observables has been a key factor in the success and popularity of RxJS.
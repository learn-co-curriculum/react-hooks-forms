# React Controlled Components

## Overview

In this lesson, we'll discuss how to set up a controlled form in React.

## Objectives

1. Explain how React uses `value` on, e.g., `<input>`
2. Check whether a component is controlled or uncontrolled
3. Describe strategies for using controlled components
4. Use controlled inputs to validate values
5. Distinguish between `value` and `defaultValue` in a React controlled
   component

## Code Along

If you want to code along there is starter code in the `src` folder. Make sure
to run `npm install && npm start` to see the code in the browser.

## Controlling Form Values From State

Forms in React are similar to their regular HTML counterparts. The JSX we write
is almost identical. The way we store and handle form data, however, is entirely
new. In React, it is often a good idea to set up _controlled_ forms. A
controlled form is **a form that derives its input values from state**. Consider
the following:

```js
import React, { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Henry");

  return (
    <form>
      <input type="text" value={firstName} />
      <input type="text" value={lastName} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
```

With the setup above, the two text `input` elements will display the
corresponding state values.

![Diagram of the form component's state populating a form](https://curriculum-content.s3.amazonaws.com/react/react-forms/Image_20_Flowchart.png)

This code is not quite complete though &mdash; as it is now, there is no way to
_change_ the state. The inputs in the form above will be stuck displaying
whatever state is set to.

To completely control a form, we also need our form to _update_ state.

## Updating State via Forms

If we can change state values, React will re-render and our `input`s will
display the new state. We know that `setFirstName` and `setLastName` are what
we'll need to initiate a state change, but when would we use them?

We want to fire it **every time the form changes**. Forms should display
whatever changes a user makes, even if it is adding a single letter in an input.
For this, we use an event listener, `onChange`, that React has set up for us:

```js
<input type="text" onChange={handleFirstNameChange} value={firstName} />
<input type="text" onChange={handleLastNameChange} value={lastName} />
```

Form inputs in React come with specific events. `onChange` will fire every time
the value of an input changes. In our example, we're passing a callback function
function that accepts `event` as its argument. The `event` data being passed in
is automatically provided by the `onChange` event listener. Let's write out
what these functions look like:

```js
function handleFirstNameChange(event) {
  setFirstName(event.target.value);
}

function handleLastNameChange(event) {
  setLastName(event.target.value);
}
```

The `event` contains data about the `target`, which is whatever DOM element the
`event` was triggered on. That `target`, being an `input` element, has a `value`
attribute. This attribute is equal to whatever is currently entered into that
particular `input`!

Keep in mind, **this is not the value we provided from state**. When we read
`event.target.value`, we get whatever content is present when the event fired.
In the case of our first input, that would be a combination of whatever
`firstName` is equal to _plus_ **the last key stroke**. If you pressed 's',
`event.target.value` would equal "Johns".

Inside both functions is a `setState()`. Again, both functions are nearly
identical, with one difference &mdash; `setFirstName()` changes the `firstName`,
and `setLastName()` changes the `lastName`. The full component would look like
the following:

```js
import React, { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Henry");

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  return (
    <form>
      <input type="text" onChange={handleFirstNameChange} value={firstName} />
      <input type="text" onChange={handleLastNameChange} value={lastName} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
```

In the `handleFirstNameChange()` and `handleLastNameChange()` functions, we're
updating state based on `event.target.value`. This, in turn, causes a
re-render... and the cycle completes. The _new_ state values we just set are
used to set the `value` attributes of our two `input`s. From a user's
perspective, the form behaves exactly how we'd expect, displaying the text that
is typed. From React's perspective, we gain control over form values, giving us
the ability to more easily manipulate (or restrict) what our `inputs`s display,
and send form data to other parts of the app or out onto the internet...

![Diagram of onChange events](https://curriculum-content.s3.amazonaws.com/react/react-forms/Image_21_FlowchartUpdate.png)

Controlling forms makes it more convenient to share form values between
components. Since the form values are stored in state, they are easily passed
down as props or sent upward via a function supplied in props.

## Submitting a Controlled Form

Now that we're controlling the form with `state`, we want to set up a way to
submit our form. For this, we use a second event, `onSubmit`, added to the
`form` in JSX:

```js
return (
  <form onSubmit={handleSubmit}>
    <input type="text" onChange={handleFirstNameChange} value={firstName} />
    <input type="text" onChange={handleLastNameChange} value={lastName} />
    <button type="submit">Submit</button>
  </form>
);
```

Now, whenever the form is submitted (by pressing `Enter`/`Return`, or clicking a
Submit button), a callback function will be called, `handleSubmit`. We don't
have a function `handleSubmit` yet, so let's write one out:

```js
function handleSubmit(event) {
  event.preventDefault();
  const formData = { firstName: firstName, lastName: lastName };
  props.sendFormDataSomewhere(formData);
  setFirstName("");
  setLastName("");
}
```

Let's look at each of the three lines of code in this function:

- `event.preventDefault()`: The default behavior of a form is to
  [try and submit the form data based on a defined action][], causing
  a redirect. We didn't (and don't need to) define an action. The result,
  however, is that the form redirects to the current page, causing a refresh.
  By using `event.preventDefault()`, we stop this behavior from happening.

[try and submit the form data based on a defined action]: https://www.w3schools.com/html/html_forms.asp

- `const formData = { firstName: firstName, lastName: lastName }`: Here, we are putting
  together the current form data into an object using the values stored in state.

- `props.sendFormDataSomewhere(formData)`: A form, when submitted should send
  the form data somewhere. As mentioned a moment ago, the traditional HTML way
  was to send data to a server or another page using the `action` attribute. In
  React, we handle requests with asynchronous JavaScript. We won't go into the
  details of how this works just yet, but we can think of
  `sendFormDataSomewhere()` as the code that handles sending our data off. This
  function might be defined in the same form component, but is more often
  provided as a prop.
- `setFirstName("")`: if we want to clear the input fields, all we need to do is
  set state! In a traditional JavaScript form, you might do something like
  `event.target.reset()` to clear out the form fields. Here, we need to ensure
  that our component state matches what the user sees in the form. By setting
  state, we're keeping our React component state in sync with what the user
  sees.

We don't have a server to send our data to, but to demonstrate submission, we could
modify our `Form` component to list out submissions, storing them in state:

```js
import React, { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Henry");
  const [submittedData, setSubmittedData] = useState([]);

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = { firstName: firstName, lastName: lastName };
    const dataArray = [...submittedData, formData];
    setSubmittedData(dataArray);
    setFirstName("");
    setLastName("");
  }

  const listOfSubmissions = submittedData.map((data, index) => {
    return (
      <div key={index}>
        {data.firstName} {data.lastName}
      </div>
    );
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleFirstNameChange} value={firstName} />
        <input type="text" onChange={handleLastNameChange} value={lastName} />
        <button type="submit">Submit</button>
      </form>
      <h3>Submissions</h3>
      {listOfSubmissions}
    </div>
  );
}

export default Form;
```

The above component will render previous form submissions on the page! We have
a fully functioning controlled form.

## More on Forms

Form elements include `<input>`, `<textarea>`, `<select>`, and `<form>` itself.
When we talk about inputs in this lesson, we broadly mean the form elements
(`<input>`, `<textarea>`, `<select>`) and not always specifically just
`<input>`.

To control the value of these inputs, we use a prop specific to that type of input:

- For `<input>`, `<textarea>`, and `<option>`, we use `value`, as we have seen.

- For `<input type="checkbox">`, we use `checked`

Each of these attributes can be set based on a state value. Each also has an
`onChange` event listener, allowing us to update state when a user interacts
with a form.

## Uncontrolled vs Controlled Components

![Kpop](https://media.giphy.com/media/QcnfLD17Ebt28/giphy.gif)

React provides us with two ways of setting and getting values in form elements.
These two methods are called _uncontrolled_ and _controlled_ components. The
differences are subtle, but it's important to recognize them — and use them
accordingly (spoiler: most of the time, we'll use _controlled_ components).

The quickest way to check if a component is controlled or uncontrolled is to
check for `value` or `defaultValue`. If the component has a `value` prop, it is
controlled (the state of the component is being controlled by React). If it
doesn't have a `value` prop, it's an uncontrolled component. Uncontrolled
components can optionally have a `defaultValue` prop to set its initial value.
These two props (`value` and `defaultValue`) are _mutually exclusive_: a
component is either controlled or uncontrolled, but it cannot be both.

### Uncontrolled Components

In uncontrolled components, the state of the component's value is kept in the
DOM itself like a regular old HTML form &mdash; in other words, the form element
in question (e.g. an `<input>`) has its _own internal state_. To retrieve that
value, we would need direct access to the DOM component that holds the value,
_or_ we'd have to add an `onChange` handler.

To set an initial value for the element, we'd use the `defaultValue` prop. We
can't use the `value` prop for this: we're not using state to explicitly store
its value, so the component would never update its value anymore (since we're
rendering the same thing). Uncontrolled forms still work just fine in React.

To submit an uncontrolled form, we can use the `onSubmit` handler just as before:

```js
<form onSubmit={handleSubmit}>...</form>
```

All the form data in an uncontrolled form is accessible within the `event`, but
accessing _can_ sometimes be a pain, as you end up writing things like
`event.target.firstName.value` to get the value of our first input.

```js
function handleSubmit(event) {
  event.preventDefault();
  const firstName = event.target.firstName.value;
  const lastName = event.target.lastName.value;
  props.sendFormDataSomewhere({ firstName: firstName, lastName: lastName });
}
```

On a larger form this can turn into some dense code.

#### Controlled Component

In controlled components, we explicitly set the value of a component using
state, and update that value in response to any changes the user makes. While
it takes a little bit of set up to implement, it makes some other parts of our
code easier. For instance, in a basic controlled form, our `handleSubmit()`
function can be relatively simple if our initial state is an object:

```js
const [formData, setFormData] = useState({ firstName: "", lastName: "" });

function handleSubmit(event) {
  event.preventDefault();
  props.sendFormDataSomewhere(formData);
}
```

If our entire state object is just the controlled form data, we can send the
entire object around wherever it needs to go. Not only that, if we expanded our
form to have _20_ controlled inputs, this `handleSubmit` doesn't change. It just
sends all _20_ state values wherever we need them to go upon submission.

## Why Use Controlled Forms When We Do Not Have To

Controlled forms can very useful for specific purposes - since we can set our
state _elsewhere_ using this setup, its easy to populate forms from existing
available data.

When we have a controlled form, the state does not need to be stored in the same
component. We could store state in a parent component, instead. To demonstrate
this, we'll need to create a new component. To keep it simple, we'll call this
`ParentComponent`. `ParentComponent` can maintain all the functions while `Form`
just handles the display of JSX:

```js
// src/components/ParentComponent
import React, { useState } from "react";
import Form from "./Form";

function ParentComponent() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Henry");

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  return (
    <Form
      firstName={firstName}
      lastName={lastName}
      handleFirstNameChange={handleFirstNameChange}
      handleLastNameChange={handleLastNameChange}
    />
  );
}

export default ParentComponent;
```

Then `Form` can become:

```js
// src/components/Form
import React from "react";

function Form(props) {
  return (
    <form>
      <input
        type="text"
        onChange={props.handleFirstNameChange}
        value={props.firstName}
      />
      <input
        type="text"
        onChange={props.handleLastNameChange}
        value={props.lastName}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
```

Previously, our application was rendering `Form` directly inside `src/index.js`.
Now, however, we've added a component that _renders_ `Form` as a child. Because
of this change, you'll need to update `src/index.js` so that it renders
`ParentComponent` instead of `Form`.

**Aside**: Submission functionality is omitted here for simplicity. Also, If
you're following along in the example files, don't forget to update `index.js`
to point to `ParentComponent`.

With `ParentComponent`, we've moved all the form logic up one level.

![Diagram of a controlled component using props](https://curriculum-content.s3.amazonaws.com/react/react-forms/Image_22_FlowchartReactProps.png)

Being able to store controlled form data in other components opens some
interesting doors for us. We could, for instance, create another component, a
sibling of `Form`, that live displays our form data:

```js
// src/components/DisplayData
import React from "react";

function DisplayData(props) {
  return (
    <div>
      <h1>{props.firstName}</h1>
      <h1>{props.lastName}</h1>
    </div>
  );
}

export default DisplayData;
```

...and adding it alongside `Form` (also wrapping both in a `div`:

```js
// src/components/ParentComponent
import React, { useState } from 'react';
import Form from './Form'
import DisplayData from './DisplayData'

function ParentComponent() {
  // ...
  return (
    <div>
      <Form
        firstName={firstName}
        lastName={lastName}
        handleFirstNameChange={handleFirstNameChange}
        handleLastNameChange={handleLastNameChange}
      />
      <DisplayData firstName={firstName} lastName={lastName} />
    </div>
  )
}
...
```

Now we have a component that reads from the same state we're changing with
the form.

![Diagram of controlled components using props](https://curriculum-content.s3.amazonaws.com/react/react-forms/Image_23_FlowchartControlled.png)

This can be a very useful way to capture user input and utilize it throughout
your application, even if a server is not involved.

The opposite can also be true. Imagine a user profile page with an 'Edit'
button that opens a form for updating user info. When a user clicks that 'Edit'
button, they expect to see a form with their user data pre-populated. This way,
they can easily make small changes without rewriting all their profile info.

Just like we did with `ParentComponent`, this could be achieved by populating a
form with data from props! After all, if we have a React app that is displaying
user information, that information is stored _somewhere_ on the app

## Conclusion

Using a controlled component is the preferred way to do things in React — it
allows us to keep _all_ component state in the React state, instead of relying
on the DOM to retrieve the element's value through its internal state.

Using a controlled form, whenever our state changes, the component re-renders,
rendering the input with the new updated value. If we don't update the state,
our input will not update when the user types. In other words, we need to
update our input's state _programmatically_.

It might seem a little counterintuitive that we need to be so verbose, but this
actually opens the door to additional functionality. For example, let's say we
want to write an input that only takes the numbers `0` through `5`. We can now
validate the data the user enters _before_ we set it on the state, allowing us
to block any invalid values. If the input is invalid, we simply avoid updating
the state, preventing the input from updating. We could optionally set another
state property (for example, `isInvalidNumber`). Using that state property, we
can show an error in our component to indicate that the user tried to enter an
invalid value.

If we tried to do this using an uncontrolled component, the input would be
entered regardless, since we don't have control over the internal state of the
input. In our `onChange` handler, we'd have to roll the input back to its
previous value, which is pretty tedious!

## Bonus - Abstracting setState When onChange is Triggered

You're still here? Well, while you are, let's talk about the `onChange` event
we've got set up now in initial version of our `Form` component. If we look at
the original code:

```jsx
import React, { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Henry");

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  return (
    <form>
      <input type="text" onChange={handleFirstNameChange} value={firstName} />
      <input type="text" onChange={handleLastNameChange} value={lastName} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
```

We can imagine that adding more input fields to this form is going to get
repetitive pretty fast. For every new input field, we'd need to add:

- a new state variable by calling `useState()` to hold the value of that input
- a new `handleChange` function to update that piece of state

As a first refactor, let's use `useState` just once, and make an object
representing all of our input fields:

```jsx
function Form() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Henry",
  });

  function handleFirstNameChange(event) {
    setFormData({
      ...formData,
      firstName: event.target.value,
    });
  }

  function handleLastNameChange(event) {
    setFormData({
      ...formData,
      lastName: event.target.value,
    });
  }

  return (
    <form>
      <input
        type="text"
        onChange={handleFirstNameChange}
        value={formData.firstName}
      />
      <input
        type="text"
        onChange={handleLastNameChange}
        value={formData.lastName}
      />
    </form>
  );
}
```

Since our initial state is an _object_, we have to copy all the key/value pairs
from the current version of that object into our new state &mdash; that's what
this spread operator here is doing:

```js
setFormData({
  // formData is an object, so we need to copy all the key/value pairs
  ...formData,
  // we want to overwrite the lastName key with a new value
  lastName: event.target.value,
});
```

Now, we just have one object in state to update whenever a the input field
changes. Our change handlers are still a bit verbose, however. Since each one is
changing a different value in our state, we've got them separated here. You can
imagine that once we've got a more complicated form, this route may result in a
very cluttered component. Instead of separate methods, we could actually
condense this down into one abstracted component. Since `event` is being passed
in as the argument, we have access to some of the `event.target` attributes that
may be present.

If we give our inputs `name` attributes, we can access them as `event.target.name`:

```js
<input
  type="text"
  name="firstName"
  value={formData.firstName}
  onChange={handleFirstNameChange}
/>
<input
  type="text"
  name="lastName"
  value={formData.lastName}
  onChange={handleLastNameChange}
/>
```

If we make sure the `name` attributes of our `<input>` fields match keys in our
state, we can write a generic `handleChange` function like so:

```js
function handleChange(event) {
  // name is the KEY in of the formData object we're trying to update
  const name = event.target.name;
  const value = event.target.value;

  setFormData({
    ...formData,
    [name]: value,
  });
}
```

If we connect this method to both of our `input`s, they will both correctly
update state. Why? Because for the first `input`, `event.target.name` is set to
`firstName`, while in the second `input`, it is set to `lastName`. Each
`input`'s `name` attribute will change which part of state is actually updated!

Now, if we want to add a new input field to the form, we just need to add two things:

- a new key in our `formData` state, and
- a new `<input>` field where the `name` attribute matches our new key

We can take it one step further, and also handle `checkbox` inputs in our
`handleChange` input. Since checkboxes have a `checked` attribute instead of the
`value` attribute, here's what we'd need to check what `type` our input is in
order to get the correct value in state.

Here's what the final version of our `Form` component looks like:

```jsx
import React, { useState } from "react";

function Form() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Henry",
    admin: false,
  });

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    // use `checked` property of checkboxes instead of `value`
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        onChange={handleChange}
        value={formData.firstName}
      />
      <input
        type="text"
        name="lastName"
        onChange={handleChange}
        value={formData.lastName}
      />
      <input
        type="checkbox"
        name="admin"
        onChange={handleChange}
        checked={formData.admin}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Resources

- [React Forms](https://reactjs.org/docs/forms.html)

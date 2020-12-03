import React, { useState } from 'react';

function Form() {
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Henry")

  return (
    <form>
      <input type="text" value={firstName} />
      <input type="text" value={lastName} />
    </form>
  )
}

export default Form;
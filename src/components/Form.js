import React, { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newsLetter, setNewsLetter] = useState(false);
 function handleFirstNameChange(event) {
setFirstName(event.target.value);
 }
 function handleLastNameChange(event) {
  setLastName(event.target.value);
   }
   function handleNewsLetterChange(event) {
    setNewsLetter(event.target.checked);

   }



  return (
    <form>
      <input type="text" onChange={handleFirstNameChange} value={firstName} />
      <input type="text" onChange={handleLastNameChange} value={lastName} />
      <input type="checkbox" id="newsletter" onChange={handleNewsLetterChange} checked={newsLetter} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;

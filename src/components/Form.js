import React, {useState} from "react";
// import DisplayData from './DisplayData'


function Form({ firstName, lastName, handleFirstNameChange, handleLastNameChange }) {

  const [number, setNumber] = useState(0)
  const [isInvalidNumber, setIsInvalidNumber] = useState(null)

  function handleNumberChange(e) {
    const newNumber = parseInt(e.target.value)
    if (newNumber >= 0 && newNumber <= 5) {
      setNumber(newNumber)
      setIsInvalidNumber(null)
    } else {
      setIsInvalidNumber(`${newNumber} is not a valid number!`)
    }
  }

  return (
    <div>
    <form>
      <input type="text" onChange={handleFirstNameChange} value={firstName} />
      <input type="text" onChange={handleLastNameChange} value={lastName} />
      <input type="number" onChange={handleNumberChange} value={number} />
      <button type="submit">Submit</button>
    </form>
    {/* <DisplayData firstName={firstName} lastName={lastName} /> */}
    </div>
  );
}

export default Form;

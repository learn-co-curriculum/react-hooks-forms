import React, {useState} from 'react'
import Form from "./Form"
import DisplayData from './DisplayData'

function Parent() {

    const [firstName, setFirstName] = useState("John")
    const [lastName, setLastName] = useState("Henry")

    const handleFirstNameChange = (e) => {
        e.preventDefault()
        setFirstName(e.target.value)
        // console.log(firstName)
    }

    const handleLastNameChange = (e) => {
        e.preventDefault()
        setLastName(e.target.value)
        // console.log(lastName)
    }

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

export default Parent
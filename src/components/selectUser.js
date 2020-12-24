import { Component } from 'react'
import { Button } from 'react-bootstrap'


class SelectUser extends Component{
  constructor(props) {
    super(props)

    this.state= {}

  }


  render() {
    return(
      <div>
        <p> Please Select a User </p>
        <Button variant="primary">Primary</Button>
      </div>
    )
  }
}





export default SelectUser

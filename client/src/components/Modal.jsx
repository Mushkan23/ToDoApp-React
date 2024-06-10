import { useState } from "react"
import { useCookies } from "react-cookie"

const Modal = ({ mode, setShowModal, getData, task}) => {
  //let mode = 'create'
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true : false

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  })

  //Add a new todo to the list
  const postData = async (e) => {
    //stop data from refreshing
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(data)
      })
      console.log(response)
      if (response.status === 200) {
        setShowModal(false)
        getData()
      }
      
    } catch(err) {
      console.error(err)
    }
  }


  //edit the existing todo
  const editData = async(e) => {
    e.preventDefault()
    // console.log('Sending data:', data) //Log the datat being sent
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
      });

      if (response.status === 200) {
        setShowModal(false)
        getData();   // Ensure this function correctly fetches and updates the tasks
      } else {
        console.error('Failed to update task', response.status);
      }
    }
    catch (err) {
      console.error(err);
    }
  };


  //update state
  const handleChange = (e) => {
    //console.log("changing!", e)
    const { name, value} = e.target //extracts key/value properties from the event
    setData(data => ({
      //updates state using previous state as input  parameter
      ...data,  //Uses the 'spread' operator to create a new object that uses all the old state.
      [name] : value  //updates the existing property with the new state.
    }))

  }

  return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
              <h3>Let's {mode} your task</h3>
              <button onClick={() => setShowModal(false)}>X</button>
          </div>

        <form>
          <input
            type="text"
            required
            maxLength={30}
            placeholder="Your task goes here..."
            name="title"
            value={data.title}
            onChange={handleChange}
            />
            <br />
            <label for="range">Drag to slect your current progress</label>
          <input
            required
            type="range"
            id="range"
            min={"0"}
            max={"100"}
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} 
          type="submit" 
          onClick={editMode ? editData : postData}/>
        </form>

        </div>
      </div>
    );
  }
  
  export default Modal
  
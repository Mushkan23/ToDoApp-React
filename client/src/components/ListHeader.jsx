import Modal from "./Modal"
import { useState } from "react"
import { useCookies } from "react-cookie"

const ListHeader = ({ listName, getData }) => {
  
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'email']) //HERER CHANGES
  const [showModal, setShowModal] = useState(false)


  const signOut = () => {
    console.log('signout')
    removeCookie('email')
    removeCookie('token')
    window.location.reload()
  }

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
        <button className="signout" onClick={signOut}>SIGN OUT</button>
      </div>
      {
        showModal && <Modal mode={"create"} setShowModal = {setShowModal} getData={getData} />
      }
    </div>
  );
}

export default ListHeader

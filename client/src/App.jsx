import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'email']) //HERE CHANGE
    const authToken = cookies.token
    const useremail = cookies.email
    const [ tasks, setTasks] = useState(null)


    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/todos/${useremail}`)
        const jsonData = await response.json()
        //console.log(jsondata)
        setTasks(jsonData)
      }
      catch (err) {
        console.error(err)
      }
    }

    //only get data if there is an authorized user
    useEffect(() => {
      if (authToken) {
        getData()
      }
    }, [authToken, useremail])  //HERE CHANGE
   

    //Sort tasks by date
    const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

    return (
      <div className="app">

{!authToken ? (
                <Auth setCookie={setCookie} />
            ) : (
                <>
                    <ListHeader listName={'🏝️Holiday Ticks list'} getData={getData} />
                    <p className='user-email'>Welcome Back {useremail}</p>
                    {sortedTasks?.map((task) => (
                        <ListItem key={task.id} task={task} getData={getData} />
                    ))}
                </>
            )}
          <p className='copyright'>Creative Coding LLC</p>
      </div>
    );
}

export default App

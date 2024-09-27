import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Home, Settings} from '../pages/index'
import { Header, Menus } from '../layouts/index'
import React, { useEffect, useState } from 'react'
import { sp } from '@pnp/sp'
import PageOverlay from '../pageoverLay/pageoverLay'
const Routers = () => {
    const [myRoles,setMyRoles] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        getGroups()
    },[])
    const getGroups = async () =>{
        try{
            const groups : any = await sp.web.getUserById(_spPageContextInfo.userId).groups()
            setMyRoles(Array.from(new Set(groups?.map((v:any) => v.Title))))
            setLoading(false)
        } catch (error) {
            console.log('Error fetching user groups:', error)
            setLoading(false)
        }
    }
    if(loading) {
        return (
            <>
            <PageOverlay />
            </>
        )
    }
  return (
        <div className='side-menus'>
            <Router>
                <Header />
                <div className='mainWrapper' id='mainWrapper'>
                    <Menus />
                    <div className='content-wrapper'>
                        <div className='wrapper' id='wrapper'>
                            <Switch>
                                <Route path='/' exact component={Home} />
                                <Route path='/settings' exact component={Settings} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        </div>
  )
}

export default Routers

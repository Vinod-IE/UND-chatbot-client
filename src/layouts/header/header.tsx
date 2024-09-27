import React, { useEffect, useState } from 'react'
import './header.css'
import { Link } from 'react-router-dom'
import Feedback from '../../components/feedback/feedback'
import Workflow from '../../components/workflow/workflow'
import Notifications from '../../components/notifications/notifications'
import Helpdesk from '../../components/helpdesk/helpdesk'
import { getPublicURL } from '../../shared/utility'
import { sp } from '@pnp/sp'
import { useGetAllSettingsData, useGetLogo } from '../../store/settings/hooks'
import { I_Logo } from '../../shared/interfaces'
import Profile from '../../components/profile/Profile'
import Buttons from '../../components/buttons/buttons'
import InputSearch from '../../utils/controls/input-search'
// Below code for local image path */
// import Logo from '../../assets/images/logo.svg'
// const function = props => {
export default function Header({ refresh }: any) {
    const [windowLocation, setWindowLocation] = useState(window.location.pathname)
    const [files, setFiles] = useState<any>()
    const [menusPosition, setMenusPosition] = useState('relative') 
    const [windowWidth, setWindowWidth] = useState<any>()
    const logo: Array<I_Logo> = useGetLogo()
    const [widgetsItems, setWidgetsItems] = useState<any>([])
    const FetchDataStatus: any = useGetAllSettingsData()

    useEffect(() => {
      setWindowWidth(window.innerWidth)
    },[windowWidth])

    useEffect(() => {
        { window.location.hash == '#/settings' ?
            document.documentElement.style.setProperty('--menus-display', '--menus-display') : document.documentElement.style.setProperty('--menus-display', '')}
    },[window.location.hash])

    function MenuHide(){
        window.location.href='#/settings'
        setWindowLocation(window.location.hash)
        console.log(window.location.hash)
    }

    function MenuShow(){
        window.location.href='#/'
        setWindowLocation(window.location.hash)
        console.log(window.location.hash)
    }

    return (
        <div className="header shadow5">
            <div className="container d-flex align-items-center justify-content-end h-100 ps-0">
                <div className="me-auto h-100 d-flex align-items-center">
                    <Buttons
                        label="Menu Options"
                        icon="icon-list-items font-24 m-auto"
                        className='btn btn-sm whitetext font-0 p-0 h-100 Menu-Options'
                        onClick={MenuShow}
                    />
                    <div tabIndex={0} aria-label="UND - Customer Support" className='Product-Name segoeui-semibold font-16 mx-2 whitetext text-nowrap'>UND - Customer Support</div>
                        
                    </div>
                <div className='d-flex align-items-center p-lg-relative h-100 w-100'>
                    <Notifications />
                    <Helpdesk />
                    <Buttons
                        label="Settings"
                        aria-label="Settings"
                        icon="icon-settings font-20"
                        className='btn btn-sm btn-hover1 whitetext font-0 py-2 h-100'
                       // onClick={MenuHide}
                    />
                    <Profile />
                </div>
            </div>
        </div>
        // <div className='customer-header'></div>
    )
}

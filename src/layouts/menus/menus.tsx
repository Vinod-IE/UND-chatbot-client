import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './menus.css'
import { getPublicURL } from '../../shared/utility'
import { FullControlUserGroups } from '../../configuration'
import { sp } from '@pnp/sp'

export default function Menus() {
  const [isOpen, setIsOpen] = useState(false)
  const [myRoles,setMyRoles] = useState([])
  const toggle = () => setIsOpen(!isOpen)
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const location = useLocation()
  const { pathname } = location
  const splitLocation = pathname.split('/')
  useEffect(() => {
    if (windowSize.innerWidth > 1400) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [windowSize])
  useEffect(() => {
    // getGroups()
    function handleWindowResize() {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])
    // const getGroups = async () =>{
    //     const groups : any = await sp.web.getUserById(_spPageContextInfo.userId).groups()
    //     setMyRoles(Array.from(new Set(groups?.map((v:any) => v.Title))))
    // }
  function getWindowSize() {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const menuitem = [
    {
      path: '/',
      activepath: ['/'],
      name: 'Home',
      icon: 'icon-home-1'
    }
  ]
  function activeClass(item: { path: string; activepath?: { toString: () => string; }[]; }) {
    let ischecked = false
    if (item?.activepath) {
      item?.activepath.forEach(element => {
        if (splitLocation[1] === item.path || splitLocation[1] === element) {
          ischecked = true
        }
      })
      return ischecked
    }
  }

  return (
    <div className='menus'>
      <div className='container'>
        <div className='sidebar'>
          <ul>
            {menuitem.map((item, index) => (
              <li key={item.name}>
                <NavLink to={item.path} key={index} className={activeClass(item) ? 'link active' : 'link'} title={item.name} activeClassName="active" exact>
                  <div className={item.icon}></div>
                  <div className='menuitems segoeui-semibold font-11'>{item.name}</div>
                </NavLink>
              </li>
            ))
            }
          </ul>
          {/* <main>{children}</main> */}
        </div>
      </div>
    </div>
  )
}

import React,{ createContext, useState } from 'react'

export const UserInitalValue:any = {
    multiplePopup: '',
    setMultiplePopup: undefined
  }
export const PopupCloseContext:any = createContext(UserInitalValue)
export const PopupCloseContextProvider = (props: any) => {
    const [multiplePopup, setMultiplePopup] = useState<any>()
    return(
      <PopupCloseContext.Provider value={{ multiplePopup, setMultiplePopup }}>
        {props.children}
      </PopupCloseContext.Provider>
    )
  }
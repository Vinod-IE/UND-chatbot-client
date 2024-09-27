/* eslint-disable react/react-in-jsx-scope */
import react, { useEffect, useState } from 'react'
import Buttons from '../buttons/buttons'
import './alert.css'
const Alert = (props: any) => {
    const [opacity, setOpacity] = useState('opacity-0')

    useEffect(() => {
        setOpacity('opacity-100')
    }, [])

    const cancel = () => {
        setOpacity('opacity-0')
        setTimeout(() => {
            props.setShowAlert(false)
        }, 300)
    }

    const yes = () => {
        setOpacity('opacity-0')
        setTimeout(() => {
            props.yes()
        }, 300)
    }
const messageRef:HTMLParagraphElement | null = null
 const handleRef = (ref:HTMLParagraphElement | null) => {
    const messageRef = ref
    if(messageRef){
        messageRef.focus()
    }
 }
    return (
        <>
        <div className='alertoverly'></div>
            <div className={`alertsmain ${props.className} ${opacity}`} >
            {props?.title && <h2 className={props.alerttextclass}  tabIndex={0} aria-label={props.title}>{props?.titleicon && <span className={props?.titleicon}></span>} {props.title}</h2>}
                <div className={props.alerttextclass} aria-label={props.message} ref={handleRef} tabIndex={0}>{props?.icon && <span className={props?.icon}></span>} {props.message}</div>
                <div className="d-flex gap-2 pt-2 justify-content-center">
                    <Buttons
                        label={props.yes}
                        className={props?.btn1className}
                        icon={props?.btn1iconclassNmae}
                        onClick = {() => props?.onClick(props.yes)}
                        type="button" />
                     <Buttons
                        label={props.cancel}
                        className={props?.btn2classNmae}
                        icon={props?.btn2iconclassNmae}
                        onClick = {() =>props?.onClick(props.cancel)}
                        type="button" />
                </div>
            </div>

        </>

    )
}
export default Alert
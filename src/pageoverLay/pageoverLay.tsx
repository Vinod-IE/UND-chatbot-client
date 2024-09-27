import React from 'react'
import './pageoverLay.css'
import { getPublicURL } from '../shared/utility'
const PageOverlay = () => {
    return (
        <div className="submit-bg" id="pageoverlay">
            <div className="copying">
                <p id="displaytext">Working on it</p>
                <img
                    src={`${getPublicURL() + 'assets/images/Loader.gif'}`}
                    alt={'Loader'}
                    aria-label="loader"
                    className="waiting-dot"
                />
            </div>
        </div>
    )
}

export default PageOverlay

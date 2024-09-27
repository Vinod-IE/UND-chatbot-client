import React from 'react'

const UnclassifiedInformation = (props: any) => {
    return (
        <>
            <div className='w-100 cuiheader' style={{ backgroundColor: props?.classificationcolor }}>
                <div className='latomedium font-11 text-center' style={{ color: props?.TextColor }}>
                    {props?.Classificationmessage}
                </div>
            </div>
        </>
    )
}

export default UnclassifiedInformation

import React, { useState } from 'react'
import InputLabel from '../../utils/controls/input-label'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './richtextV1.css'
import { areContentsEqual } from '../../Global'
import { ENTER_MSG } from '../../configuration'
const RichtextV1 = (inputProps: any) => {
    const [comments, setCommens] = useState<string>('')
    const handleChange = (content: string) => {
        if (inputProps?.onChange && !areContentsEqual(inputProps?.value , content)) {
            inputProps?.onChange(content)
        }
    }
    const modules = {
        toolbar: [
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
                { align: [] }
            ],
            [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }],
        ]

    }

    const formats = [
        'header', 'height', 'bold', 'italic',
        'underline', 'strike', 'blockquote',
        'list', 'color', 'bullet', 'indent',
        'link', 'image', 'align', 'size',
    ]
    return (
        <>
            <div className={inputProps?.formClassName}>
                {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} className={inputProps?.inputProps?.className} label={inputProps?.label} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} mandatory={inputProps?.isMandatory} />}
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats || inputProps?.formats}
                    placeholder={inputProps?.placeholder}
                    onChange={handleChange}
                    value={inputProps?.value}
                    id={inputProps?.inputProps?.id}
                />
            </div>
            {inputProps?.hint && <div>{inputProps?.hint}</div>}
            {inputProps.error ? <p className='errormsg'>{ENTER_MSG} {inputProps?.label || inputProps['aria-label']}</p> : ''}
        </>
    )
}

export default RichtextV1

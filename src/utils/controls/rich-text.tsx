import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import './richtext.css'
import InputLabel from './input-label'
import { ENTER_MSG } from '../../configuration'
import htmlToDraft from 'html-to-draftjs'

// import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js'
const RichTextEditor = (inputProps:any) => {
  const editorValue = inputProps.editorValue

  const [contentState, setContentState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (editorValue) {
      const description = editorValue?.split('>')?.slice(1)?.join('>')
      const blocksFromHTML = htmlToDraft(description)
      setContentState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap)
        )
      )
    }
  }, [editorValue])

  useEffect(() => {
    sendDataToParent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentState])

  const sendDataToParent = () => {
    if (!inputProps.readOnly) {
      inputProps.sendValue(contentState)
    }
  }

  const onEditorStateChange = (contentState: React.SetStateAction<EditorState>) => {
    setContentState(contentState)
  }

  return (
    <>
      <div className={inputProps?.formClassName}>

        {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} className={inputProps?.inputProps?.className} label={inputProps?.label} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} mandatory={inputProps?.isMandatory} />}

        <Editor
          editorState={contentState}
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: ['blockType', 'inline', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'remove'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true }

          }}
          placeholder={inputProps?.placeholder || `Enter ${inputProps?.label}`}
          aria-label={inputProps?.label}
        />

      </div>
      {inputProps?.hint && <div>{inputProps?.hint}</div>}
      {inputProps.error ? <p className='errormsg'>{ENTER_MSG} {inputProps?.label || inputProps['aria-label']}</p> : ''}
    </>
  )
}
export default RichTextEditor

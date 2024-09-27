import React, { useContext, useState } from 'react'
import axios from 'axios'
import Buttons from '../../components/buttons/buttons'
import PageOverlay from '../../pageoverLay/pageoverLay'
import { PageHeader } from '../../layouts/header/page-header'
import { UserDetailsContext } from '../../shared/contexts/user-context'
import InputTextarea from '../../utils/controls/input-textarea'
import KnowledgeArticles from '../../components/ka/knowledge-articles'
import Recentlyaskedquetions from '../../components/recently-asked-questions/recently-asked-questions'
import './home.css'
import Trendingquestions from '../../components/trending-questions/trending-questions'
import Searchresults from '../../components/search-results/search-results'

export default function Home(props:any) {
    const [loading, setLoading] = useState(false)
    const { isLoading } = useContext(UserDetailsContext)
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState('')
    const [history, setHistory] = useState<{ query: string; response: string }[]>([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [data, setData] = useState<{ query: string; response: string }[]>([])

    // function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value)  // Update 'query' state
    }

    // Handle send button click
    const handleSend = async () => {
        if (query.trim() === '') return

        try {
            setLoading(true)
            const response = await axios.post('http://localhost:5000/chat', { query })

            const data = response.data
            setData(data)
            console.log('Backend Response:', data)

            if (response.status === 200) {
                setResponse(data.answer)
                // Update history with new query and response
                setHistory(prevHistory => [...prevHistory, { query, response: data.answer }])
                setShowSearchResults(true) // Show search results view
            } else {
                console.error('Error:', data.error)
                setResponse('An error occurred. Please try again.')
            }
        } catch (error) {
            console.error('Request failed:', error)
            setResponse('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Handle the "Enter" key press in the textarea
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // Prevent new line
            handleSend() // Trigger send button functionality
        }
    }

    return (
        <>{(loading || isLoading) && <PageOverlay />}
            <PageHeader
                leftExtras={<span className='icon-stargroup font-30 title-color7 me-2'></span>}
                name='What can we help you with today?'
                titleClass="font-34 mt-1"
                subtitle='Our AI Integrated search will help you to find required information just for you. We promise it will be worth it.'
                subTitleClass="font-12 title-color7 pt-1"
                extras={
                    <div className='border-radius whitebg px-1 d-flex font-12 mt-auto'>
                        <div tabIndex={0} aria-label='public' className='border-right2 p-1 d-flex align-items-center'>
                            <span className='icon-threepersons title-color9 pe-1'></span> Public
                        </div>
                        <div tabIndex={0} aria-label='Individual' className='border-right2 p-1 d-flex align-items-center'>
                            <span className='icon-user-profile title-color8 pe-1'></span> Individual
                        </div>
                        <div tabIndex={0} aria-label='Private' className='p-1 d-flex align-items-center'>
                            <span className='icon-lock title-color10 pe-1'></span> Private
                        </div>
                    </div>
                }
            />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-7'>
                        <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                            <div className="card-header pb-0 d-flex align-items-end">
                                <div className='d-flex align-items-center w-100'>
                                    <InputTextarea label="Ask whatever you want" labelclassName="font-0" formClassName="w-100 d-flex" className="h-80 no-border w-100"
                                        inputProps={{
                                            className: 'font-0',
                                            placeholder: 'Ask whatever you want',
                                            value: query,
                                            onChange: handleInputChange,
                                            onKeyDown: handleKeyDown 
                                        }}
                                    />
                                    <Buttons label="Send" type="button" className="btn border-radius3 font-0 text-color-5 bgcolor-14" icon="icon-chart-send whitetext font-14 px-1" onClick={handleSend} />
                                </div>
                            </div>
                            <div className="d-flex card-footer bgcolor-22 border-top mt-2">
                                <div className='d-flex align-items-center w-100'>
                                    <div className='d-flex align-items-center' aria-live='polite' tabIndex={0}><span className='icon-newtopic whitetext bgcolor-23 circle circle-lg'></span>  <span className='ps-1 segoeui-semibold'> New Topic</span></div>
                                    <div className='d-flex ms-auto align-items-center'>
                                        <Buttons className="px-1 mx-1" icon="icon-image" />
                                        <Buttons className="px-1 mx-1" icon="icon-mic" />
                                    </div>
                                </div>
                            </div>
                        </div>
                       { !showSearchResults && <>
                        <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                            <Recentlyaskedquetions />
                        </div>
                        <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                            <Trendingquestions />
                        </div></>}

                        {showSearchResults && (
                            <>
                                <h2 tabIndex={0} aria-label='Search Results' className='mb-2'>Search Results</h2>
                               <Searchresults history={history} />
                                </>
                )}
                    </div>
                    <div className='col-12 col-lg-5'>
                    {showSearchResults && (
                                <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                                    <Recentlyaskedquetions />
                                </div>
                    )}
                        <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                            <KnowledgeArticles />
                        </div>
                        {showSearchResults && (                                
                                <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden">
                                    <Trendingquestions />
                                </div>
                )}
                    </div>
                </div>
            </div>
        </>
    )
}

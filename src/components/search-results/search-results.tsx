// import React, { useEffect, useState } from 'react'
// import Noresult from '../noresult/noresult'
// import Pagination from '../pagination/pagination'

// const itemsPerPage = 10 // Define how many items to display per page

// export default function Searchresults({ history}: { history: { query: string; response: string }[]}) {
//     const [currentPage, setCurrentPage] = useState<number>(1)
//     const [currentItems, setCurrentItems] = useState<{ query: string; response: string }[]>([])

//     useEffect(() => {
//         const indexOfLastItem = currentPage * itemsPerPage
//         const indexOfFirstItem = indexOfLastItem - itemsPerPage

//         // Update current items based on the page number and history
//         setCurrentItems(history.slice(indexOfFirstItem, indexOfLastItem))
//     }, [currentPage, history])

//     // Reset to the first page when a new question is added
//     useEffect(() => {
//         setCurrentPage(1)
//     }, [history]) // Watch for changes to history to reset page

//     // Handle page change
//     const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

//     return (
//         <><div className='d-flex flex-column-reverse'>
//             {currentItems.length > 0 ? (
                
//                 currentItems.map((item, index) => {
//                     const sections: any = item?.response?.match(/\d+\.\s[^\d]*/g) ? item?.response?.match(/\d+\.\s[^\d]*/g) : item?.response
//                     console.log(sections)
//                     console.log(sections?.length)
//                     return <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden" key={index}>
//                         <div className="d-flex flex-column pt-3 card-body">
//                             <div className="font-13 pe-1">
//                                 <div className="mb-3 widget-data border-bottom1 pb-3">
//                                     <p className="m-0 segoeui-semibold font-14 darktext lineclamp1">
//                                         {item.query} {/* User question as title */}
//                                     </p>
//                                     <p className='font-13 py-1 p'>
//                                        { sections &&  Array.isArray(sections?.length > 0) ? sections?.map((section: any, i: number) => {
//                                        return <>{section}  <br></br> </>
//                                         }) : sections}
//                                          {/* Chatbot response as content */}
//                                     </p>
//                                     <p tabIndex={0} aria-label="Response Time" className="m-0 pt-1 sourcesanspro subtitle-color">
//                                         {/* You can add additional metadata here if necessary */}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
// })
//   ) : (
//                 <div className='min-h-200 d-flex align-items-center justify-content-around'>
//                     <Noresult />
//                 </div>
//             )}
//             </div>
//             {/* Pagination controls */}
//             <Pagination
//                 totalItems={history.length}
//                 itemsPerPage={itemsPerPage}
//                 paginate={handlePageChange}
//                 currentPage={currentPage}
                
//             />
//         </>
//     )
// }


import React, { useEffect, useState } from 'react'
import Noresult from '../noresult/noresult'
import Pagination from '../pagination/pagination'

const itemsPerPage = 10 // Define how many items to display per page

export default function Searchresults({ history }: { history: { query: string; response: string }[] }) {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentItems, setCurrentItems] = useState<{ query: string; response: string }[]>([])

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage

        // Update current items based on the page number and history
        setCurrentItems(history.slice(indexOfFirstItem, indexOfLastItem))
    }, [currentPage, history])
    // Reset to the first page when a new question is added
    useEffect(() => {
        setCurrentPage(1)
    }, [history]) // Watch for changes to history to reset page

    // Handle page change
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <>
            <div className="d-flex flex-column-reverse">
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div className="shadow card card-lg w-100 border-radius3 mb-3 overflow-hidden" key={index}>
                            <div className="d-flex flex-column pt-3 card-body">
                                <div className="font-13 px-2">
                                    <div className="mb-3 widget-data border-bottom1 pb-3">
                                        <p className="m-0 segoeui-bold font-14 darktext lineclamp1">
                                            {item.query} {/* User question as title */}
                                        </p>
                                        <p className="font-13 py-1 p">
                                            {/* Render the response using dangerouslySetInnerHTML */}
                                            <div dangerouslySetInnerHTML={{ __html: item.response }} />
                                        </p>
                                        <p
                                            tabIndex={0}
                                            aria-label="Response Time"
                                            className="m-0 pt-1 sourcesanspro subtitle-color"
                                        >
                                            {/* You can add additional metadata here if necessary */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="min-h-200 d-flex align-items-center justify-content-around">
                        <Noresult />
                    </div>
                )}
            </div>
            {/* Pagination controls */}
            <Pagination
                totalItems={history.length}
                itemsPerPage={itemsPerPage}
                paginate={handlePageChange}
                currentPage={currentPage}
            />
        </>
    )
}



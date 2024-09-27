import React from 'react'

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, paginate, currentPage }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  // Log the page numbers for debugging
  console.log('Page Numbers:', pageNumbers)

  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        <li>
          <button className='border-radius whitebg p-1'
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <div className='icon-right--arrow rotate180'></div>
          </button>
        </li>

        {pageNumbers.map(number => (
          <li key={number} style={{ margin: '0 5px' }}>
            <button
              onClick={() => paginate(number)}
              style={{
                backgroundColor: currentPage === number ? '#007bff' : '#fff',
                color: currentPage === number ? '#fff' : '#007bff',
                padding: '5px 10px',
                border: '1px solid #007bff',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
          <button className='border-radius whitebg p-1'
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
          >
           <div className='icon-right--arrow'></div>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

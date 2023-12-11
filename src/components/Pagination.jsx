import { useEffect } from "react";
import { useState } from "react";

const Pagination = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageRangeDisplayed] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=${rowsPerPage}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);

      // ATTENTION: total count must be returned in API response;
      // This API not supported total count;
      const totalCountresponse = await fetch(
        `https://jsonplaceholder.typicode.com/photos`
      );
      const totalCountJsonData = await totalCountresponse.json();
      const totalCount = totalCountJsonData.length;
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    } catch (error) {
      setLoading(false);
      console.error("fetchData error", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    const selectedRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(selectedRowsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfPageRangeDisplayed = Math.floor(pageRangeDisplayed / 2);
    let startPage = Math.max(1, currentPage - halfPageRangeDisplayed);
    let endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);
 
    if (endPage - startPage + 1 < pageRangeDisplayed) {
      startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
    }
 
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
 
    return pageNumbers;
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>{item.title}</td>
              <td>{item.url}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row mt-3">
        <div className="col-md-3">
          <div className="d-flex justify-content-center">
            <select
              className="form-control me-3"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={250}>250 per page</option>
              <option value={500}>500 per page</option>
            </select>
          </div>
        </div>
        <div className="col-md-2">
          {loading && (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <div
          className="col-md-7"
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={handlePrevPage}>
                  Previous
                </button>
              </li>
              <li>
                <button className="page-link" onClick={goToFirstPage}>
                  First
                </button>
              </li>
              {getPageNumbers().map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button className="page-link" onClick={goToLastPage}>
                  Last
                </button>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button className="page-link" onClick={handleNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

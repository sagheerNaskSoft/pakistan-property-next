import React from "react";
import "./Pagination.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ paginationData, setPaginationData, fetchData }) => {
  const {
    current_page = 1,
    total_pages = 1,
    perPage = 10,
    total_items,
  } = paginationData || {};

  const handlePageChange = async (page) => {
    if (!page || page === current_page) return;
    if (page < 1 || page > total_pages) return;

    const nextPage = page;
    setPaginationData({ ...paginationData, current_page: nextPage });
    await fetchData({
      perPage,
      current_page: nextPage,
      toPaginate: "active",
    });
  };

  const startItem = (current_page - 1) * perPage + 1;
  const possibleEndItem = current_page * perPage;
  const totalItems =
    typeof total_items === "number" && !Number.isNaN(total_items)
      ? total_items
      : total_pages * perPage;
  const endItem = Math.min(possibleEndItem, totalItems);

  const onPrev = () => {
    if (current_page > 1) {
      handlePageChange(current_page - 1);
    }
  };

  const onNext = () => {
    if (current_page < total_pages) {
      handlePageChange(current_page + 1);
    }
  };

  return (
    <div className="pagination-container w-100 justify-content-between">
      <div className="button-box">
        <button
          className="page-btn left"
          disabled={current_page === 1}
          onClick={onPrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 14L4 8L12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="page-btn right"
          disabled={current_page === total_pages}
          onClick={onNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 14L12 8L4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <span className="page-range">
       <span> {startItem}</span> - {endItem} of {totalItems} Items
      </span>


    </div>
  );
};

export default Pagination;

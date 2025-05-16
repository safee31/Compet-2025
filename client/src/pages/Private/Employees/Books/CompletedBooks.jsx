// CompletedBooksSection.js
import React, { useMemo, useState } from "react";
import { Avatar, Box, Button, Typography, Skeleton } from "@mui/material";
import DataTable from "../../../../components/Table";
import { useGetEmployeeBooksQuery } from "../../../../apis/Book/book";
import { generateS3FilePath } from "../../../../utils/files";
import ViewBookModal from "./ViewBookModal";
import SubHeading from "../../../../components/UI/SubHeading";
import { formatDateStatic } from "../../../../utils/dateTime";

export default function CompletedBooksSection() {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const {
    data: readBooksData,
    isLoading: isReadBooksLoading,
    isFetching: isReadBooksFetching,
  } = useGetEmployeeBooksQuery({
    ...query,
    isCompleted: true,
  });

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewOpen(true);
  };

  const readBooks = readBooksData?.books || [];
  const headCells = [
    { id: "cover", label: "Cover", is_sortable: false },
    { id: "title", label: "Title", is_sortable: false },
    { id: "completedAt", label: "Completion", is_sortable: false },
    { id: "action", label: "Action" },
  ];

  // Define rows for the books table
  const rows = useMemo(() => {
    return readBooks.map((book) => ({
      cover: (
        <Avatar
          variant="rounded"
          src={generateS3FilePath(book?.imageUrl)}
          alt={book?.title || "Book Cover"}
        />
      ),
      title: book.title,
      completedAt: formatDateStatic(book?.completedAt),
      action: (
        <Button
          variant="outlined"
          size="small"
          color="text"
          onClick={() => handleViewBook(book)}
        >
          Details
        </Button>
      ),
    }));
  }, [readBooksData]);

  return (
    <>
      {selectedBook && (
        <ViewBookModal
          open={isViewOpen}
          handleClose={() => {
            setIsViewOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
      )}
      <Box display="flex" alignItems="center" gap={1}>
        <SubHeading heading="COMPLETED BOOKS" />
        <Typography variant="h6" fontWeight="bold" color="green">
          {isReadBooksLoading || isReadBooksFetching ? (
            <Box component="span">
              (
              <Skeleton
                variant="text"
                sx={{
                  fontSize: "1rem",
                  width: "1.5rem",
                  display: "inline-block",
                }}
              />
              )
            </Box>
          ) : (
            `(${readBooks.length})`
          )}
        </Typography>
      </Box>
      <Box my={2}>
        {isReadBooksLoading || isReadBooksFetching ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <DataTable
            columns={headCells}
            rows={rows}
            sortConfig=""
            sortConfigSet={() => {}}
            showPagination={true}
            paginationOptions={{
              itemsPerPage: query?.limit,
              currentPage: query.page,
              totalItems: readBooksData?.totalDocs || 0,
              handlePageChange: (_, page) => {
                page !== query?.page && setQuery((p) => ({ ...p, page }));
              },
              handleLimitChange: (evt) => {
                const limit = evt.target.value;
                limit !== query?.limit && setQuery((p) => ({ ...p, limit }));
              },
              hideInfo: true,
            }}
          />
        )}
      </Box>
    </>
  );
}

// IncompletedBooksSection.js
import React, { useState } from "react";
import { Box, Typography, Skeleton, Grid2 } from "@mui/material";
import {
  useGetEmployeeBooksQuery,
  useMarkBookAsReadMutation,
} from "../../../../apis/Book/book";
import DataInfo from "../../../../components/DataInfo";
import SubHeading from "../../../../components/UI/SubHeading";
import BookCard from "../../../../components/UI/BookCard";
import { CustomPagination } from "../../../../components/CustomPagination";
import { getDocumentId } from "../../../../utils/toTitleCase";
import toast from "react-hot-toast";
import { errorMessages } from "../../../../apis/messageHandler";

export default function IncompletedBooksSection({ header = true }) {
  const [query, setQuery] = useState({ page: 1, limit: 10 });

  const {
    data,
    isLoading: isUnreadBooksLoading,
    isFetching: isUnreadBooksFetching,
  } = useGetEmployeeBooksQuery({
    ...query,
    isCompleted: false,
  });
  const unreadBooks = data?.books || [];

  const [markBookAsRead, { isLoading }] = useMarkBookAsReadMutation();
  const handleMarkAsRead = async (bookId) => {
    try {
      await markBookAsRead(bookId).unwrap();
      toast.success("Book Marked as read.");
    } catch (error) {
      errorMessages(error);
    }
  };

  return (
    <>
      {header && (
        <Box display="flex" alignItems="center" gap={1} mt={4} mb={2}>
          <SubHeading heading="INCOMPLETED BOOKS" />
          <Typography variant="h6" fontWeight="bold" color="green">
            {isUnreadBooksLoading || isUnreadBooksFetching ? (
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
              `(${unreadBooks.length})`
            )}
          </Typography>
        </Box>
      )}
      <Box mb={2}>
        <Grid2 container spacing={2}>
          {isUnreadBooksLoading || isUnreadBooksFetching ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid2 key={index} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                  <Skeleton variant="rectangular" width={"100%"} height={280} />
                </Grid2>
              ))}
            </>
          ) : !unreadBooks?.length && header ? (
            <DataInfo />
          ) : (
            unreadBooks.map((book, idx) => (
              <Grid2 key={idx + 1} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                <BookCard
                  isDisabled={isLoading}
                  hideEditBtn={true}
                  book={book}
                  markReadBtn={true}
                  onMarkRead={() => handleMarkAsRead(getDocumentId(book))}
                />
              </Grid2>
            ))
          )}
        </Grid2>
        <CustomPagination
          hideInfo={true}
          isLoading={isUnreadBooksLoading || isUnreadBooksFetching}
          handlePageChange={(page) => {
            page !== query?.page && setQuery((p) => ({ ...p, page }));
          }}
          handleLimitChange={(limit) => {
            limit !== query?.limit && setQuery((p) => ({ ...p, limit }));
          }}
          totalItems={data?.totalDocs}
          itemsPerPage={query?.limit}
          currentPage={query?.page}
        />
      </Box>
    </>
  );
}

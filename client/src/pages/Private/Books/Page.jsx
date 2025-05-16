import React, { useState } from "react";
import { Box, Button, Grid2 } from "@mui/material";
import { useGetAllBooksQuery } from "../../../apis/Book/book";
import BookCard from "../../../components/UI/BookCard";
import PageHeader from "../../../components/UI/PrivatePageHeader";
import BookModal from "./FormModal";
import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import { CustomPagination } from "../../../components/CustomPagination";
import { SearchFilter } from "../../../components/Filters";

const BooksPage = () => {
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, isLoading, isFetching } = useGetAllBooksQuery({ ...query });
  // const [deleteBook] = useDeleteBookMutation();
  const [initialData, setInitialData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // const handleDelete = async (id) => {
  //   await deleteBook(id);
  // };
  return (
    <Box>
      <PageHeader
        title={"Books"}
        menuBar={true}
        rightContent={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setInitialData(null);
              setShowForm(true);
            }}
          >
            Add Book
          </Button>
        }
      />
      <SearchFilter query={query} setQuery={setQuery} disabled={isFetching} />
      {isLoading ? (
        <SpinnerMd />
      ) : !data?.books?.length ? (
        <DataInfo />
      ) : (
        <Grid2 container spacing={2} my={2}>
          {data?.books?.map((book, idx) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={idx + 1}>
              <BookCard
                book={book}
                onEdit={() => {
                  setInitialData(book);
                  setShowForm(true);
                }}
                // onDelete={() => handleDelete(getDocumentId(book))}
              />
            </Grid2>
          ))}
        </Grid2>
      )}
      <CustomPagination
        hideInfo={true}
        isLoading={isFetching}
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
      {showForm && (
        <BookModal
          initialData={initialData}
          showForm={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
};

export default BooksPage;

import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import { useDebounce } from "use-debounce";
import { Box, MenuItem, TextField, Typography } from "@mui/material";

export const CustomPagination = ({
  isLoading,
  handlePageChange = () => {},
  totalItems = 0,
  itemsPerPage: itemsperpage = 0,
  handleLimitChange = () => {},
  currentPage = 1,
  hideInfo = false,
  variant = "text",
  shape = "circular",
  color = "primary",
  boundaryCount = 1,
  size = "medium",
  sx = {},
}) => {
  currentPage = Number(currentPage);
  const [goToPage, setGoToPage] = useState(currentPage);
  //   const [goToCustomPage] = useDebounce(goToPage, 1000);

  const totalPages = Math.ceil(totalItems / itemsperpage);
  useEffect(() => {
    setGoToPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (Number(goToPage) > 0 && Number(goToPage) <= totalPages) {
      if (Number(currentPage) !== Number(goToPage)) {
        handlePageChange(goToPage);
      }
    } else {
      setGoToPage(1);
      if (Number(currentPage) !== Number(goToPage)) {
        handlePageChange(1);
      }
    }
  }, [goToPage]);

  return (
    totalItems > 0 &&
    totalPages >= 1 && (
      <Box
        component={"div"}
        sx={{
          py: 1,
          justifyContent: !hideInfo ? "space-between" : "end",
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {!hideInfo && (
          <Box
            alignItems={"center"}
            justifyContent={"start"}
            display={"flex"}
            gap={2}
          >
            <Box sx={{ justifyContent: "start", gap: "5px", display: "flex" }}>
              <Typography>
                {`Showing ${(currentPage - 1) * itemsperpage + 1} - 
            ${Math.min(
              currentPage * itemsperpage,
              totalItems
            )} of ${totalItems}`}
              </Typography>
            </Box>

            <TextField
              select
              disabled={isLoading}
              size="small"
              value={itemsperpage}
              onChange={(e) => {
                setGoToPage(1);
                handleLimitChange(e?.target?.value);
              }}
              label="Rows"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>

            <TextField
              disabled={isLoading}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              // onBlur={(e) => {
              //   const { value } = e.target;
              //   if (Number(value) > 0 && Number(value) <= totalPages) {
              //     if (Number(currentPage) !== Number(value)) {
              //       handlePageChange(value);
              //     }
              //   } else {
              //     setGoToPage(1);
              //     if (Number(currentPage) !== Number(value)) {
              //       handlePageChange(1);
              //     }
              //   }
              // }}
              sx={{ maxWidth: "100px" }}
              id="page"
              label="Page"
              type="number"
              size={"small"}
            />
          </Box>
        )}
        <Box>
          <Pagination
            page={currentPage}
            count={totalPages}
            itemsperpage={itemsperpage}
            onChange={(e, page) => {
              handlePageChange(page);
            }}
            disabled={isLoading}
            variant={variant}
            shape={shape}
            color={color}
            sx={{ ...sx }}
            boundaryCount={boundaryCount}
            size={size}
          />
        </Box>
      </Box>
    )
  );
};

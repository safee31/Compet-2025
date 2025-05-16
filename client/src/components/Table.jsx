/* eslint-disable react/prop-types */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { SwapVert } from "@mui/icons-material";
import BackdropLoading from "./BackdropLoading";
import {
  EllipsisTableCell,
  StyledTableHeadCell,
} from "../theme/styledComponents";
import { getMin0Number } from "../utils/toTitleCase";
import DataInfo from "./DataInfo";

const DataTable = ({
  columns = [],
  rows = [],
  cellLines = 2,
  isPaginationLoading = false,
  sortConfig = {},
  sortConfigSet,
  showPagination = false,
  paginationOptions = {
    hideInfo: true,
    isLoading: false,
    handlePageChange: () => {},
    handleLimitChange: () => {},
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
  },
}) => {
  const getSortDirection = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig?.direction;
    }
    return "asc";
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    sortConfigSet({ key, direction });
  };

  const EnhancedTableHead = ({ sortConfig, onClick }) => {
    const handleSortClick = (key) => {
      onClick(key);
    };
    return (
      <TableHead>
        <TableRow>
          {columns.map((headCell) => (
            <StyledTableHeadCell
              key={headCell?.id}
              align={headCell.align}
              style={{
                minWidth: headCell.minWidth,
                fontSize: 14,
                fontWeight: "bold",
              }}
              sx={{ px: 1.5 }}
            >
              {headCell?.is_sortable ? (
                <TableSortLabel
                  active={sortConfig?.key === headCell?.id}
                  direction={getSortDirection(headCell?.id)}
                  onClick={() => handleSortClick(headCell?.id)}
                >
                  {headCell?.is_sortable &&
                    sortConfig?.key !== headCell?.id && (
                      <SwapVert style={{ marginRight: "4px" }} />
                    )}{" "}
                  {headCell?.label || "N/A"}
                </TableSortLabel>
              ) : (
                <>{headCell?.label}</>
              )}
            </StyledTableHeadCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  return (
    <>
      <Paper sx={{ position: "relative", borderRadius: "8px", width: "100%" }}>
        <BackdropLoading loading={isPaginationLoading} />
        <TableContainer
          sx={{
            ...{ borderRadius: "8px", width: "100%" },
            ...(isPaginationLoading ? { pointerEvents: "none" } : {}),
            maxHeight: "130vh",
          }}
        >
          {columns?.length === 0 || rows?.length === 0 ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <DataInfo />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table stickyHeader sx={{ minWidth: 570 }}>
              <EnhancedTableHead sortConfig={sortConfig} onClick={handleSort} />
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      whiteSpace: "pre-line",
                      ...(row?.disabled && {
                        backgroundColor: "lightgrey",
                        pointerEvents: "none",
                        opacity: 0.5,
                      }),
                      // "&:nth-of-type(odd)": {
                      //   backgroundColor: "grey.300",
                      // },
                      // hide last border
                      "& td, & th": {
                        borderBottom: "0.5px solid lightgrey",
                      },
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    {columns.map((column, columnIndex) => (
                      <TableCell
                        key={columnIndex}
                        sx={{
                          px: 1.5,
                          ...(row.disabled && {
                            color: "text.disabled",
                          }),
                        }}
                      >
                        <EllipsisTableCell lines={cellLines} fontSize="13px">
                          {(() => {
                            const cellValue = column?.Cell
                              ? column.Cell(row)
                              : row[column?.id];

                            if (cellValue === undefined || cellValue === null) {
                              return "N/A";
                            }

                            if (typeof cellValue === "string") {
                              return cellValue.trim() || "N/A";
                            }

                            return cellValue;
                          })()}
                        </EllipsisTableCell>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {showPagination && (
          <TableFooter component={"div"}>
            <TablePagination
              rowsPerPageOptions={
                paginationOptions.hideInfo ? [] : [10, 25, 100]
              }
              component="div"
              count={getMin0Number(paginationOptions?.totalItems)}
              rowsPerPage={getMin0Number(paginationOptions?.itemsPerPage) || 10}
              page={getMin0Number(paginationOptions?.currentPage - 1)}
              onPageChange={(evt, page) =>
                paginationOptions?.handlePageChange(evt, page + 1)
              }
              onRowsPerPageChange={paginationOptions?.handleLimitChange}
            />
          </TableFooter>
        )}
      </Paper>
    </>
  );
};

export default DataTable;

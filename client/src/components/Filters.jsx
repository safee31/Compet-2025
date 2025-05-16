import { TextField, MenuItem, InputAdornment } from "@mui/material";
import { Search, Verified, Business } from "@mui/icons-material";
import { useGetAllCompaniesQuery } from "../apis/company/company";
import { getDocumentId } from "../utils/toTitleCase";

// Search Field Component
export const SearchFilter = ({ query, setQuery, ...props }) => {
  const handleSearchKeyUp = (event) => {
    if (event.key === "Enter") {
      setQuery((prev) => ({
        ...prev,
        search: event.target.value?.trim(),
        page: 1,
      }));
    }
  };

  return (
    <TextField
      {...props}
      size="small"
      color="white"
      type="search"
      sx={{ maxWidth: 200 }}
      variant="outlined"
      placeholder="Search..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          style: { background: "white", paddingLeft: "6px" },
        },
      }}
      onKeyUp={handleSearchKeyUp}
    />
  );
};

// Company Filter Component
export const CompanyFilter = ({ query, setQuery, ...props }) => {
  const { data: companiesData, isFetching: isCompaniesFetching } =
    useGetAllCompaniesQuery({ isAll: true });

  const handleCompanyChange = (event) => {
    setQuery((prev) => ({ ...prev, company: event.target.value, page: 1 }));
  };

  return (
    <TextField
      {...props}
      onChange={handleCompanyChange}
      disabled={isCompaniesFetching}
      size="small"
      color="white"
      sx={{ maxWidth: 200 }}
      select
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Business fontSize="22" />
            </InputAdornment>
          ),
          style: { background: "white", paddingLeft: "6px" },
        },
      }}
      value={query?.company ?? "all"}
    >
      <MenuItem value="all">All</MenuItem>
      {isCompaniesFetching ? (
        <MenuItem value={null} disabled>
          Loading companies...
        </MenuItem>
      ) : (
        companiesData?.companies?.map((o, idx) => (
          <MenuItem key={idx} value={getDocumentId(o)}>
            {o?.name}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};
export const ApprovalFilter = ({
  query = {},
  setQuery = () => {},
  ...props
}) => {
  const handleApprovalChange = (event) => {
    setQuery((prev) => ({ ...prev, approval: event.target.value }));
  };

  return (
    <TextField
      {...props}
      onChange={handleApprovalChange}
      size="small"
      color="white"
      sx={{ maxWidth: 200 }}
      select
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Verified fontSize="22" />
            </InputAdornment>
          ),
          style: { background: "white", paddingLeft: "6px" },
        },
      }}
      value={query?.approval ?? "all"}
    >
      <MenuItem value="all">All</MenuItem>
      <MenuItem value="true">Approved</MenuItem>
      <MenuItem value="false">Not Approved</MenuItem>
    </TextField>
  );
};

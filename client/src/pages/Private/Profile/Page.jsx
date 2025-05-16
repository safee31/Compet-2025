import React from "react";
import { useSelector } from "react-redux";
import AccountDetails from "../Employees/AccountDetails";
import { SpinnerMd } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import { useGetEmployeesByIdQuery } from "../../../apis/Employee/employee";
import { getDocumentId } from "../../../utils/toTitleCase";
import { Box } from "@mui/material";
import PageHeader from "../../../components/UI/PrivatePageHeader";

const Profile = () => {
  const employeeId = useSelector((state) =>
    getDocumentId(state.account?.details)
  );

  const { data: accountData, isLoading } = useGetEmployeesByIdQuery(
    employeeId,
    {
      skip: !employeeId,
    }
  );

  return (
    <Box>
      <PageHeader title={"Profile"} menuBar={true} />
      {isLoading ? (
        <SpinnerMd />
      ) : !accountData ? (
        <DataInfo />
      ) : (
        <AccountDetails accountData={accountData} />
      )}
    </Box>
  );
};

export default Profile;

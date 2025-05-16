import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { generateGridItem } from "../../../../utils/gridList";
import WorkInfoModal from "../../../../components/UI/onboardingModals/WorkInfo";
import toast from "react-hot-toast";

const WorkTab = ({ accountData, setAccountData = () => {} }) => {
  const [workInfo, setWorkInfo] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (accountData?.workInfo) setWorkInfo(accountData.workInfo);
  }, [accountData?.workInfo]);

  const handleEditClick = () => {
    if (workInfo) {
      setOpenModal(true);
    } else {
      toast.error("Work information not available");
    }
  };

  return (
    <Stack gap={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Work Information
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ float: "right" }}
            >
              <Edit />
            </IconButton>
          </Typography>

          {generateGridItem({
            label: "Work Email",
            value: workInfo?.workEmail,
          })}
          {generateGridItem({
            label: "Work Phone",
            value: workInfo?.workPhoneNumber,
          })}
          <Typography variant="h6" fontWeight="bold" my={2}>
            Emergency Contact
          </Typography>

          {generateGridItem({
            label: "First Name",
            value: workInfo?.emergencyContact?.firstName,
          })}
          {generateGridItem({
            label: "Last Name",
            value: workInfo?.emergencyContact?.lastName,
          })}
          {generateGridItem({
            label: "Relationship",
            value: workInfo?.emergencyContact?.relationship,
          })}
          {generateGridItem({
            label: "Email",
            value: workInfo?.emergencyContact?.email,
          })}
          {generateGridItem({
            label: "Phone Number",
            value: workInfo?.emergencyContact?.phoneNumber,
            isLast: true,
          })}
        </CardContent>
      </Card>

      {openModal && (
        <WorkInfoModal
          workInfo={workInfo}
          onClose={() => setOpenModal(false)}
          handleUpdatedData={(data) => {
            setWorkInfo({ ...data });
            setAccountData({ ...accountData, workInfo: { ...data } });
          }}
          open={openModal}
          accountData={accountData}
        />
      )}
    </Stack>
  );
};

export default WorkTab;

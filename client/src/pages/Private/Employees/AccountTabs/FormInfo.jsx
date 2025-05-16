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
import FormsInfoModal from "../../../../components/UI/onboardingModals/FormInfo";
import { maskValue } from "../../../../utils/toTitleCase";
import toast from "react-hot-toast";
import { generateS3FilePath } from "../../../../utils/files";

const FormsTab = ({ accountData, setAccountData = () => {} }) => {
  const [formInfo, setFormInfo] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (accountData?.form) setFormInfo(accountData.form);
  }, [accountData?.form]);

  const handleEditClick = () => {
    if (formInfo) {
      setOpenModal(true);
    } else {
      toast.error("Forms information not available");
    }
  };

  return (
    <Stack gap={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Bank & Forms
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ float: "right" }}
            >
              <Edit />
            </IconButton>
          </Typography>

          {generateGridItem({ label: "Bank Name", value: formInfo?.bankName })}
          {generateGridItem({
            label: "Account Number",
            value: maskValue(formInfo?.accountNumber),
          })}
          {generateGridItem({
            label: "Routing Number",
            value: maskValue(formInfo?.routingNumber),
          })}
          {generateGridItem({
            label: "Social Security Number",
            value: maskValue(formInfo?.socialSecurityNumber),
          })}
          {/* File links for documents */}
          {generateGridItem({
            label: "Driver's License",
            value: formInfo?.driversLicense ? (
              <a
                href={generateS3FilePath(formInfo?.driversLicense)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            ) : (
              "Not Uploaded"
            ),
          })}

          {generateGridItem({
            label: "W-4 Form",
            value: formInfo?.w4 ? (
              <a
                href={generateS3FilePath(formInfo?.w4)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            ) : (
              "Not Uploaded"
            ),
          })}

          {generateGridItem({
            label: "Policy Acknowledgment",
            value: formInfo?.policyAcknowledgment ? "Yes" : "No",
            isLast: true,
          })}
        </CardContent>
      </Card>

      {openModal && (
        <FormsInfoModal
          formInfo={formInfo}
          onClose={() => setOpenModal(false)}
          handleUpdatedData={(data) => {
            setFormInfo({ ...data });
            setAccountData({ ...accountData, form: { ...data } });
          }}
          open={openModal}
          accountData={accountData}
        />
      )}
    </Stack>
  );
};

export default FormsTab;

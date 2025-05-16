import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Box,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { formatDateStatic } from "../../../../utils/dateTime";
import { generateGridItem } from "../../../../utils/gridList";
import PersonalInfo from "../../../../components/UI/onboardingModals/PersonalInfo";
import { generateS3FilePath, validateFiles } from "../../../../utils/files";
import toast from "react-hot-toast";
import { getDocumentId } from "../../../../utils/toTitleCase";
import { errorMessages } from "../../../../apis/messageHandler";
import { useUpdateProfilePhotoMutation } from "../../../../apis/Account/account";

const PersonalTab = ({ accountData, setAccountData = () => {} }) => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [updateProfilePhoto, { isLoading: isUpdatingPofilePhoto }] =
    useUpdateProfilePhotoMutation();

  const handleEditClick = () => {
    if (personalInfo) {
      setOpenModal(true);
    } else {
      toast.error("Personal information not available");
    }
  };

  useEffect(() => {
    if (accountData?.personalInfo) setPersonalInfo(accountData?.personalInfo);
    if (accountData?.user) setProfileImage(accountData?.user?.profileImage);
  }, [accountData?.personalInfo]);

  const handleFileUpload = async (event, field) => {
    try {
      const file = event.target.files[0];
      const { valid = false, message } = validateFiles(
        [file],
        ["image/webp", "image/jpeg", "image/jpg", "image/png"],
        3
      );
      if (valid) {
        const updated = await updateProfilePhoto({
          file,
          accountId: getDocumentId(accountData),
        }).unwrap();

        setProfileImage(updated?.updatedProfileImage);
        setAccountData((p) => ({
          ...p,
          user: { ...p?.user, profileImage: updated?.updatedProfileImage },
        }));
        toast.success("Profile photo updated!");
      } else {
        throw Error(message);
      }
    } catch (error) {
      errorMessages(error);
    }
    event.target.value = null;
  };

  return (
    <Stack gap={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Basics
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ float: "right" }}
            >
              <Edit />
            </IconButton>
          </Typography>
          <label htmlFor="profileImage-upload">
            <Stack
              direction="row"
              gap={1.5}
              alignItems="center"
              mb={2}
              flexWrap={"wrap"}
            >
              <input
                disabled={isUpdatingPofilePhoto}
                id="profileImage-upload"
                type="file"
                accept="image/png, image/jpg, image/webp, image/jpeg"
                hidden
                onChange={(e) =>
                  !isUpdatingPofilePhoto && handleFileUpload(e, "profileImage")
                }
              />
              <Box
                variant="rounded"
                component={Avatar}
                src={profileImage?.base64 || generateS3FilePath(profileImage)}
                sx={{ width: 50, height: 50 }}
              />
              <Typography
                color="primary"
                id="profileImage"
                sx={{
                  cursor: isUpdatingPofilePhoto ? "not-allowed" : "pointer",
                }}
              >
                {isUpdatingPofilePhoto
                  ? "Uploading..."
                  : " Change Profile Picture"}
              </Typography>
            </Stack>
          </label>

          {generateGridItem({
            label: "Username",
            value: personalInfo?.username,
          })}
          {generateGridItem({
            label: "First Name",
            value: personalInfo?.firstName,
          })}
          {generateGridItem({
            label: "Last Name",
            value: personalInfo?.lastName,
          })}
          {generateGridItem({
            label: "Preferred Name",
            value: personalInfo?.preferredName,
          })}
          {generateGridItem({
            label: "Date of Birth",
            value: formatDateStatic(personalInfo?.dateOfBirth, "MM/DD/YYYY"),
            isLast: true, // No divider after last item
          })}
          <Typography variant="h6" fontWeight="bold" my={2}>
            Contact
            {/* <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ float: "right" }}
            >
              <Edit />
            </IconButton> */}
          </Typography>
          {generateGridItem({
            label: "User Email",
            value: accountData?.user?.email,
          })}
          {generateGridItem({
            label: "Personal Email",
            value: personalInfo?.personalEmail,
          })}
          {generateGridItem({
            label: "Personal Phone",
            value: personalInfo?.phoneNumber,
            isLast: true,
          })}
        </CardContent>
      </Card>

      {/* Contact Section */}
      {/* <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Contact
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ float: "right" }}
            >
              <Edit />
            </IconButton>
          </Typography>
          {generateGridItem({
            label: "Personal Email",
            value: personalInfo.personalEmail,
          })}
          {generateGridItem({
            label: "Personal Phone",
            value: personalInfo.phoneNumber,
            isLast: true,
          })}
        </CardContent>
      </Card> */}

      {openModal && (
        <PersonalInfo
          personalInfo={personalInfo}
          onClose={() => {
            setOpenModal(false);
          }}
          handleUpdatedData={(data) => {
            setPersonalInfo({ ...data });
            setAccountData({ ...accountData, personalInfo: { ...data } });
          }}
          open={openModal}
          accountData={accountData}
        />
      )}
    </Stack>
  );
};

export default PersonalTab;

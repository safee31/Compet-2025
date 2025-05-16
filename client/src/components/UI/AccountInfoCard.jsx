import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Check, Close } from "@mui/icons-material";
import { useUpdateEmployeeMutation } from "../../apis/Employee/employee";
import { createDynamicChip } from "../../utils/chip";
import { formatDateStatic } from "../../utils/dateTime";
import { errorMessages } from "../../apis/messageHandler";
import { getDocumentId } from "../../utils/toTitleCase";
import { useSelector } from "react-redux";
import { UTCDatePicker } from "../UTCdatePicker";

export const AccountInfoCard = ({ accountData, onClose = () => {} }) => {
  const currentAccount = useSelector((s) => s?.account);
  const isManager = currentAccount?.details?.role?.type === 2;
  const isAdmin = currentAccount?.details?.role?.type === 1;
  const currentAccountId = getDocumentId(currentAccount?.details);
  const employeeAccountId = getDocumentId(accountData);

  // Check if current user is trying to edit their own account
  const isEditingSelf = currentAccountId === employeeAccountId;

  // Permission logic:
  // 1. Admin can edit anyone
  // 2. Manager can edit others (but not themselves)
  // 3. Regular users can't edit
  const canEditHiredAt = isAdmin || (isManager && !isEditingSelf);

  const [updateHiredAt, { isLoading }] = useUpdateEmployeeMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [newHiredAt, setNewHiredAt] = useState(
    accountData?.hiredAt || accountData?.createdAt
  );
  const [error, setError] = useState("");

  const handleEditClick = () => {
    if (!canEditHiredAt) return;
    setIsEditing(true);
    setNewHiredAt(accountData?.hiredAt || accountData?.createdAt);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewHiredAt(accountData?.hiredAt || accountData?.createdAt);
    setError("");
  };

  const handleSave = async () => {
    if (!newHiredAt) {
      setError("Hire date is required");
      return;
    }
    const accountId = getDocumentId(accountData);
    if (!accountId) {
      setError("Account ID is required");
      return;
    }
    try {
      await updateHiredAt({
        accountId,
        hiredAt: newHiredAt,
      }).unwrap();
      if (error) setError("");
      onClose(newHiredAt);
      setIsEditing(false);
    } catch (err) {
      errorMessages(err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" fontWeight="bold" mb={2}>
          Employee Info
        </Typography>

        <Stack mb={2}>
          <Typography variant="body2">Status:</Typography>

          {createDynamicChip({
            label: accountData?.isActive ? "Active" : "Inactive",
            color: accountData?.isActive ? "success" : "error",
          })}
        </Stack>

        <Stack mb={2}>
          <Typography variant="body2">Hire Date:</Typography>
          {isEditing ? (
            <Box>
              <UTCDatePicker
                value={newHiredAt}
                onChange={(date) => {
                  setNewHiredAt(date);
                  if (error) setError("");
                }}
                textFieldProps={{
                  required: true,
                  error: !!error,
                  helperText: error,
                }}
              />

              <Stack direction={"row"} flexWrap={"wrap"} mt={1} gap={1}>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  disabled={isLoading}
                  color="error"
                >
                  <Close fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={isLoading}
                  color="primary"
                >
                  <Check fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ) : (
            <Stack
              direction={"row"}
              alignItems={"center"}
              flexWrap={"wrap"}
              gap={1}
            >
              <Typography variant="body2">
                {accountData?.hiredAt
                  ? formatDateStatic(accountData.hiredAt, "MM/DD/YYYY")
                  : formatDateStatic(accountData?.createdAt, "MM/DD/YYYY")}
              </Typography>
              {canEditHiredAt && (
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  color="primary"
                  disabled={isLoading}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>

        <Stack>
          <Typography variant="body2">Company:</Typography>
          <Typography variant="body2">
            {accountData?.company?.name || "Not assigned"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

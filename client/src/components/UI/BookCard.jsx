import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { EllipsisText } from "../../theme/styledComponents";
import { generateS3FilePath } from "../../utils/files";

const BookCard = ({
  book,
  onEdit = () => {},
  onMarkRead = () => {},
  hideEditBtn = false,
  markReadBtn = false,
  isDisabled = false,
}) => {
  return (
    <Card
      sx={{
        // maxWidth: 300,

        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Stack
          sx={{ minHeight: 280, maxHeight: 280 }}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Box>
            <Stack direction={"row"} gap={1} alignItems={"start"} mb={1}>
              <CardMedia
                component="img"
                image={generateS3FilePath(book?.imageUrl)}
                alt={book?.title || "Book Cover"}
                sx={{
                  objectFit: "fill",
                  width: 100,
                  minHeigh: 150,
                  maxHeight: 150,
                  borderRadius: "6px",
                  boxShadow: 1,
                }}
              />
              <Stack gap={1}>
                <EllipsisText
                  lines={2}
                  variant="h6"
                  fontWeight="bold"
                  fontSize={{ xs: 16, sm: 18 }}
                >
                  {book?.title || "N/A"}
                </EllipsisText>
                <Typography variant="body2" color="text.secondary">
                  By:
                </Typography>
                <EllipsisText variant="body2">
                  {book?.author || "Unknown"}
                </EllipsisText>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"space-between"}
                  spacing={1}
                >
                  <Typography variant="body2" color="success">
                    24 Reviews
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2" fontWeight="bold">
                      4.5
                    </Typography>
                    <Star sx={{ color: "green", fontSize: 18 }} />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <EllipsisText variant="body2" color="text.secondary">
              Description:
            </EllipsisText>
            <EllipsisText lines={3} variant="body2" gutterBottom>
              {book?.description || "N/A"}
            </EllipsisText>
          </Box>
          {!hideEditBtn && (
            <Button
              disabled={isDisabled}
              variant="contained"
              color="primaryLight"
              onClick={onEdit}
              fullWidth
            >
              Edit Book
            </Button>
          )}
          {markReadBtn && (
            <Button
              disabled={isDisabled}
              variant="contained"
              color="primaryLight"
              onClick={onMarkRead}
              fullWidth
            >
              Mark as read
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookCard;

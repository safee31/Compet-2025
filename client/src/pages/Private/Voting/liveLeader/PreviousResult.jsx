import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { generateS3FilePath } from "../../../../utils/files";
import DataInfo from "../../../../components/DataInfo";
import { getMin0Number } from "../../../../utils/toTitleCase";

const PreviousResult = ({ data = [] }) => {
  return data?.length > 0 ? (
    <Box mt={2}>
      {data?.map((monthData) => (
        <Accordion key={monthData.month}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Typography component="span">
              {new Date(`${monthData.month}`).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/* ✅ Overall Winner Section */}
            <Stack direction="row" alignItems="center" pb={3}>
              <Box>
                <Avatar
                  src={generateS3FilePath(monthData.overallWinner.profileImage)} // Default image if missing
                  alt={monthData.overallWinner.firstName}
                />
              </Box>

              <Stack ml={2}>
                <Typography fontWeight="bold">Overall Winner</Typography>
                <Typography fontSize={14} color="grey">
                  {monthData?.overallWinner.firstName}{" "}
                  {monthData?.overallWinner.lastName}
                </Typography>
                <Typography fontSize={12} color="gray">
                  {monthData?.overallWinner.companyName}
                </Typography>
                <Typography fontSize={12} color="gray">
                  Department: {monthData?.overallWinner.department}
                </Typography>
                <Typography fontSize={12} color="blue">
                  Votes: {getMin0Number(monthData?.overallWinner.votesCount)}
                </Typography>
              </Stack>
            </Stack>

            {/* ✅ Company-wise Winners */}
            <Box mt={2}>
              {monthData.companyWinners.map((winner, idx) => (
                <Box
                  key={idx}
                  mt={2}
                  pb={1.5}
                  sx={{ borderBottom: "1px solid lightgrey" }}
                >
                  <Grid2 container alignItems="center">
                    <Grid2 size={{ xs: 12 }}>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar
                          src={generateS3FilePath(winner.profileImage)}
                          alt={winner.firstName}
                        />
                        <Stack>
                          <Typography fontSize={13} color="grey">
                            {winner.firstName} {winner.lastName}
                          </Typography>
                          <Typography fontSize={12} color="grey">
                            {winner.companyName}
                          </Typography>
                          <Typography fontSize={12} color="blue">
                            Votes: {getMin0Number(winner?.votesCount)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid2>
                  </Grid2>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  ) : (
    <DataInfo />
  );
};

export default PreviousResult;

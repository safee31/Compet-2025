// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Avatar,
//   Box,
//   Divider,
//   Grid2,
//   Stack,
//   Typography,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { generateS3FilePath } from "../../../utils/files";
// import DataInfo from "../../../components/DataInfo";

// const PreviousResult = ({ data = [] }) => {
//   return data?.length > 0 ? (
//     <Box mt={2}>
//       {data?.map((monthData) => (
//         <Accordion key={monthData.month}>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//           >
//             <Typography component="span">
//               {new Date(`${monthData.month}-01`).toLocaleString("default", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </Typography>
//           </AccordionSummary>

//           <AccordionDetails>
//             {/* ✅ Overall Winner Section */}
//             <Stack direction="row" mt={2} alignItems="center">
//               <Box>
//                 <Avatar
//                   src={generateS3FilePath(monthData.overallWinner.profileImage)} // Default image if missing
//                   alt={monthData.overallWinner.firstName}
//                 />
//               </Box>

//               <Stack ml={2}>
//                 <Typography fontWeight="bold">Overall Winner</Typography>
//                 <Typography fontSize={14} color="grey">
//                   {monthData.overallWinner.firstName}{" "}
//                   {monthData.overallWinner.lastName}
//                 </Typography>
//                 <Typography fontSize={12} color="gray">
//                   {monthData.overallWinner.companyName}
//                 </Typography>
//               </Stack>
//             </Stack>

//             {/* ✅ Company-wise Winners */}
//             <Box mt={2}>
//               {monthData.companyWinners.map((winner) => (
//                 <Box key={winner._id} mt={2}>
//                   <Grid2 container alignItems="center">
//                     <Grid2 size={{ xs: 12 }}>
//                       <Typography fontSize={13} fontWeight="bold">
//                         {winner.companyName}
//                       </Typography>
//                     </Grid2>

//                     <Grid2 size={{ xs: 12 }}>
//                       <Stack direction="row" alignItems="center">
//                         <Avatar
//                           src={generateS3FilePath(winner.profileImage)}
//                           alt={winner.firstName}
//                         />
//                         <Typography fontSize={13} color="grey" ml={1}>
//                           {winner.firstName} {winner.lastName}
//                         </Typography>
//                       </Stack>
//                     </Grid2>
//                   </Grid2>
//                   <Divider sx={{ mt: 1 }} />
//                 </Box>
//               ))}
//             </Box>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </Box>
//   ) : (
//     <DataInfo />
//   );
// };

// export default PreviousResult;

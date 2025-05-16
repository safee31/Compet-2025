// import {
//   Avatar,
//   Box,
//   Divider,
//   Grid2,
//   Paper,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { generateS3FilePath } from "../../../utils/files";
// import { SOCKET_IO_CONNECTION } from "../../../constants";
// import DataInfo from "../../../components/DataInfo";

// const socket = io(SOCKET_IO_CONNECTION, { transports: ["websocket"] });

// const LiveResult = ({ data: liveWinners }) => {
//   const [liveData, setLiveData] = useState(null);

//   useEffect(() => {
//     // ✅ Set initial leaderboard data from API
//     if (liveWinners) {
//       setLiveData(liveWinners.leaderboard);
//     }

//     // ✅ Listen to real-time updates
//     socket.on("voteUpdated", (data) => {
//       setLiveData(data.leaderboard); // Replace state with real-time data
//     });

//     // ✅ Cleanup on unmount
//     return () => {
//       socket.off("voteUpdated");
//     };
//   }, [liveWinners]); // Depend on API response

//   if (!liveData) return <DataInfo />;

//   return (
//     <Paper sx={{ borderRadius: "6px", p: 2 }}>
//       <Typography fontSize={18} fontWeight={"bold"}>
//         {liveData?.votingSessionDate
//           ? new Date(`${liveData.votingSessionDate}-01`).toLocaleString(
//               "default",
//               {
//                 month: "long",
//                 year: "numeric",
//               }
//             )
//           : "Live Voting"}
//       </Typography>

//       {/* Overall Winner Section */}
//       <Stack direction="row" mt={5} alignItems="center">
//         <Box>
//           {/* <img
//             src={liveData?.overallWinner?.profileImage || '/default-avatar.png'}
//             style={{ height: '50px', width: '50px', borderRadius: '50%' }}
//             alt='Winner'
//           /> */}
//           <Avatar
//             src={
//               generateS3FilePath(liveData?.overallWinner?.profileImage) ||
//               "/default-avatar.png"
//             }
//             alt={liveData?.overallWinner?.firstName}
//           />
//         </Box>

//         <Stack ml={2}>
//           <Typography fontWeight="bold">Overall Leader</Typography>
//           <Typography fontSize={14} color="grey">
//             {liveData?.overallWinner?.firstName}{" "}
//             {liveData?.overallWinner?.lastName}
//           </Typography>
//           <Typography fontSize={12} color="gray">
//             {liveData?.overallWinner?.companyName}
//           </Typography>
//           {/* <Typography fontSize={12} color="blue">
//             Votes: {liveData?.overallWinner?.votes}
//           </Typography> */}
//         </Stack>
//       </Stack>

//       {/* Company-wise Winners */}
//       <Box mt={2}>
//         {liveData?.companyWinners?.map((winner) => (
//           <Box key={winner.winnerId} mt={2}>
//             <Grid2 container alignItems="center">
//               <Grid2 size={{ xs: 12 }}>
//                 <Typography fontSize={13} fontWeight="bold">
//                   {winner.companyName}
//                 </Typography>
//               </Grid2>

//               <Grid2 size={{ xs: 12 }}>
//                 <Stack direction="row" alignItems="center">
//                   <Avatar
//                     src={
//                       generateS3FilePath(winner.profileImage) ||
//                       "/default-avatar.png"
//                     }
//                     alt={winner?.firstName}
//                   />
//                   <Typography fontSize={13} color="grey" ml={1}>
//                     {/* {winner.firstName} {winner.lastName} ({winner.votes} votes) */}
//                     {winner.firstName} {winner.lastName}
//                   </Typography>
//                 </Stack>
//               </Grid2>
//             </Grid2>
//             <Divider sx={{ mt: 1 }} />
//           </Box>
//         ))}
//       </Box>
//     </Paper>
//   );
// };

// export default LiveResult;

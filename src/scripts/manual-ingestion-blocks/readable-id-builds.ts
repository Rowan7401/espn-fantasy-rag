// function createReadableIdDraft(sentence: string): string {
//   const roundMatch = sentence.match(/round\s(\d+)/i);
//   const pickMatch = sentence.match(/pick\s(\d+)/i);
//   const teamMatch = sentence.match(/the team (.+?) selected/i);
//   const playerMatch = sentence.match(/selected (.+?) during/i);

//   const round = roundMatch ? `R${roundMatch[1]}` : "R0";
//   const pick = pickMatch ? `P${pickMatch[1]}` : "P0";

//   const team = teamMatch
//     ? teamMatch[1]
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 12)
//     : "unknownteam";

//   const player = playerMatch
//     ? playerMatch[1]
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 12)
//     : "unknownplayer";

//   return `draft-2025-${round}-${pick}-${team}-${player}`;
// }

// function createTeamSummaryReadableId(sentence: string): string {
//   const teamMatch = sentence.match(/the team (.+?), owned/i);

//   const team = teamMatch
//     ? teamMatch[1]
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, "")
//       .substring(0, 16)
//     : "unknownteam";

//   return `team-2025-${team}`;
// }

// function createReadableIdFromMetadata(metadata: Record<string, any>): string {
//     const normalize = (val: string, fallback: string) =>
//       (val || fallback)
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 20);
  
//     const team = normalize(metadata.team, "unknownteam");
//     const player = normalize(metadata.player, "unknownplayer");
//     const position = (metadata.position || "unk").toLowerCase();
  
//     return `playerstats-2025-${team}-${player}-${position}`;
//   }

//   function createExpectationId(metadata: Record<string, any>): string {
//     const normalize = (val: string, fallback: string) =>
//       (val || fallback)
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 20);
  
//     const team = normalize(metadata.team, "unknownteam");
//     const player = normalize(metadata.player, "unknownplayer");
//     const position = (metadata.position || "unk").toLowerCase();
  
//     return `expectation-2025-${team}-${player}-${position}`;
//   }

function draftMetadataObj() {
    const teamMatch = sentence.match(/the team (.+?), owned/i);
    const ownerMatch = sentence.match(/owned by (.+?),/i);
    const winsMatch = sentence.match(/finished with a (\d+) win/i);
    const lossesMatch = sentence.match(/and (\d+) loss/i);
    const pointsForMatch = sentence.match(/scored ([\d.]+) total points/i);
    const pointsAgainstMatch = sentence.match(/allowing ([\d.]+) points/i);

    if (teamMatch) metadata.team = teamMatch[1];
    if (ownerMatch) metadata.owner = ownerMatch[1];
    if (winsMatch) metadata.wins = parseInt(winsMatch[1]);
    if (lossesMatch) metadata.losses = parseInt(lossesMatch[1]);
    if (pointsForMatch) metadata.points_for = parseFloat(pointsForMatch[1]);
    if (pointsAgainstMatch) metadata.points_against = parseFloat(pointsAgainstMatch[1]);

    const draftMetadata: Record<string, any> = {
        text: sentence,
        type: "fantasy_draft_pick",
        league: "fantasy_football",
        season: 2025,
    };

    const metadata = {
        text: sentence,
        type: "team_summary",
        league: "fantasy_football",
        season: 2025,
    };
}

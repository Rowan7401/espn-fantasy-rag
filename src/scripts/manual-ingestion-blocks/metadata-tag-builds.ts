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

function playerSeasonStatsMetadataObj() {
    const teamMatch = sentence.match(/Team (.+?) is managed/i);
      const ownerMatch = sentence.match(/managed by (.+?)\./i);
      const playerMatch = sentence.match(/Their player (.+?) plays/i);
      const positionMatch = sentence.match(/plays (\w+)/i);

      const gamesMatch = sentence.match(/appeared in (\d+) games/i);

      const totalPointsMatch = sentence.match(/scored ([\d.]+) total fantasy points/i);
      const avgPointsMatch = sentence.match(/average of ([\d.]+) points per game/i);

      const rushingAttemptsMatch = sentence.match(/had ([\d.]+) attempts/i);
      const rushingTotalMatch = sentence.match(/for ([\d.]+) total rushing yards/i);
      const avgRushingMatch = sentence.match(/averaging ([\d.]+) rushing yards per game/i);

      const receptionsMatch = sentence.match(/recorded ([\d.]+) receptions/i);
      const targetsMatch = sentence.match(/on ([\d.]+) targets/i);
      const receivingTotalMatch = sentence.match(/for ([\d.]+) total receiving yards/i);
      const avgReceivingMatch = sentence.match(/averaging ([\d.]+) receiving yards per game/i);
      const receivingTDsMatch = sentence.match(/scored ([\d.]+) receiving touchdowns/i);

      const yprMatch = sentence.match(/averaged ([\d.]+) yards per reception/i);
      const yacMatch = sentence.match(/had ([\d.]+) total yards after catch/i);

      // ✅ Assign metadata
      if (teamMatch) metadata.team = teamMatch[1];
      if (ownerMatch) metadata.owner = ownerMatch[1].trim();
      if (playerMatch) metadata.player = playerMatch[1];
      if (positionMatch) metadata.position = positionMatch[1];

      if (gamesMatch) metadata.games_played = parseInt(gamesMatch[1]);

      if (totalPointsMatch) metadata.points_total = parseFloat(totalPointsMatch[1]);
      if (avgPointsMatch) metadata.avg_points = parseFloat(avgPointsMatch[1]);

      if (rushingAttemptsMatch) metadata.rushing_attempts_total = parseFloat(rushingAttemptsMatch[1]);
      if (rushingTotalMatch) metadata.rushing_yards_total = parseFloat(rushingTotalMatch[1]);
      if (avgRushingMatch) metadata.avg_rushing_yards = parseFloat(avgRushingMatch[1]);

      if (receptionsMatch) metadata.receptions_total = parseFloat(receptionsMatch[1]);
      if (targetsMatch) metadata.targets_total = parseFloat(targetsMatch[1]);
      if (receivingTotalMatch) metadata.receiving_yards_total = parseFloat(receivingTotalMatch[1]);
      if (avgReceivingMatch) metadata.avg_receiving_yards = parseFloat(avgReceivingMatch[1]);
      if (receivingTDsMatch) metadata.receiving_TDs_total = parseFloat(receivingTDsMatch[1]);

      if (yprMatch) metadata.yards_per_reception = parseFloat(yprMatch[1]);
      if (yacMatch) metadata.yards_after_catch_total = parseFloat(yacMatch[1]);
}

import { getWorstTeam } from './team/getWorstTeam';
import { getBestTeam } from './team/getRecordRankings';

export const skills = {
  worst_team: getWorstTeam,
  best_team: getBestTeam,
};

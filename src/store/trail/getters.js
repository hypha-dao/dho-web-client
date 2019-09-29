export const ballots = ({ ballots }) => ballots
export const getBallot = ({ ballots }) => id => ballots.find(b => b.ballot_id === id)

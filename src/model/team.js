module.exports = class Team {
    team_name;
    wins;
    losses;
    ties;
    score;

    constructor( teamName, wins, losses, ties, score) {
        this.team_name = teamName;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
        this.score = score;
    }
}
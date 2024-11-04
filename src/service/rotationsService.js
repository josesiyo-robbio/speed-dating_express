


function generateRotations(participants, duration, date_time) 
{
    let men = participants.filter(p => p.gender === 'male');
    let women = participants.filter(p => p.gender === 'female');

    while (men.length < women.length) {
        men.push({ name: 'rest', gender: 'male' });
    }
    while (women.length < men.length) {
        women.push({ name: 'rest', gender: 'female' });
    }

    const numRounds = men.length; 
    const rotations = [];
    const eventStartTime = new Date(date_time);
    const roundDuration = duration / numRounds;

    for (let i = 0; i < numRounds; i++) 
    {
        const round = [];
        for (let j = 0; j < numRounds; j++) 
        {
            const pair = {
                man: men[j].name,
                woman: women[(j + i) % numRounds].name
            };
            round.push(pair);
        }

        const roundStartTime = new Date(eventStartTime.getTime() + i * roundDuration * 60000);
        round.push({ startTime: roundStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

        rotations.push(round);
    }

    return rotations;
}


module.exports = {generateRotations};
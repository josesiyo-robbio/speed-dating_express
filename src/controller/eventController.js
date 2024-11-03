


const moduleEVENT = require('../model/event');
const {validateRequiredFields} = require("../middleware/validatorApi");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const {sendWelcomeEmails}       =   require('../service/mailService');



const EventController =
{
    createNew: async (req, res) => 
    {
        const requiredFields = ['name', 'duration', 'date_time', 'participants'];
        const validation = validateRequiredFields(req.body, requiredFields);
        if (!validation.success) 
        {
            return res.status(400).json({message: validation.message,missingFields: validation.missingFields});
        }
    
        const { name, duration, date_time, participants } = req.body;
    
        if (!Array.isArray(participants) || participants.length === 0) 
        {
            return res.status(400).json({ message: 'Participants must be a non-empty array' });
        }
    
        try 
        {
            const newEvent = await moduleEVENT.insert_new(name, duration, date_time, participants);
            if (!newEvent || !newEvent.event_id) 
            {
                return res.status(500).json({ message: 'Error creating event' });
            }
    
            const rotaciones = generateRotations(participants, duration, date_time);
            if (!rotaciones || rotaciones.length === 0) 
            {
                return res.status(500).json({ message: 'Error generating rotations' });
            }

            await sendWelcomeEmails(name,participants,newEvent,date_time,duration);
    
            return res.status(201).json({message: 'Event created successfully and emails sent',});
        } 
        catch (error) 
        {
            console.error(error);
            return res.status(500).json({ message: 'Error', error: { message: error.message } });
        }
    },
    


    createNewVote: async (req, res) =>
    {
        try 
        {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) 
                    {
                    return res.status(401).json({ message: 'Token missing or invalid' });
            }
            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, SECRET_KEY);
            const voter_email = decoded.email;
            const event_id = decoded.event_id;

            const { voted_email } = req.body;
            if (!voted_email)
            {
                return res.status(400).json({ message: 'voted_email is required' });
            }

            const validEmailVoted = await moduleEVENT.select_participant(event_id, voted_email);

            if (validEmailVoted && voted_email !== voter_email)
            {
                const newVote = await moduleEVENT.insert_new_vote(voter_email, voted_email, event_id);

                return res.status(201).json({
                    message: 'Vote registered successfully',
                    event_id: newVote.event_id
                });
            }
            else
            {
                return res.status(400).json({ message: 'Error creating vote: participant not found in this event or cannot vote for yourself' });
            }

        }
        catch (error)
        {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error registering vote', error: { message: error.message } });
        }
    },


     getMatchesForEvent : async (req, res) =>
     {
        try
        {
            const { event_id } = req.body;
            const matches = await moduleEVENT.select_matches(event_id);

            const formattedMatches = matches.map((match, index) =>
            {
                return `MATCH ${index + 1}: ${match.email1} - ${match.email2}`;
            });

            return res.status(200).json({
                message: 'Matches retrieved successfully',
                matches: formattedMatches
            });
        }
        catch (error)
        {
            console.error('Error fetching matches:', error);
            res.status(500).json({ message: 'Error retrieving matches', error: { message: error.message } });
        }
    },

}


function generateRotations(participants, duration, date_time) {
    let men = participants.filter(p => p.gender === 'male');
    let women = participants.filter(p => p.gender === 'female');

    // Equilibrar los grupos agregando "rest"
    while (men.length < women.length) {
        men.push({ name: 'rest', gender: 'male' });
    }
    while (women.length < men.length) {
        women.push({ name: 'rest', gender: 'female' });
    }

    const numRounds = men.length; // o women.length, ya que son iguales

    const rotations = [];
    const eventStartTime = new Date(date_time);
    const roundDuration = duration / numRounds;

    for (let i = 0; i < numRounds; i++) {
        const round = [];
        for (let j = 0; j < numRounds; j++) {
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



module.exports = EventController;

const moduleEVENT = require('../model/event');
const {validateRequiredFields} = require("../middleware/validatorApi");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


async function createTransporter()
{
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'genesis.gulgowski45@ethereal.email',
            pass: 'nk1N72hJyRZXFnBH33'
        }
    });
}

const EventController =
{
    createNew : async (req, res) =>
    {
        try
        {
            let requiredFields;
            const { name, duration, date_time, participants } = req.body;
            requiredFields = ['name', 'duration', 'date_time', 'participants'];
            const validation = validateRequiredFields(req.body, requiredFields);

            if (!validation.success)
            {
                res.status(400).json({message: validation.message, missingFields: validation.missingFields});
                return;
            }

            if(!Array.isArray(participants) || participants.length === 0)
            {
                return res.status(400).json({ message: 'Participants must be a non-empty array' });
            }

            const newEvent = await moduleEVENT.insert_new( name, duration, date_time, participants);

            if(!newEvent)
            {
                return res.status(400).json({ message: 'bad error' });
            }

            if (newEvent && newEvent.event_id)
            {
                const rotaciones = generateRotations(participants, duration, date_time); // Agregar date_time

                if (rotaciones && rotaciones.length > 0)
                {
                    const transporter = await createTransporter();

                    for (const participant of participants)
                    {
                        const token = jwt.sign({ email: participant.email, event_id: newEvent.event_id }, SECRET_KEY, { expiresIn: '3h' });
                        let mailOptions = {
                            from: `"Event Organizer" <${transporter.options.auth.user}>`,
                            to: participant.email,
                            subject: `Welcome to the ${name} Event!`,
                            text: `Hello ${participant.name},\n\nYour participation in the event "${name}" has been confirmed!\n\nEvent Date: ${date_time}\nDuration: ${duration} minutes\n\nAccess Token: ${token}\n\nBest regards,\nEvent Organizer`
                        };

                        await transporter.sendMail(mailOptions);
                    }

                    return res.status(201).json({
                        message: 'Event created successfully and emails sent',
                        event_id: newEvent.event_id,
                        rotations: rotaciones
                    });
                }
                else
                {
                    return res.status(500).json({ message: 'Error generating rotations' });
                }
            }
            else {
                return res.status(500).json({ message: 'Error creating event' });
            }

        }
        catch (error)
        {
            console.log(error);
            res.status(500).json({ message: 'Error', error: { message: error.message } });
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
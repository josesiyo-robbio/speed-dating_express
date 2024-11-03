


const moduleEVENT = require('../model/event');
const {validateRequiredFields} = require("../middleware/validatorApi");
const {sendWelcomeEmails}       =   require('../service/mailService');
const {generateRotations} = require('../service/rotationsService');



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
    
            return res.status(201).json({
                message: 'Event created successfully and emails sent',
                event_id: newEvent.event_id,
                rotations: rotaciones
            });
        } 
        catch (error) 
        {
            console.error(error);
            return res.status(500).json({ message: 'Error', error: { message: error.message } });
        }
    },



    createNewVote: async (req, res) => 
    {
        const { voted_email }   =   req.body;
        const requiredFields    =   ['voted_email'];
    
        const validation = validateRequiredFields(req.body, requiredFields);
        if (!validation.success) 
        {
            return res.status(400).json({ message: validation.message, missingFields: validation.missingFields });
        }
    
        if (!voted_email || typeof voted_email !== 'string') 
        {
            return res.status(400).json({ message: 'Invalid voted_email provided' });
        }
    
        try 
        {
            const { event_id, email: voter_email } = req.user;
    
            const validEmailVoted = await moduleEVENT.select_participant(event_id, voted_email);
            if (!validEmailVoted) 
            {
                return res.status(400).json({ message: 'Error creating vote: participant not found in this event' });
            }
    
            if (voted_email === voter_email) 
            {
                return res.status(400).json({ message: 'Error creating vote: you cannot vote for yourself' });
            }
    
            const newVote = await moduleEVENT.insert_new_vote(voter_email, voted_email, event_id);
    
            return res.status(201).json({
                message: 'Vote registered successfully',
                event_id: newVote.event_id
            });
        } 
        catch (error) 
        {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Error registering vote', error: { message: error.message } });
        }
    },



    getMatchesForEvent : async (req, res) =>
    {
        const { event_id }      =   req.body;
        const requiredFields    =   ['event_id'];
    
        const validation = validateRequiredFields(req.body, requiredFields);
        if (!validation.success) 
        {
            return res.status(400).json({ message: validation.message, missingFields: validation.missingFields });
        }

        try
        {
            const matches = await moduleEVENT.select_matches(event_id);
        
            if (!matches || matches.length === 0) 
            {
                return res.status(404).json({ message: 'No matches found for this event' });
            }
    
            const formattedMatches = matches.map((match, index) => ({
                matchNumber     :   index + 1,
                participant1    :   match.email1,
                participant2    :   match.email2
            }));
    
            return res.status(200).json({
                message: 'Matches retrieved successfully',
                matches: formattedMatches
            });
        }
        catch (error)
        {
            console.error('Error fetching matches:', error);
            return res.status(500).json({ message: 'Error retrieving matches', error: { message: error.message } });
        }
    },

}



module.exports = EventController;
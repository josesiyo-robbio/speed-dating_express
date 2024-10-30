


const EventsQuery =
{
    INSERT_EVENT:
    `
    INSERT INTO 
        events (name, duration, date_time) 
    VALUES 
        ($1, $2, $3)
    RETURNING 
        id
    `,


    INSERT_PARTICIPANTS :
    `INSERT INTO 
    registrations 
        (event_id, participant_email, participant_name, participant_gender) 
    VALUES 
        ($1, $2, $3, $4)
    `,

    INSERT_VOTE:
    `INSERT INTO 
        votes (voter_email, voted_email,event_id)
    VALUES ($1, $2, $3)
    RETURNING event_id;
    
      `,
}

module.exports = EventsQuery;
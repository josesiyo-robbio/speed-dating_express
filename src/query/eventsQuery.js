


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
    `
}

module.exports = EventsQuery;
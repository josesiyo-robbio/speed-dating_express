


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


    SELECT_PARTICIPANT:
    `SELECT 
        participant_email
    FROM 
        registrations
    WHERE 
        event_id = $1
    AND 
        participant_email = $2
    `,


    SELECT_MATCHES:
    `
    SELECT
        LEAST(v1.voter_email, v1.voted_email) AS email1,
        GREATEST(v1.voter_email, v1.voted_email) AS email2
        FROM
            votes v1
        JOIN
            votes v2 ON v1.voter_email = v2.voted_email AND v1.voted_email = v2.voter_email
    WHERE
        v1.event_id = $1
    GROUP BY
        email1, email2;  
    `
}

module.exports = EventsQuery;
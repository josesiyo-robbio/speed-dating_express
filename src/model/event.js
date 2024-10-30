
const moduleDB   =   require('../db/postgres');
const moduleEVENTSQUERY = require('../query/eventsQuery');


const Event =
{
    insert_new: async (name, duration, date_time, participants) =>
    {
        try
        {
            const result = await moduleDB.tx(async t => {
                const eventResult = await t.one(moduleEVENTSQUERY.INSERT_EVENT, [name, duration, date_time]);
                const eventId = eventResult.id;

                for (const participant of participants)
                {
                    await t.none(moduleEVENTSQUERY.INSERT_PARTICIPANTS, [eventId, participant.email, participant.name, participant.gender]);
                }

                return { message: 'Event created successfully', event_id: eventId };
            });

            return result;
        }
        catch (error)
        {
            console.error('Error:', error);
            throw error;
        }
    },


    insert_new_vote : async (voter_email, voted_email,event_id) =>
    {
        try
        {
            const result = moduleDB.one({
            text : moduleEVENTSQUERY.INSERT_VOTE,
            values : [voter_email, voted_email,event_id],
            rowMode : 'json'
        });
            console.log(result);
            return result;
        }
        catch (error)
        {
            console.error('Error:', error);
            throw error;
        }

    },



    select_participant : async (event_id,participant_email) =>
    {
        try
        {
            const result = await moduleDB.oneOrNone({
                text : moduleEVENTSQUERY.SELECT_PARTICIPANT,
                values : [event_id,participant_email],
                rowMode : 'json'
            });
            console.log(result);
            return result;
        }
        catch (error)
        {
            console.error('Error:', error);
            throw error;
        }
    },


    select_matches : async(event_id) =>
    {
        try
        {
            const result = await moduleDB.manyOrNone({
                text : moduleEVENTSQUERY.SELECT_MATCHES,
                values : [event_id],
                rowMode : 'json'
            });
            console.log(result);
            return result;
        }
        catch (error)
        {
            console.error('Error:', error);
            throw error;
        }
    }




}

module.exports = Event;
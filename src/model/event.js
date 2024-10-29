
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
    }

}

module.exports = Event;
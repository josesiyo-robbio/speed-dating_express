create database speed_dating
    with owner postgres;

create table public.events
(
    id        serial
        primary key,
    name      varchar(255) not null,
    duration  integer      not null,
    date_time timestamp with time zone
);

alter table public.events
    owner to postgres;

create table public.registrations
(
    event_id           integer      not null
        references public.events
            on delete cascade,
    participant_email  varchar(255) not null,
    participant_name   varchar(255) not null,
    participant_gender varchar(10)  not null
        constraint registrations_participant_gender_check
            check ((participant_gender)::text = ANY
                   ((ARRAY ['male'::character varying, 'female'::character varying])::text[])),
    primary key (event_id, participant_email)
);

alter table public.registrations
    owner to postgres;

create table public.votes
(
    id          serial
        primary key,
    voter_email varchar(255),
    voted_email varchar(255),
    event_id    integer
        references public.events
            on delete cascade,
    unique (voter_email, voted_email, event_id)
);

alter table public.votes
    owner to postgres;


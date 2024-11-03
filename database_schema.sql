create database speed_dating
    with owner postgres;

create sequence public.events_id_seq
    as integer;

alter sequence public.events_id_seq owner to postgres;

create sequence public.votes_id_seq
    as integer;

alter sequence public.votes_id_seq owner to postgres;

create table public.events
(
    id        bigint default nextval('events_id_seq'::regclass) not null
        primary key,
    name      varchar(255)                                      not null,
    duration  integer                                           not null,
    date_time timestamp
);

alter table public.events
    owner to postgres;

alter sequence public.events_id_seq owned by public.events.id;

create table public.registrations
(
    event_id           bigint       not null
        references public.events
            on delete cascade,
    participant_email  varchar(255) not null,
    participant_name   varchar(255) not null,
    participant_gender varchar(255) not null
        constraint registrations_participant_gender_check
            check ((participant_gender)::text = ANY
                   (ARRAY [('male'::character varying)::text, ('female'::character varying)::text])),
    primary key (event_id, participant_email)
);

alter table public.registrations
    owner to postgres;

create table public.votes
(
    id          bigint default nextval('votes_id_seq'::regclass) not null
        primary key,
    voter_email varchar(255),
    voted_email varchar(255),
    event_id    bigint
        references public.events
            on delete cascade,
    unique (voter_email, voted_email, event_id)
);

alter table public.votes
    owner to postgres;

alter sequence public.votes_id_seq owned by public.votes.id;


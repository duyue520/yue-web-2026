--
-- PostgreSQL database dump
--

\restrict zObRbaDQ5tsyhoDDfZK72p2kPOGiiv1vyzmbjKXDCzQh8UllPH6OGjoLI5Xzshc

-- Dumped from database version 13.23
-- Dumped by pg_dump version 13.23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_keys (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(64) DEFAULT '默认密钥'::character varying NOT NULL,
    key_hash character varying(64) NOT NULL,
    key_prefix character varying(24) DEFAULT ''::character varying NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    rpm integer DEFAULT 15 NOT NULL,
    daily_limit integer DEFAULT 300 NOT NULL,
    used_today integer DEFAULT 0 NOT NULL,
    usage_date date DEFAULT CURRENT_DATE NOT NULL,
    total_calls bigint DEFAULT 0 NOT NULL,
    total_tokens bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: ai_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_keys_id_seq OWNED BY public.ai_keys.id;


--
-- Name: ai_upstreams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_upstreams (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    kind character varying(24) DEFAULT 'openai'::character varying NOT NULL,
    base_url character varying(300) DEFAULT ''::character varying NOT NULL,
    accounts jsonb DEFAULT '[]'::jsonb NOT NULL,
    models jsonb DEFAULT '[]'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_ok_at timestamp with time zone,
    last_err text DEFAULT ''::text NOT NULL
);


--
-- Name: ai_upstreams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_upstreams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_upstreams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_upstreams_id_seq OWNED BY public.ai_upstreams.id;


--
-- Name: ai_usage_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage_log (
    id bigint NOT NULL,
    key_id integer DEFAULT '-1'::integer NOT NULL,
    user_id integer DEFAULT '-1'::integer NOT NULL,
    model character varying(64) DEFAULT ''::character varying NOT NULL,
    upstream character varying(64) DEFAULT ''::character varying NOT NULL,
    ok boolean DEFAULT true NOT NULL,
    prompt_tokens integer DEFAULT 0 NOT NULL,
    completion_tokens integer DEFAULT 0 NOT NULL,
    latency_ms integer DEFAULT 0 NOT NULL,
    err character varying(200) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_usage_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_usage_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_usage_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_usage_log_id_seq OWNED BY public.ai_usage_log.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: blog_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_articles (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    summary character varying(500),
    cover_url character varying(500),
    category_id integer,
    user_id integer NOT NULL,
    views integer,
    created_at timestamp without time zone,
    source character varying(160) DEFAULT ''::character varying NOT NULL
);


--
-- Name: blog_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_articles_id_seq OWNED BY public.blog_articles.id;


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- Name: blog_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_categories_id_seq OWNED BY public.blog_categories.id;


--
-- Name: blog_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_comments (
    id integer NOT NULL,
    article_id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    created_at timestamp without time zone
);


--
-- Name: blog_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_comments_id_seq OWNED BY public.blog_comments.id;


--
-- Name: corrected_labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.corrected_labels (
    id integer NOT NULL,
    user_id integer NOT NULL,
    diagnosis_id integer,
    original_prediction character varying(100) NOT NULL,
    corrected_label character varying(100) NOT NULL,
    image_base64 text,
    created_at timestamp without time zone
);


--
-- Name: corrected_labels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.corrected_labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: corrected_labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.corrected_labels_id_seq OWNED BY public.corrected_labels.id;


--
-- Name: diagnosis_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_records (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_base64 text,
    top1_disease character varying(100) NOT NULL,
    top1_confidence double precision NOT NULL,
    top2_disease character varying(100),
    top2_confidence double precision,
    top3_disease character varying(100),
    top3_confidence double precision,
    is_healthy boolean,
    severity character varying(20),
    severity_percent double precision,
    created_at timestamp without time zone
);


--
-- Name: diagnosis_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.diagnosis_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: diagnosis_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.diagnosis_records_id_seq OWNED BY public.diagnosis_records.id;


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedbacks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    category character varying(30) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    reply text,
    replied_at timestamp without time zone,
    created_at timestamp without time zone
);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;


--
-- Name: guestbook_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guestbook_messages (
    id integer NOT NULL,
    user_id integer,
    owner_name character varying(50),
    nickname character varying(50) NOT NULL,
    content text NOT NULL,
    deleted boolean,
    created_at timestamp without time zone
);


--
-- Name: guestbook_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guestbook_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guestbook_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guestbook_messages_id_seq OWNED BY public.guestbook_messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100),
    hashed_password character varying(200) NOT NULL,
    avatar_base64 text,
    is_active boolean,
    created_at timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: video_favs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_favs (
    user_id integer NOT NULL,
    name character varying(120) NOT NULL,
    src character varying(24) DEFAULT ''::character varying NOT NULL,
    vod_id character varying(24) DEFAULT ''::character varying NOT NULL,
    pic character varying(500) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: video_prog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_prog (
    user_id integer NOT NULL,
    name character varying(120) NOT NULL,
    src character varying(24) DEFAULT ''::character varying NOT NULL,
    vod_id character varying(24) DEFAULT ''::character varying NOT NULL,
    pic character varying(500) DEFAULT ''::character varying NOT NULL,
    ep integer DEFAULT 0 NOT NULL,
    pos integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_keys ALTER COLUMN id SET DEFAULT nextval('public.ai_keys_id_seq'::regclass);


--
-- Name: ai_upstreams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_upstreams ALTER COLUMN id SET DEFAULT nextval('public.ai_upstreams_id_seq'::regclass);


--
-- Name: ai_usage_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_log ALTER COLUMN id SET DEFAULT nextval('public.ai_usage_log_id_seq'::regclass);


--
-- Name: blog_articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles ALTER COLUMN id SET DEFAULT nextval('public.blog_articles_id_seq'::regclass);


--
-- Name: blog_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories ALTER COLUMN id SET DEFAULT nextval('public.blog_categories_id_seq'::regclass);


--
-- Name: blog_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments ALTER COLUMN id SET DEFAULT nextval('public.blog_comments_id_seq'::regclass);


--
-- Name: corrected_labels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corrected_labels ALTER COLUMN id SET DEFAULT nextval('public.corrected_labels_id_seq'::regclass);


--
-- Name: diagnosis_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_records ALTER COLUMN id SET DEFAULT nextval('public.diagnosis_records_id_seq'::regclass);


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


--
-- Name: guestbook_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guestbook_messages ALTER COLUMN id SET DEFAULT nextval('public.guestbook_messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ai_keys ai_keys_key_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_keys
    ADD CONSTRAINT ai_keys_key_hash_key UNIQUE (key_hash);


--
-- Name: ai_keys ai_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_keys
    ADD CONSTRAINT ai_keys_pkey PRIMARY KEY (id);


--
-- Name: ai_upstreams ai_upstreams_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_upstreams
    ADD CONSTRAINT ai_upstreams_name_key UNIQUE (name);


--
-- Name: ai_upstreams ai_upstreams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_upstreams
    ADD CONSTRAINT ai_upstreams_pkey PRIMARY KEY (id);


--
-- Name: ai_usage_log ai_usage_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_log
    ADD CONSTRAINT ai_usage_log_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: blog_articles blog_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_name_key UNIQUE (name);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_comments blog_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_pkey PRIMARY KEY (id);


--
-- Name: corrected_labels corrected_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corrected_labels
    ADD CONSTRAINT corrected_labels_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_records diagnosis_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_records
    ADD CONSTRAINT diagnosis_records_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: guestbook_messages guestbook_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guestbook_messages
    ADD CONSTRAINT guestbook_messages_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: video_favs video_favs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_favs
    ADD CONSTRAINT video_favs_pkey PRIMARY KEY (user_id, name);


--
-- Name: video_prog video_prog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_prog
    ADD CONSTRAINT video_prog_pkey PRIMARY KEY (user_id, name);


--
-- Name: idx_ai_keys_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_keys_user ON public.ai_keys USING btree (user_id);


--
-- Name: idx_ai_usage_key_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_usage_key_time ON public.ai_usage_log USING btree (key_id, created_at);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: ai_keys ai_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_keys
    ADD CONSTRAINT ai_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: blog_articles blog_articles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);


--
-- Name: blog_articles blog_articles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: blog_comments blog_comments_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.blog_articles(id);


--
-- Name: blog_comments blog_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: corrected_labels corrected_labels_diagnosis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corrected_labels
    ADD CONSTRAINT corrected_labels_diagnosis_id_fkey FOREIGN KEY (diagnosis_id) REFERENCES public.diagnosis_records(id);


--
-- Name: corrected_labels corrected_labels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.corrected_labels
    ADD CONSTRAINT corrected_labels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: diagnosis_records diagnosis_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_records
    ADD CONSTRAINT diagnosis_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: video_favs video_favs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_favs
    ADD CONSTRAINT video_favs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: video_prog video_prog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_prog
    ADD CONSTRAINT video_prog_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict zObRbaDQ5tsyhoDDfZK72p2kPOGiiv1vyzmbjKXDCzQh8UllPH6OGjoLI5Xzshc


--
-- PostgreSQL database dump
--

\restrict wxzf1zdMm4R1QO1hfNROih9xFklf26eaKTApjWCuUH2IhvWpLpv2vy1bVCQiau3

-- Dumped from database version 18.4 (df16b3c)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, title, slug, description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, cloudinary_public_id, cloudinary_resource_type, cloudinary_format, cloudinary_secure_url, cloudinary_bytes, cloudinary_created_at, cloudinary_version, cloudinary_version_id, cloudinary_width, cloudinary_height, cloudinary_duration, cloudinary_pages, cloudinary_selected_page, cloudinary_thumbnail_url) FROM stdin;
1	zam	2026-08-03 08:35:49.792+00	2026-08-03 08:35:49.791+00	/api/media/file/134124623789983844.jpg	\N	134124623789983844.jpg	image/jpeg	2173720	3840	2160	50	50	payload-media/134124623789983844_1785746145523	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785746148/payload-media/134124623789983844_1785746145523.jpg	2173720	2026-08-03T08:35:48Z	1785746148	ea95490f914ac3c31a210b06fc6a4c66	3840	2160	\N	\N	1	\N
2	Good 	2026-08-05 01:35:01.355+00	2026-08-05 01:35:01.353+00	/api/media/file/IMG_2338.png	\N	IMG_2338.png	image/png	2014373	1504	1128	50	50	payload-media/img-2338_1785893700151	image	png	https://res.cloudinary.com/ngbyptok/image/upload/v1785893700/payload-media/img-2338_1785893700151.png	2014373	2026-08-05T01:35:00Z	1785893700	fff32d4368c753e4897f24fd67a23dfd	1504	1128	\N	\N	1	\N
3	Kkk	2026-08-05 01:36:22.036+00	2026-08-05 01:36:22.036+00	/api/media/file/IMG_2339.png	\N	IMG_2339.png	image/png	852706	1200	900	50	50	payload-media/img-2339_1785893781290	image	png	https://res.cloudinary.com/ngbyptok/image/upload/v1785893781/payload-media/img-2339_1785893781290.png	852706	2026-08-05T01:36:21Z	1785893781	d4a3bc2a004d83b000a6cc099629830f	1200	900	\N	\N	1	\N
4	Hh	2026-08-05 01:36:26.107+00	2026-08-05 01:36:26.107+00	/api/media/file/IMG_2324.jpeg	\N	IMG_2324.jpeg	image/jpeg	161922	800	800	50	50	payload-media/img-2324_1785893785389	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893785/payload-media/img-2324_1785893785389.jpg	161922	2026-08-05T01:36:25Z	1785893785	4b95eef2b0e45bf593ad9ee3887e674f	800	800	\N	\N	1	\N
5	Bbb	2026-08-05 01:36:28.636+00	2026-08-05 01:36:28.636+00	/api/media/file/IMG_2325.jpeg	\N	IMG_2325.jpeg	image/jpeg	125757	1200	750	50	50	payload-media/img-2325_1785893788193	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893788/payload-media/img-2325_1785893788193.jpg	125757	2026-08-05T01:36:28Z	1785893788	4b688b89dcbf44d5f98c5a6f36e14f8d	1200	750	\N	\N	1	\N
6	Kk	2026-08-05 01:36:30.831+00	2026-08-05 01:36:30.831+00	/api/media/file/IMG_2323.jpeg	\N	IMG_2323.jpeg	image/jpeg	90247	640	640	50	50	payload-media/img-2323_1785893790298	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893790/payload-media/img-2323_1785893790298.jpg	90247	2026-08-05T01:36:30Z	1785893790	b2656e27d0d1b7bf426a4710d7bd5530	640	640	\N	\N	1	\N
7	Kk	2026-08-05 01:36:32.151+00	2026-08-05 01:36:32.151+00	/api/media/file/IMG_2322.jpeg	\N	IMG_2322.jpeg	image/jpeg	110742	784	1168	50	50	payload-media/img-2322_1785893791669	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893791/payload-media/img-2322_1785893791669.jpg	110742	2026-08-05T01:36:31Z	1785893791	b92753525c29dc220aafb1940b598092	784	1168	\N	\N	1	\N
8	Kk	2026-08-05 01:36:35.408+00	2026-08-05 01:36:35.408+00	/api/media/file/IMG_2340.jpeg	\N	IMG_2340.jpeg	image/jpeg	458355	1504	1128	50	50	payload-media/img-2340_1785893794832	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893794/payload-media/img-2340_1785893794832.jpg	458355	2026-08-05T01:36:34Z	1785893794	e7a86e08efed00aab136e8af458466df	1504	1128	\N	\N	1	\N
9	Ok	2026-08-05 01:36:41.869+00	2026-08-05 01:36:41.869+00	/api/media/file/IMG_2333.jpeg	\N	IMG_2333.jpeg	image/jpeg	691717	1284	988	50	50	payload-media/img-2333_1785893801233	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785893801/payload-media/img-2333_1785893801233.jpg	691717	2026-08-05T01:36:41Z	1785893801	4371a099b2ee7f11f366e5e3fd2c4711	1284	988	\N	\N	1	\N
14	Z	2026-08-05 03:29:02.033+00	2026-08-05 03:29:02.033+00	/api/media/file/IMG_2344.jpeg	\N	IMG_2344.jpeg	image/jpeg	150191	853	489	50	50	payload-media/img-2344_1785900541565	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785900541/payload-media/img-2344_1785900541565.jpg	150191	2026-08-05T03:29:01Z	1785900541	082b9b26311217a561136e69304b5133	853	489	\N	\N	1	\N
18		2026-08-05 03:34:04.933+00	2026-08-05 03:34:04.933+00	/api/media/file/payload-alt-test.png	\N	payload-alt-test.png	image/png	246	64	64	50	50	payload-media/payload-alt-test_1785900844436	image	png	https://res.cloudinary.com/ngbyptok/image/upload/v1785900844/payload-media/payload-alt-test_1785900844436.png	246	2026-08-05T03:34:04Z	1785900844	0d077c46dc61b8b8e688c7b28b795797	64	64	\N	\N	1	\N
31		2026-08-05 03:51:12.857+00	2026-08-05 03:51:12.856+00	/api/media/file/payload-alt-test-1.png	\N	payload-alt-test-1.png	image/png	246	64	64	50	50	payload-media/payload-alt-test-1_1785901871939	image	png	https://res.cloudinary.com/ngbyptok/image/upload/v1785901872/payload-media/payload-alt-test-1_1785901871939.png	246	2026-08-05T03:51:12Z	1785901872	ed360978316a4bf830a26255b4799e1b	64	64	\N	\N	1	\N
33	\N	2026-08-05 03:56:35.285+00	2026-08-05 03:56:35.284+00	/api/media/file/IMG_2344-1.jpeg	\N	IMG_2344-1.jpeg	image/jpeg	150191	853	489	50	50	payload-media/img-2344-1_1785902194876	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785902194/payload-media/img-2344-1_1785902194876.jpg	150191	2026-08-05T03:56:34Z	1785902194	6421d8e6c93e500e0397308f376eb22a	853	489	\N	\N	1	\N
35	\N	2026-08-05 03:57:05.353+00	2026-08-05 03:57:05.353+00	/api/media/file/134124623789983844-1.jpg	\N	134124623789983844-1.jpg	image/jpeg	2173720	3840	2160	50	50	payload-media/134124623789983844-1_1785902221464	image	jpg	https://res.cloudinary.com/ngbyptok/image/upload/v1785902225/payload-media/134124623789983844-1_1785902221464.jpg	2173720	2026-08-05T03:57:05Z	1785902225	320ae68913bac587cf6fb31611031ff9	3840	2160	\N	\N	1	\N
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages (id, title, slug, content, meta_title, meta_description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
1	\N	2026-08-05 00:59:22.92+00	2026-08-05 00:59:22.919+00
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, title, slug, category_id, excerpt, content, hero_image_id, meta_title, meta_description, updated_at, created_at) FROM stdin;
1	zam	zam	\N	zam	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "zammia how far", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}], "direction": null}}	7	\N	\N	2026-08-05 02:45:48.652+00	2026-08-05 02:45:08.582+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
1	Admin	2026-08-03 08:28:19.333+00	2026-08-03 08:28:19.331+00	admin@admin.com	\N	\N	9ff061ed9ba9d59ccdf442eba2b80604e18bcfd6ebed886ec5bc395817534291	653861ef89c30ccffb3c674aa9beed677400ea7e28e77776f1fc5e52080138f24eecbaf777334d24a5cbada7e85820950f2860df2387a7cd416288cd2fc08af3bac6c85727485e2b0e51f2a00012702bbe8b040b668170938ad13abd639a1640b8d6183a023cfc627bdb3c722e2d78d570956bc7aac07319807b0a4473d8840023e8b7cf9e040bce02c53b2c8f9e0877c2bbe361e8ab4b76f214abdd938ddc750560d85901fbf274d7becdaf92221ed5e6fa37fb8a0af7bfbceb3c8a3f98e5ea78b533c6c74577f1ef0dc8309ffa06660b6d2e8cf4f0fda8db3db9b383984138dfe05545b9c6e5e5b221778f4153ba58b3f40c00ae620700eabc05c8f718cfb3d7aed3577d00b1bc1cccabf979b7829fc34b8fae2dca4f189964af17b05af9629bab22b623a1e62d880bf4daca5d3916b63086bf6486b19a93b152483c5505272af7f8f9ee2f5f95e8a2abf1d1d81010713b36d3f5e9ef8bf266108ed7544be05342787bfb90b29b08344dec209d8136c8b8178d6360e5ddfe0ecf28409215c4924d4600b4a287580c18cc892fbb122f7e970b2e5e4aa281d8ce64d454d5b82b68c0a567eb2b72ed9d559324ac3e62f2d4bf7187ed5ca659755d3ecf1793fdff6f5d280937858ab36314a7c827709f9db31b9c66efddbf9f05ea402ac959fd2e6aa89da17a0ffcebe6ccc383c04f01fbea6f0b9f3a4b9f033bf5586d852cd220	0	\N
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, pages_id, posts_id, categories_id) FROM stdin;
1	\N	1	document	\N	1	\N	\N	\N
2	\N	1	user	1	\N	\N	\N	\N
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	20260803_042552_initial	1	2026-08-03 08:00:26.785+00	2026-08-03 08:00:26.779+00
2	20260803_080235_cloudinary_media_fields	2	2026-08-03 08:03:45.25+00	2026-08-03 08:03:45.245+00
3	20260805_013000_admin_ia	3	2026-08-05 01:40:10.879+00	2026-08-05 01:40:10.879+00
4	20260805_035400_media_alt_optional	4	2026-08-05 03:56:34.148+00	2026-08-05 03:56:34.143+00
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
2	collection-users	{"limit": 10, "editViewType": "default"}	2026-08-03 08:46:27.914+00	2026-08-03 08:32:28.066+00
3	collection-users	{"limit": 10}	2026-08-03 08:46:28.843+00	2026-08-03 08:46:28.842+00
4	collection-users	{"limit": 10}	2026-08-03 08:46:28.86+00	2026-08-03 08:46:28.86+00
1	collection-media	{"limit": 10, "editViewType": "default"}	2026-08-05 00:59:39.25+00	2026-08-03 08:29:17.487+00
7	nav	{"groups": {"Media": {"open": true}, "System": {"open": false}, "Content": {"open": false}}}	2026-08-05 01:50:32.297+00	2026-08-05 01:50:29.2+00
6	collection-categories	{"limit": 10, "editViewType": "default"}	2026-08-05 02:17:44.417+00	2026-08-05 01:49:50.378+00
9	global-site-settings	{"fields": {"_index-0": {"tabIndex": 0}}, "editViewType": "default"}	2026-08-05 02:34:35.141+00	2026-08-05 02:31:03.132+00
8	collection-posts	{"editViewType": "default"}	2026-08-05 02:44:09.942+00	2026-08-05 02:20:24.959+00
5	collection-pages	{"limit": 10, "editViewType": "default"}	2026-08-05 03:16:13.902+00	2026-08-05 01:49:37.393+00
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
5	\N	2	user	1
6	\N	2	user	1
7	\N	3	user	1
8	\N	4	user	1
9	\N	1	user	1
15	\N	7	user	1
17	\N	6	user	1
22	\N	9	user	1
23	\N	8	user	1
24	\N	5	user	1
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (id, site_name, tagline, default_meta_title, default_meta_description, updated_at, created_at) FROM stdin;
1	Zam Studio	\N	\N	\N	2026-08-05 03:17:38.903+00	2026-08-05 03:17:38.903+00
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 36, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, false);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 3, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 5, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 4, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 9, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 24, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict wxzf1zdMm4R1QO1hfNROih9xFklf26eaKTApjWCuUH2IhvWpLpv2vy1bVCQiau3


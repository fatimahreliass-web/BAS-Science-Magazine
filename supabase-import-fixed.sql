-- BAS Science Magazine data import
-- Generated automatically from bas.db

-- categories: 9 row(s)
INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (1, 'Science Unlocked', 'العلوم بين أيدينا', 'Explore surprising scientific ideas, mysteries, discoveries, and concepts that make us look at the world differently.', 'اكتشفوا أفكارًا علمية مدهشة وأسرارًا واكتشافات ومفاهيم تجعلنا ننظر إلى العالم بطريقة مختلفة.', 'science-unlocked', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (2, 'Science on a Plate', 'العلم على مائدتنا', 'Discover the science behind food, nutrition, cooking, ingredients, and the fascinating chemistry and biology happening on our plates.', 'اكتشفوا العلم وراء الطعام والتغذية والطبخ والمكونات والكيمياء والبيولوجيا الرائعة التي تحدث على موائدنا.', 'science-on-a-plate', NULL, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (3, 'Future Lab', 'مختبر المستقبل', 'Explore emerging technologies, artificial intelligence, robotics, medicine, space exploration, and scientific ideas shaping the future.', 'اكتشفوا التقنيات الناشئة والذكاء الاصطناعي والروبوتات والطب واستكشاف الفضاء والأفكار العلمية التي ترسم ملامح المستقبل.', 'future-lab', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (4, 'Planet Earth', 'كوكب الأرض', 'Discover the science of our planet, climate, ecosystems, natural resources, environmental challenges, and solutions.', 'اكتشفوا علوم كوكبنا ومناخه وأنظمته البيئية وموارده الطبيعية والتحديات البيئية والحلول الممكنة.', 'planet-earth', NULL, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (5, 'Mind Lab', 'مختبر العقل', 'Explore the fascinating science of the brain, behavior, perception, memory, emotions, learning, and the human mind.', 'اكتشفوا علم الدماغ والسلوك والإدراك والذاكرة والمشاعر والتعلّم وعالم العقل البشري.', 'mind-lab', NULL, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (6, 'Inside Life', 'داخل عالم الحياة', 'Explore the hidden world of living organisms, cells, microbes, genetics, animals, plants, and the science of life.', 'اكتشفوا العالم الخفي للكائنات الحية والخلايا والميكروبات والحيوانات والنباتات وعلوم الحياة.', 'inside-life', NULL, 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (7, 'Science Voices', 'أصوات علمية', 'Discover the people, ideas, questions, opinions, and stories that connect science with society and everyday life.', 'اكتشفوا الأشخاص والأفكار والأسئلة والآراء والقصص التي تربط العلم بالمجتمع والحياة اليومية.', 'science-voices', NULL, 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (8, 'Science in Action', 'العلم في العمل', 'Explore science through real-world applications, investigations, inventions, engineering, and solutions to real problems.', 'اكتشفوا العلم من خلال تطبيقاته الواقعية والتحقيقات والاختراعات والهندسة والحلول للمشكلات الحقيقية.', 'science-in-action', NULL, 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name_en, name_ar, description_en, description_ar, slug, image, display_order)
VALUES (9, 'Science Playground', 'ملعب العلوم', 'A space for curiosity, scientific fun, puzzles, optical illusions, myths and facts, challenges, surprising phenomena, and interactive science.', 'مساحة للفضول والمرح العلمي والألغاز والخدع البصرية والحقائق والخرافات والتحديات والظواهر المدهشة.', 'science-playground', NULL, 9)
ON CONFLICT (id) DO NOTHING;

-- issues: 1 row(s)
INSERT INTO issues (id, issue_number, month, year, title_en, title_ar, description_en, description_ar, cover_image, pdf_file, publication_date, status, featured, created_at)
VALUES (1, 1, 'September', 2026, 'BAS Science Magazine - Issue 1', '???? BAS ??????? - ????? ?????', 'The first student-run science publication of BAS.', '????? ????? ?? ???? BAS ??????? ?? ????? ??????.', NULL, NULL, NULL, 'draft', TRUE, '2026-09-19 10:33:26')
ON CONFLICT (id) DO NOTHING;

-- students: empty

-- articles: empty


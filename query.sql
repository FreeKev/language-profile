Select
    l.name as languageName,
    p.name as projectName,
    s.title as storyTitle,
    f.question as faqQuestion,
    c.name as countryName
FROM
   languages as l,
   projects as p,
   stories as s,
   stories_related_projects as srp,
   faqs as f,
   faqs_related_projects as frp,
   countries as c
WHERE
  l.id = p.language_id AND
  s.id = srp.story_id AND
  p.id = srp.project_id AND
  f.id = frp.faq_id AND
  p.id = frp.project_id AND
  p.country_id = c.id

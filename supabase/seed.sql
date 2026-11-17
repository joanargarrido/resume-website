-- Example content so the public page renders on a fresh project.
insert into public.profile (id, full_name, date_of_birth, dob_display, city, headline, bio, linkedin_url, github_url)
values (
  1, 'Ada Example', '1992-06-15', 'age', 'Lisbon, Portugal',
  'Full-stack software engineer',
  'I build reliable, accessible web applications. Replace this text from the admin area.',
  'https://www.linkedin.com/in/example', 'https://github.com/example'
)
on conflict (id) do nothing;

insert into public.experience (company, role, location, start_date, end_date, description, company_url, sort_order) values
  ('Acme Corp', 'Senior Engineer', 'Remote', '2022-03-01', null, 'Lead the web platform team.', 'https://example.com', 0),
  ('Globex', 'Software Engineer', 'Lisbon', '2018-09-01', '2022-02-28', 'Built internal tooling and customer dashboards.', null, 1);

insert into public.education (institution, degree, field, start_date, end_date, description, sort_order) values
  ('University of Lisbon', 'MSc', 'Computer Science', '2015-09-01', '2017-07-15', null, 0);

insert into public.skills (name, category, level, sort_order) values
  ('TypeScript', 'Frontend', 5, 0),
  ('React', 'Frontend', 5, 1),
  ('PostgreSQL', 'Backend', 4, 2),
  ('Node.js', 'Backend', 4, 3);

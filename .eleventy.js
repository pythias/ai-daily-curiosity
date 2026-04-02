const markdownIt = require('markdown-it');
const matter = require('gray-matter');
const path = require('path');
const fs = require('fs');

module.exports = function(eleventyConfig) {
  const md = markdownIt({ html: true });

  eleventyConfig.addPassthroughCopy('src/images');

  // Register curiosity collection
  eleventyConfig.addCollection('curiosity', function(collectionApi) {
    const contentDir = path.join(__dirname, 'src/content');
    const items = [];
    if (fs.existsSync(contentDir)) {
      const months = fs.readdirSync(contentDir).filter(d => /^\d{4}-\d{2}$/.test(d));
      for (const month of months.sort()) {
        const monthDir = path.join(contentDir, month);
        const files = fs.readdirSync(monthDir).filter(f => f.endsWith('.md'));
        for (const file of files.sort()) {
          const filePath = path.join(monthDir, file);
          const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
          if (!dateMatch) continue;
          const raw = fs.readFileSync(filePath, 'utf8');
          const parsed = matter(raw);
          let rawDate = parsed.data.date;
          if (rawDate instanceof Date) {
            const y = rawDate.getFullYear();
            const m = String(rawDate.getMonth() + 1).padStart(2, '0');
            const d = String(rawDate.getDate()).padStart(2, '0');
            rawDate = `${y}-${m}-${d}`;
          } else {
            rawDate = String(rawDate || dateMatch[1]);
          }
          if (!rawDate) continue;
          const body = md.render(parsed.content);
          items.push({
            date: rawDate,
            title: parsed.data.title || '',
            subtitle: parsed.data.subtitle || '',
            image: parsed.data.image || '',
            body: body
          });
        }
      }
    }
    return items.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  });

  eleventyConfig.addFilter('allCuriosities', function(collection) {
    return collection.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  });

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', content: 'content' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};

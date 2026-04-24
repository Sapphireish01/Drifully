/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://drifully.com",
  generateRobotsTxt: false, // We handle this via app/robots.ts
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/api/*", "/admin/*"],
};

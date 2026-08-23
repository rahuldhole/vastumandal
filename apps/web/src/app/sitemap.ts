import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
 const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rdcad-express.rahuldhole.com';

 return [
 {
 url: `${baseUrl}/`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 1,
 },
 {
 url: `${baseUrl}/bbs`,
 lastModified: new Date(),
 changeFrequency: 'weekly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/beam`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/column`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/foundation`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/slab`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/tank`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/stairs`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.8,
 },
 {
 url: `${baseUrl}/utilities`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.5,
 },
 {
 url: `${baseUrl}/project`,
 lastModified: new Date(),
 changeFrequency: 'weekly',
 priority: 0.7,
 },
 {
 url: `${baseUrl}/library`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.6,
 },
 {
 url: `${baseUrl}/templates`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.6,
 },
 {
 url: `${baseUrl}/guide`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.5,
 },
 {
 url: `${baseUrl}/faq`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.5,
 },
 {
 url: `${baseUrl}/setup`,
 lastModified: new Date(),
 changeFrequency: 'monthly',
 priority: 0.5,
 },
 ];
}

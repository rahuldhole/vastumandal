import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
 const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rdcad-express.rahuldhole.com';

 return {
 rules: {
 userAgent: '*',
 allow: '/',
 },
 sitemap: `${baseUrl}/sitemap.xml`,
 };
}

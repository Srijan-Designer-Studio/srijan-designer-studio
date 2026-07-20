import { getKeywords } from '@/app/actions/keywords';
import KeywordsClientWrapper from './KeywordsClientWrapper';

export const metadata = {
  title: 'Keywords Management | Admin Dashboard',
};

export default async function KeywordsPage() {
  // সার্ভার সাইড থেকে কিওয়ার্ডগুলো ফেচ করা হচ্ছে
  const initialKeywords = await getKeywords();

  return (
    <KeywordsClientWrapper initialKeywords={initialKeywords} />
  );
}
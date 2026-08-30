export const dynamic = 'force-dynamic';
import { getKeywords } from '@/app/actions/keywords';
import KeywordsClientWrapper from './KeywordsClientWrapper';

export const metadata = {
  title: 'Keywords Management | Admin Dashboard',
};

export default async function KeywordsPage() {
  const initialKeywords = await getKeywords();

  return (
    <KeywordsClientWrapper initialKeywords={initialKeywords} />
  );
}

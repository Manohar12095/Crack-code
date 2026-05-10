import LearnClient from '@/components/LearnClient';

export default async function LessonDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  return <LearnClient slug={resolvedParams.slug} />;
}

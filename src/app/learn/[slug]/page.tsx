'use client';
import LearnPage from '../page';
import { use } from 'react';

export default function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  // We just reuse the LearnPage but it needs to know which lesson to select.
  // We can pass a prop or just let LearnPage handle it via URL.
  // Actually, I'll update LearnPage to handle the slug from params if provided.
  return <LearnPage slug={resolvedParams.slug} />;
}

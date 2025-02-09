import { redirect } from 'next/navigation'
import { getChallengeById } from '@/lib/sanity.queries'
import { ChallengeDetail } from '@/components/ChallengeDetail'

type Props = {
    params: Promise<{ id: string }>
}

export default async function ChallengePage({ params }: Props) {
  const { id } = await params
  const challenge = await getChallengeById(id)

  if (!challenge) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <ChallengeDetail challenge={challenge} />
      </div>
    </div>
  )
} 
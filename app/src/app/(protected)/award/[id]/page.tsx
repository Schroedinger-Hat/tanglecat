import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'
import { AwardDetail } from '@/components/AwardDetail'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AwardPage({ params }: Props) {
  const { id } = await params
  const tokenCookie = (await cookies()).get('user_token')?.value

  if (!tokenCookie) {
    redirect('/login')
  }

  // Fetch award and completion status
  const award = await client.fetch(`
    *[_type == "award" && _id == $awardId][0] {
      _id,
      name,
      abstract,
      description,
      isSupervised,
      image,
      points,
      requirements[] {
        _key,
        title,
        description
      }
    }
  `, { awardId: id })

  if (!award) {
    redirect('/dashboard')
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <AwardDetail award={award} />
      </div>
    </div>
  )
}
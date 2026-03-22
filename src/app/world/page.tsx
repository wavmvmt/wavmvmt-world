import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorldLoader from '@/components/WorldLoader'

export default async function WorldPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/world/login')
  }

  return <WorldLoader />
}

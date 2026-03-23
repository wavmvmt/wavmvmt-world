import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/AdminDashboard'

// Only these emails can access admin
const ADMIN_EMAILS = [
  'wavmvmt@gmail.com',
  'shim.audio@gmail.com',
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/world/login?reason=admin')
  }

  // Fetch all data server-side
  const [contestants, shares, visits] = await Promise.all([
    supabase.from('contestants').select('*').order('registered_at', { ascending: false }).limit(500),
    supabase.from('contestant_shares').select('*').order('shared_at', { ascending: false }).limit(1000),
    supabase.from('world_visits').select('*').order('visited_at', { ascending: false }).limit(100),
  ])

  return (
    <AdminDashboard
      contestants={contestants.data || []}
      shares={shares.data || []}
      visits={visits.data || []}
      userEmail={user.email || ''}
    />
  )
}

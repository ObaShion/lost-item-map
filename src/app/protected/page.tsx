import { redirect } from 'next/navigation'
import Link from 'next/link'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border py-12 px-10 sm:px-12 m-10 shadow-sm">
        <div className="flex flex-col gap-6">
          <Link href="/">
            <Button className="w-full bg-black">
              始める
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

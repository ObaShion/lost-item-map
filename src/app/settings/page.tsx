import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/auth/login')
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-white">
            <div className="flex flex-col gap-6">
                <p>アカウント管理</p>
                <LogoutButton />
            </div>
        </div>
    )
}

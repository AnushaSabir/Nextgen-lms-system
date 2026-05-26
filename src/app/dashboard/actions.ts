'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPaymentReference(formData: FormData) {
  const supabase = await createClient()
  const invoice_id = formData.get('invoice_id') as string
  const reference = formData.get('reference') as string

  // We update the invoice status to "Under Review" and store the transaction ID 
  // in stripe_session_id (reusing the column since we are using manual bank transfer now)
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'Under Review', stripe_session_id: reference })
    .eq('id', invoice_id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/fee')
  revalidatePath('/admin/invoices')
}

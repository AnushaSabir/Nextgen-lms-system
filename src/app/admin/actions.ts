'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const instructor = formData.get('instructor') as string
  const total_modules = parseInt(formData.get('total_modules') as string) || 0

  const { error } = await supabase.from('courses').insert([
    { title, description, instructor, total_modules }
  ])

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/courses')
  revalidatePath('/dashboard/courses')
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string

  const { error } = await supabase.from('announcements').insert([
    { title, content, type }
  ])

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/announcements')
  revalidatePath('/dashboard/announcements')
}

export async function generateInvoice(formData: FormData) {
  const supabase = await createClient()
  const student_id = formData.get('student_id') as string
  const amount = parseFloat(formData.get('amount') as string)
  const due_date = formData.get('due_date') as string
  const invoice_number = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

  const { error } = await supabase.from('invoices').insert([
    { student_id, amount, due_date, invoice_number }
  ])

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/invoices')
  revalidatePath('/dashboard/fee')
}

export async function markInvoicePaid(formData: FormData) {
  const supabase = await createClient()
  const invoice_id = formData.get('invoice_id') as string

  // Get invoice details first
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, auth.users(email, user_metadata)')
    .eq('id', invoice_id)
    .single()

  if (!invoice) throw new Error('Invoice not found')

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'Paid' })
    .eq('id', invoice_id)

  if (error) throw new Error(error.message)

  // Send Fee Cleared Email
  const { sendFeeClearedEmail } = await import('@/utils/email')
  const invoiceData = invoice as any;
  const email = invoiceData.auth?.users?.email || invoiceData.users?.email
  if (email) {
    await sendFeeClearedEmail(email, invoiceData.amount, invoiceData.invoice_number)
  }
  
  revalidatePath('/admin/invoices')
  revalidatePath('/dashboard/fee')
}

export async function sendFeeReminder(formData: FormData) {
  const supabase = await createClient()
  const invoice_id = formData.get('invoice_id') as string

  // Get invoice details
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, auth.users(email, user_metadata)')
    .eq('id', invoice_id)
    .single()

  if (!invoice) throw new Error('Invoice not found')

  // Send Fee Reminder Email
  const { sendFeeReminderEmail } = await import('@/utils/email')
  const invoiceData = invoice as any;
  const email = invoiceData.auth?.users?.email || invoiceData.users?.email
  if (email) {
    await sendFeeReminderEmail(email, invoiceData.amount, invoiceData.invoice_number, invoiceData.due_date)
  }
}

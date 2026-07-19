export async function updateAddress(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const addressId = formData.get('id')
  const isDefault = formData.get('isDefault') === 'true'

  if (!addressId) throw new Error('Address ID is required for updating.')

  // If setting this as default, remove the default status from all other addresses first
  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .update({
      title: formData.get('title'),
      address_line_1: formData.get('addressLine1'),
      address_line_2: formData.get('addressLine2'),
      city: formData.get('city'),
      state: formData.get('state'),
      postal_code: formData.get('postalCode'),
      is_default: isDefault
    })
    .eq('id', addressId)
    .eq('user_id', user.id) // Security check: Ensure the user actually owns this address

  if (error) throw new Error(error.message)

  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
  return { success: true }
}
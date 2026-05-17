import { supabase } from '@/lib/supabase/client'

export async function uploadDocument(file: File, userId: string) {
  //unique name or cuh
  const fileExt=file.name.split('.').pop()
  const fileName=`${Math.random()}.${fileExt}`
  const filePath=`${userId}/${fileName}`
  
  //upload to bucket publication_proof
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('publication_proof')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  //update db col
  //save path string so find file later
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ resume_url: uploadData.path })
    .eq('id', userId)

  if (dbError) throw dbError
  
  return uploadData.path
}

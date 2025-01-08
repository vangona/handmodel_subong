import { supabase } from './supabaseClient'

export interface PageContent {
  id: string
  page_type: 'intro' | 'collaboration' | 'settings'
  content: {
    content?: string
    site_title?: string
    menu_items?: {
      [key: string]: string
    }
  }
  created_at: string
  updated_at: string
}

export async function getPageContent(pageType: string): Promise<PageContent | null> {
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .eq('page_type', pageType)
    .single()

  if (error) {
    console.error('Error fetching page content:', error)
    return null
  }

  return data
}

export async function updatePageContent(pageType: string, content: object): Promise<boolean> {
  const { error } = await supabase
    .from('page_contents')
    .update({ 
      content,
      updated_at: new Date().toISOString()
    })
    .eq('page_type', pageType)

  if (error) {
    console.error('Error updating page content:', error)
    return false
  }

  return true
}

export async function getSiteSettings() {
  return getPageContent('settings')
}

export async function updateSiteSettings(content: object) {
  return updatePageContent('settings', content)
} 
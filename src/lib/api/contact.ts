import { supabase } from './supabaseClient';

export interface ContactForm {
    name: string;
    company: string;
    phone: string;
    project_type: string;
    message: string;
}

export async function submitContactForm(form: ContactForm) {
    const { error } = await supabase
        .from('contact_forms')
        .insert([form]);

    if (error) throw error;
    return true;
} 
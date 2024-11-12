// /pages/api/service.js or /app/api/service/route.js (depending on your Next.js version)
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { email, sources } = await request.json();

    // Check if the user already exists
    let { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116: No rows found, which is acceptable
      throw userError;
    }

    // If user doesn't exist, insert them
    let userId;
    if (!existingUser) {
      const { data: newUser, error: insertUserError } = await supabase
        .from('users')
        .insert({ email })
        .select()
        .single();

      if (insertUserError) throw insertUserError;
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // Process each source
    for (const sourceIdentifier of sources) {
      // Assuming all sources are of type 'website' for simplicity
      let type = 'website';
      if (sourceIdentifier.includes('x.com') || sourceIdentifier.includes('twitter.com')) {
        type = 'x';
      } else if (sourceIdentifier.includes('arxiv')) {
        type = 'arxiv';
      }

      // Check if the source already exists
      let { data: existingSource, error: sourceError } = await supabase
        .from('sources')
        .select('*')
        .eq('type', type)
        .eq('identifier', sourceIdentifier)
        .single();

      if (sourceError && sourceError.code !== 'PGRST116') {
        throw sourceError;
      }

      // If source doesn't exist, insert it
      let sourceId;
      if (!existingSource) {
        const { data: newSource, error: insertSourceError } = await supabase
          .from('sources')
          .insert({ type, identifier: sourceIdentifier })
          .select()
          .single();

        if (insertSourceError) throw insertSourceError;
        sourceId = newSource.id;
      } else {
        sourceId = existingSource.id;
      }

      // Link user and source in user_sources table
      const { error: linkError } = await supabase
        .from('user_sources')
        .insert({ user_id: userId, source_id: sourceId });

      if (linkError && linkError.code !== '23505') {
        // 23505: Unique violation, which is acceptable
        throw linkError;
      }
    }

    return NextResponse.json({ message: 'Data inserted successfully!' });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
